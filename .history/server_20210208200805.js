const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

const hederaSQLAPI = require('./routes/hederaSQLAPI.js')
const vaccinePassportAPI = require('./routes/vaccinePassportAPI');

app.use('/hederaSQLAPI',hederaSQLAPI);
app.use('/vaccinePassportAPI',vaccinePassportAPI);

app.listen(port, () => {
    console.log(`server is listning on port ${port}`);c
});
