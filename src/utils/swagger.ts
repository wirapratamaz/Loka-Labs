import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

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
    },
    paths: {
      '/api/getUserData': {
        get: {
          summary: 'Get user data from ICP canister',
          description: 'Retrieves user data from an ICP canister by principal ID',
          tags: ['ICP'],
          parameters: [
            {
              in: 'query',
              name: 'principal',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'ICP Principal ID (e.g., bx77d-5qpr6-p3fkb-kcipj-iqpre-bqges-v443n-fwcaf-lbpvg-cn4xk-cae)'
            }
          ],
          responses: {
            '200': {
              description: 'User data successfully retrieved',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/UserData'
                  }
                }
              }
            },
            '400': {
              description: 'Bad request, invalid principal ID',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/getMemecoinPrice': {
        get: {
          summary: 'Get memecoin price and metadata from Solana',
          description: 'Retrieves token metadata and price information from Solana blockchain',
          tags: ['Solana'],
          parameters: [
            {
              in: 'query',
              name: 'contract',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'Solana token address (e.g., DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263)'
            }
          ],
          responses: {
            '200': {
              description: 'Token data successfully retrieved',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TokenData'
                  }
                }
              }
            },
            '400': {
              description: 'Bad request, invalid token address',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: process.env.NODE_ENV === 'production' ? [] : ['./src/routes/*.ts', './src/swagger/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi }; 