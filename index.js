const dotenv = require('dotenv')
dotenv.config()

const {port} = require('./api/config')

const app = require('./api/server')

app.listen(port, ()=> {
    console.log(`hello on http://localhost:${port}`)
} )