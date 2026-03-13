const express = require('express');
const { connectDb } = require('./lib/connection');

const app = express();
const PORT = process.env.PORT || 8000;

connectDb();

app.use(express.json());


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});