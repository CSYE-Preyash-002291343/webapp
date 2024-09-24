const express = require('express');
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.get('/healthz', (req, res) => {
    try{
        res.sendStatus(200);
    }catch(err){
        res.sendStatus(503);
    }
});

app.all('*', (req, res) => {
    res.sendStatus(405);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});