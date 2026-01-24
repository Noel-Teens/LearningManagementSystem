const path = require('path');
// This tells dotenv to look in the parent directory for the .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

connectDB();

const server = app.listen(PORT || 5000, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT || 5000}`);
});