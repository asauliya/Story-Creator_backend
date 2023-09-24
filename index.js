const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors') 

connectToMongo();
const app = express()
const port = 5000


// dotenv.config();

app.use(cors());
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post-story'))
// app.use(require('./routes/like-story'))


app.listen(port, () => {
  console.log(`Educhamp backend listening at http://localhost:${port}`)
})