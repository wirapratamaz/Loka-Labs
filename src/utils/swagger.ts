import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Loka Labs API Documentation',
      version: '1.0.0',
      description: 'API documentation for Loka Labs backend services integrating with ICP and Solana',
      contact: {
        name: 'Loka Labs Team'
      },
    },
    servers: [
      {
        url: '/',
        description: 'Local Development Server'
      },
      {
        url: 'https://loka-labs-production.up.railway.app',
        description: 'Production Server'
      }
    ],
    components: {
      schemas: {
        UserData: {
          type: 'object',
          properties: {
            referralCode: { type: 'string' },
            referrerCode: { type: 'string' },
            queueIdx: { type: 'integer' },
            rank: { type: 'array' },
            referralsLevel1: { type: 'integer' },
            referralsLevel2: { type: 'integer' },
            referralsLevel3: { type: 'integer' },
            referrerWallet: { type: 'string' }
          }
        },
        TokenData: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            symbol: { type: 'string' },
            uri: { type: 'string' },
            tokenAddress: { type: 'string' },
            metadataFound: { type: 'boolean' },
            price: { type: 'string' },
            metadata: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                symbol: { type: 'string' },
                image: { type: 'string' },
                description: { type: 'string' },
                creator: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    site: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/swagger/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi }; 