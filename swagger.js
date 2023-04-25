const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MyStore API documentation',
            version: '1.0.0',
        },
    },
    apis: [path.join(__dirname, '/routes/*.js')], // Path to the API routes folder
};

const specs = swaggerJSDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
