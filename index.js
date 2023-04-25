const express = require('express');
const database = require('./config/dbConnection');
const PORT = 7001;
const app = express();
const routes = require('./routes');
const swagger = require('./swagger');
app.use(express.json());

swagger(app);

// Register all routes
app.use('/api', routes);

// Connect to database
database.authenticate()
    .then(() => {
        console.log('Database connected!');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

//App Initialisation
app.listen(PORT, () => {
    console.log(`server up and running on port${PORT} `);
})
