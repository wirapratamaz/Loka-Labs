# Loka Labs Backend

Backend integration with ICP (Internet Computer Protocol) and Solana for Loka Labs. This Node.js application provides endpoints to fetch user data from ICP canister and memecoin price/metadata from Solana.

## Technologies Used

- Node.js and Express.js for the backend server
- TypeScript for type safety
- PostgreSQL for request logging
- Internet Computer Protocol (ICP) integration using @dfinity/agent
- Solana blockchain integration using @solana/web3.js and @metaplex-foundation/js with RPC Url from Chainstack

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- Bun (optional, for better development experience)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd loka-labs
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
   or with Bun:
   ```
   bun install
   ```

3. Create a `.env` file in the root directory (see `.env.example` for required variables):
   ```
   PORT=4000
   DATABASE_URL=postgres://username:password@hostname:port/database
   ICP_HOST=https://ic0.app
   SOLANA_RPC_URL=https://your-chainstack-solana-rpc-url.com
   ```

4. Set up the PostgreSQL database:
   ```sql
   CREATE TABLE request_logs (
       id SERIAL PRIMARY KEY,
       principal TEXT NOT NULL,
       called_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
   );
   ```

   **Example Database Records**:
   ```json
   {
   "request_logs": [
     {
       "id": 1,
       "principal": "bx77d-5qpr6-p3fkb-kcipj-iqpre-bqges-v443n-fwcaf-lbpvg-cn4xk-cae",
       "called_at": "2025-04-25T18:22:50.578Z"
     }
   ]}
   ```

## Running the Application

### Development Mode
```
npm run dev
```
or with Bun:
```
bun run dev
```

### Production Mode
```
npm run build
npm start
```
or with Bun:
```
bun run build
bun start
```

## Docker Setup

The application can be run using Docker, which simplifies the setup process and ensures consistent environments.

### Prerequisites
- Docker
- Docker Compose

### Running with Docker

1. Clone the repository:
   ```
   git clone <repository-url>
   cd loka-labs-backend
   ```

2. Create a `.env` file in the root directory with your Solana RPC URL:
   ```
   SOLANA_RPC_URL=https://your-solana-rpc-endpoint.com
   ```

3. Build and start the containers:
   ```
   docker-compose up -d
   ```

4. To stop the containers:
   ```
   docker-compose down
   ```

### Docker Volumes

- PostgreSQL data is persisted in a named volume `postgres-data`
- The application code is mounted as a volume for development, enabling hot-reloading

## Sequence Diagrams

The following diagrams illustrate the request flow for each endpoint:

### /getUserData Flow

```mermaid
sequenceDiagram
    participant Client
    participant Express as Express Server
    participant Controller as User Controller
    participant ICP as ICP Service
    participant Canister as ICP Canister
    participant DB as PostgreSQL

    Client->>Express: GET /api/getUserData?principal={id}
    Express->>Controller: Request with principal param
    Controller->>ICP: getUserData(principal)
    ICP->>Canister: Call getUserData function
    Canister-->>ICP: Return user data
    ICP-->>Controller: Return serialized data
    Controller->>DB: Log request (principal, timestamp)
    DB-->>Controller: Confirm log saved
    Controller-->>Express: JSON response
    Express-->>Client: User data
```

### /getMemecoinPrice Flow

```mermaid
sequenceDiagram
    participant Client
    participant Express as Express Server
    participant Controller as Token Controller
    participant Solana as Solana Service
    participant Metaplex as Metaplex
    participant Jupiter as Jupiter Price API
    participant Blockchain as Solana Blockchain

    Client->>Express: GET /api/getMemecoinPrice?contract={address}
    Express->>Controller: Request with contract param
    Controller->>Solana: getTokenMetadata(tokenAddress)
    
    par Metadata Request
        Solana->>Metaplex: findByMint(mintAddress)
        Metaplex->>Blockchain: Query token metadata
        Blockchain-->>Metaplex: Return metadata
        Metaplex-->>Solana: Return NFT data
    and Price Request
        Solana->>Jupiter: Query token price
        Jupiter-->>Solana: Return price data
    end
    
    Solana-->>Controller: Combined metadata and price
    Controller-->>Express: JSON response
    Express-->>Client: Token data with price
```

## API Endpoints

### 1. Get User Data from ICP Canister

**Endpoint**: `/api/getUserData`

**Method**: GET

**Query Parameters**:
- `principal` (required): ICP Principal ID

**Example**:
```
GET /api/getUserData?principal=bx77d-5qpr6-p3fkb-kcipj-iqpre-bqges-v443n-fwcaf-lbpvg-cn4xk-cae
```

**Response**:
```json
{
  "referralCode": "PUPS1327478D55",
  "referrerCode": "",
  "queueIdx": 0,
  "rank": [["yapsu-qrb4m-hsu7e-omaxj-z54lh-ftnku-b637p-rbhl5-pxjgd-dzn75-mqe", 3]],
  "referralsLevel1": 0,
  "referralsLevel2": 0,
  "referralsLevel3": 0,
  "referrerWallet": ""
}
```

**Implementation Details**:
- Makes a call to the ICP canister with ID `ypo2z-ayaaa-aaaam-qdjka-cai`
- Uses the `getUserData` method on the canister
- Handles BigInt serialization for proper JSON responses
- Logs requests to PostgreSQL for tracking
- Implements proper error handling for network issues and invalid inputs

### 2. Get Memecoin Price/Metadata from Solana

**Endpoint**: `/api/getMemecoinPrice`

**Method**: GET

**Query Parameters**:
- `contract` (required): Solana token address

**Example Request**:
```
GET /api/getMemecoinPrice?contract=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
```

**Example Response**:
```json
{
  "name": "Bonk",
  "symbol": "Bonk",
  "uri": "https://arweave.net/QPC6FYdUn-3V8ytFNuoCS85S2tHAuiDblh6u3CIZLsw",
  "tokenAddress": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "metadataFound": true,
  "price": "0.0000198765",
  "metadata": {
    "name": "Bonk",
    "symbol": "Bonk",
    "image": "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    "description": "The Official Bonk Inu token",
    "creator": {
      "name": "DEXLAB MINTING LAB",
      "site": "https://www.dexlab.space"
    }
  }
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Port for the Express server to listen on | 4000 |
| DATABASE_URL | PostgreSQL connection string | postgres://postgres:password@localhost:5432/lokalabs |
| ICP_HOST | ICP host URL | https://ic0.app |
| SOLANA_RPC_URL | Chainstack's Solana RPC URL | https://solana-mainnet.chainstack.com/... |

### Chainstack Solana RPC Configuration

The application uses Chainstack's Solana RPC for retrieving token metadata. Below is an example of the Chainstack Solana node configuration:

![Chainstack Solana RPC Configuration](img/image.png)

### Chainstack Metrics and Monitoring

The Chainstack dashboard provides real-time metrics for monitoring your RPC node usage:

![Chainstack Performance Metrics](img/image2.png)

## Technical Implementation Details

### ICP Integration

The ICP integration uses the @dfinity/agent library to interact with the Internet Computer canister. Key implementation aspects:

1. **Canister Interface Definition**: 
   - We use a Candid IDL factory to define the structure of the canister's `getUserData` method
   - The function returns a record with referral information, rank, and other user metrics

2. **Agent Management**:
   - Uses HttpAgent with fetch implementation from isomorphic-fetch
   - Implements agent caching for better performance
   - Handles different ICP networks via environment configuration

3. **BigInt Handling**:
   - Implements custom BigInt to Number/String conversion to support JSON serialization
   - Preserves numeric precision for large values using string representation

4. **Error Handling**:
   - Provides detailed error messages for common failure scenarios
   - Includes network connectivity errors, canister rejections, and invalid inputs

## Testing

The application includes comprehensive unit and integration tests using Jest.

### Running Tests

```
npm test
```

To run tests with coverage report:

```
npm run test:coverage
```

To run tests in watch mode during development:

```
npm run test:watch
```

### Test Structure

- **Unit Tests**: Test individual utility functions and services
- **Integration Tests**: Test API endpoints and middleware
- **Mocks**: Dependencies are mocked to isolate test subjects

## Documentation

### Sign-In with Bitcoin (SIWB) and ICP Integration

To better understand the SIWB authentication mechanism used in this project, refer to our detailed explanation document:

- [SIWB and ICP Delegation Identity](./siwb-icp-explanation.markdown) - Comprehensive explanation of how Sign-In with Bitcoin works with Internet Computer's Delegation Identity system

This document covers:
- The fundamentals of SIWB authentication
- How ICP integrates with Bitcoin for authentication
- Delegation Identity creation and usage
- Security aspects and session management
- Implementation details including canister verification