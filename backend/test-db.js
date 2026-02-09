require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing DB Access...');
console.log('URI:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'undefined');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE:', err.message);
        process.exit(1);
    });
