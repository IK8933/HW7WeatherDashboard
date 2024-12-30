// Import the routes
// TODO: Serve static files of entire client dist folder
// TODO: Implement middleware for parsing JSON and urlencoded form data
// TODO: Implement middleware to connect the routes
// Start the server on the port
// Import the routes
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/index.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('../client/dist'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
