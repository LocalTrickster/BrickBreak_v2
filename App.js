const express = require('express');

const app = express();
app.listen(3000);

app.use((req,res) => {
    console.log(req.url);
    res.sendFile(req.url, {root: __dirname});
} )