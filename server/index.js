const app = require("./app")

require('dotenv').config() // to use .env variables
const PORT = process.env.PORT
app.listen(PORT, ()=>{
	console.log(`THE SERVER HAS STARTED!  BIG O!  SHOW TIME! listening on ${PORT}`)
})