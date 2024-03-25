const { faker } = require('@faker-js/faker')
const { Pool } = require('pg')
const axios = require('axios')

Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}

function randomLimitedSelection(numberOfSelections, choices){
    let updatedChoices = choices;
    let selection = [];
    for(let i=0 ; i<numberOfSelections; i++){
        console.log("UPDATED CHOICES:  ", updatedChoices);
        if(updatedChoices.length){
            selectedOption = choices.random();
            updatedChoices = updatedChoices.filter((option)=> option!==selectedOption);
            selection.push(selectedOption);
        }

    }
    console.log("SELECTED INTERESTS")
    return selection;
}

const users = []
const genderOptions = ["male", "female", "non-binary"]
const sexualPreferenceOptions = ["bisexual", "male", "female"]

const softDefinerOptions = ["work", "dogs", "music", "travel", "outdoors", "books",
	"adventure", "food", "hiking", "sports", "gaming", "movies", "tv", "art",
	"nature", "animals", "cars", "tech", "fashion", "beauty", "fitness",
	"health", "science", "history", "politics", "religion", "philosophy",
	"psychology", "education", "family", "friends", "cats"]

    const pool = new Pool({
        user: 'postgres',
        host: '127.0.0.1', // LOCAL HOST - note: 127.0.0.1 true local host translated in your /etc/hosts (a file that exists on your system and does main name translation for you)
        database: 'site_unseen',
        password: 'PassWordle101!',
        port: 5432,
    })

const connectToDatabase = () => {
	pool.connect((err, client, release) => {
		if (err) {
			console.log('Error acquiring client', err.stack)
			console.log('Retrying in 5 seconds...')
			setTimeout(connectToDatabase, 5000)
		} else {
			console.log('Connected to database')
			initUsers()
				.then(() => {
					console.log("User creating finished, you can close this window")
				})
		}
	})
}
connectToDatabase()

const createUser = async () => {
    let gender = genderOptions.random();
	let firstname, lastname
	if (gender === "man") {
		firstname = faker.name.firstName('male')
		lastname = faker.name.lastName('male')
	} else if (gender === "female") {
		firstname = faker.name.firstName('female')
		lastname = faker.name.firstName("female")
	} else {
		firstname = faker.name.firstName()
		lastname = faker.name.lastName()
	}
	let username = faker.internet.userName(firstname, lastname)
	let email = faker.internet.email(firstname, lastname)
	let user = {
		username,
		firstname,
		lastname,
		email,
		password: "$2b$10$7yu6NkhTEk/uCAsXjlAS2OqpDQ2mSP0WQCNtKK97hCDDC12xB/PPa", 
		verified: "YES"
	}
	users.push(user)
	let sql = `INSERT INTO users (username, firstname, lastname, email, password, verified) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`
	let values = [user.username, user.firstname, user.lastname, user.email, user.password, user.verified]
	let res = await pool.query(sql, values)
	return (res.rows[0].id)
}

const createUserInfo = async (id, gender) => {
	let age = getRandomInt(18, 120)
	let sexual_pref = sexualPreferenceOptions.random()
	let biography = faker.lorem.paragraph()
	let coordinates = faker.address.nearbyGPSCoordinate([60.180929, 24.957521], 5000, true)
	let city_data = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=${process.env.GOOGLE_API}`)
	let user_location
    let interests = randomLimitedSelection(5 , softDefinerOptions)
	let length = city_data.data.results.length
	if (city_data.data.results.length > 0)
		user_location = city_data.data.results[length - 1].formatted_address
	else
		user_location = "Unknown"
	console.log('user_location', user_location)
	let ip_location = `(${coordinates[0]}, ${coordinates[1]})`
	let sql = `INSERT INTO user_info (user_id, gender, age, sexual_pref, biography, user_location, ip_location, interests) VALUES ($1,$2,$3,$4,$5,$6,$7, $8)`
    console.log("interests: ", interests)
	let values = [id, gender, age, sexual_pref, biography, user_location, ip_location, interests]
	await pool.query(sql, values)
}




const initUsers = async () => {
	console.log("User creating started")

	for (let i = 0; i < 50; i++) {
		console.log("Creating user " + i)
		let gender = genderOptions.random()
		let id = await createUser(gender)
		await createUserInfo(id, gender)
	}
}