import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hire Dey Go API",
      version: "1.0.0",
      description: "API documentation for Hire Dey Go"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ]
  },
  apis: [
    "./src/modules/auth/*.js",
    "./src/modules/job/*.js",  
    "./src/app.js"
  ]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;