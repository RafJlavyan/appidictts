interface SwaggerOptions {
    swaggerDefinition: {
      openapi: string;
      info: {
        title: string;
        version: string;
        description: string;
      };
      servers: {
        url: string;
        description: string;
      }[];
    };
    apis: string[];
  }

const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation for your API",
    },
    servers: [
      {
        url: process.env.SERVER_URL!,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

export default swaggerOptions;