const express = require("express");
const cors = require("express");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json())

app.get('/', async(req, res) => {
    res.send('Server Running');
})

app.listen(port, () => {
    console.log(`Port is running on ${port}`);
})