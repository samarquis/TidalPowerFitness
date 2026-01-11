import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tidal Power Fitness API',
      version: '1.0.0',
      description: 'Enterprise-grade fitness management platform API documentation.',
      contact: {
        name: 'API Support',
        url: 'https://tidalpowerfitness.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://tidal-power-backend.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
        systemKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-system-key',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: "TPF API Documentation",
  }));

  // Export spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📝 Swagger documentation available at /api-docs');
};
