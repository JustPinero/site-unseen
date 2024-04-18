require('dotenv').config() // to use .env variables
const express = require('express')
const app = express()
const cors = require("cors")
//middleware
app.use(cors());
app.use(express.json());


const SERVERPORT = process.env.PORT
app.listen(SERVERPORT, ()=>{
	console.log(`THE SERVER HAS STARTED!  BIG O!  SHOW TIME! listening on ${5000}`)
})
// app.use(express.json()) // needed to attach JSON data to POST body property
// var nodemailer = require('nodemailer'); // middleware to send e-mails
// const cors = require('cors') // Cross-origin resource sharing (CORS) middleware is required to allow requests from other origins
// const bcrypt = require("bcrypt") // For password hashing and comparing
// const session = require('express-session'); // for session management
// const multer = require('multer') // for image upload and storage
// const fs = require('fs'); // for base64 conversion of images
// const path = require('path')
// app.use(cors())
// app.use(express.static('build')) // express checks if the 'build' directory contains the requested file
// app.use('/images', express.static('./images')) // to serve static files to path /images, from images folder
// app.use(session({ secret: 'su', saveUninitialized: true, resave: true }));
// const http = require('http').Server(app)


// var connectionString = process.env.DBURL

// const { Pool } = require('pg')
// const pool = new Pool({connectionString
// })

// const connectToDatabase = () => {
// 	pool.connect((err, client, release) => {
// 		if (err) {
// 			console.log('Error acquiring client', err.stack)
// 			console.log('Retrying in 5 seconds...')
// 			setTimeout(connectToDatabase, 5000)
// 		} else {
// 			console.log('Connected to database')
// 		}
// 	})
// }
// connectToDatabase()

// require('./routes/users.js')(app, pool)

// const PORT = process.env.PORT || 3001

// http.listen(PORT, () => {
// 	console.log(`Server listening on ${PORT}`)
// })