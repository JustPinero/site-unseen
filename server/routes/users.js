var express = require('express');
var router = express.Router();
const db = require("../db");
const { faker } = require('@faker-js/faker');

/* GET all users  */
router.get('/', async(req,res)=>{
	try {
		const allUsers = await db.query(
		`SELECT * FROM users`
	);
	console.log(allUsers.rows)
	res.json(allUsers.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET all users by gender */
router.get('/gender/:gender', async(req,res)=>{
	try {
    const {gender} = req.params;
		const allUsersByGender = await db.query(
		`SELECT * FROM users WHERE gender = $1`,[gender]
	);
	console.log(allUsersByGender.rows)
	res.json(allUsersByGender)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET user by id */
router.get('/:id', async(req,res)=>{
	try {
    const {id} = req.params
		const user = await db.query(
		`SELECT * FROM users where id=$1`,[id]
	);
	console.log(user.rows)
	res.json(user.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});


/* GET ALL users who still need dates */
router.get('/dates/:datecount', async(req,res)=>{
	try {
    const {datecount} = req.params
		const sortedUsers = await db.query(
      `
      SELECT users.*, COUNT(matches.user1_id) AS dates
      FROM users
      LEFT JOIN matches
      ON matches.user1_id = users.id
      GROUP BY users.id
      HAVING COUNT(matches.user1_id) < $1
      ORDER BY dates
      ;`, [datecount]
	);
	console.log(sortedUsers.rows)
	res.json(sortedUsers.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* CREATE user */
router.post('/', async(req, res)=>{
	try {
		const {username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography} =req.body;
		const newUser = await db.query(
		`insert into users (username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		[username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography]
	);
	console.log(newUser.rows)
	res.json(newUser.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});


/* GENERATE RANDOM user */
router.post('/generate', async(req, res)=>{
	try {
  const userGenerationHelper = ()=>{
    const {generatedUserHasGender, generatedUserGender, generatedUserHasSexuality, generatedUserSexuality} = req.body;
    /* STATIC VALUES */
    const genderOptions = ["male", "female", "non-binary"]
    const sexualPreferenceOptions = ["bisexual", "male", "female"]
    const softDefinerOptions = ["work", "dogs", "music", "travel", "outdoors", "books",
      "adventure", "food", "hiking", "sports", "gaming", "movies", "tv", "art",
      "nature", "animals", "cars", "tech", "fashion", "beauty", "fitness",
      "health", "science", "history", "politics", "religion", "philosophy",
      "psychology", "education", "family", "friends", "cats"]
    /* HELPERS */
    Array.prototype.random = function () {
      return this[Math.floor((Math.random() * this.length))];
    };
    function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min) + min)
    };
    function randomLimitedSelection(numberOfSelections, choices){
      let updatedChoices = choices;
      let selection = [];
      for(let i=0 ; i<numberOfSelections; i++){
        if(updatedChoices.length){
          let selectedOption = choices.random();
          updatedChoices = updatedChoices.filter((option)=> option!==selectedOption);
          selection.push(selectedOption);
        };
      };
      return selection;
    };
    let newUserPassword = "$2b$10$7yu6NkhTEk/uCAsXjlAS2OqpDQ2mSP0WQCNtKK97hCDDC12xB/PPa" ;
    let newUserGender = generatedUserHasGender ? generatedUserGender : genderOptions.random();
    let newUserFirstName = newUserGender === "non-binary" ? faker.person.firstName() : faker.person.firstName(newUserGender);
    let newUserLastName = newUserGender === "non-binary" ? faker.person.lastName() : faker.person.lastName(newUserGender);
    let newUserEmail = faker.internet.email({newUserFirstName, newUserLastName});
    let newUserName = faker.internet.userName({newUserFirstName, newUserLastName});
    let newUserAge = getRandomInt(18, 80);
    let newUserSexualPreference = generatedUserHasSexuality ? generatedUserSexuality : sexualPreferenceOptions.random();
    let newUserBiography = faker.lorem.paragraph();
    let newUserInterests = randomLimitedSelection(5 , softDefinerOptions);
    let newUserStatus = "available";
    let generatedUser = {
      username: newUserName,
      firstname: newUserFirstName,
      lastname: newUserLastName,
      email: newUserEmail,
      password: newUserPassword,
      gender: newUserGender,
      age: newUserAge,
      sexual_pref: newUserSexualPreference,
      biography: newUserBiography,
      interests: newUserInterests,
      status: newUserStatus
    };
    return generatedUser;
  };
  const {username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, status} =userGenerationHelper();
  const newUser = await db.query(
  `insert into users (username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
  [username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, status]
);
console.log(newUser);
res.json(newUser.rows);
} catch (error) {
  console.log("ERROR:  ", error.message)
}
});


/* UPDATE user by id */
router.put('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const {username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography} =req.body;

		const updateUser = await db.query(
		`UPDATE users SET username=$1, firstname=$2, lastname=$3, email=$4, password=$5, gender=$6, age=$7, interests=$8, sexual_pref=$9, biography=$10  WHERE id=$11`,		[username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, id]
	);
	console.log(updateUser.rows)
	res.json(updateUser.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* DELETE user by id */
router.delete('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const deleteUser = await db.query(
		`DELETE FROM users WHERE id = $1`,[id]
	);
	console.log(deleteUser.rows)
	res.json(deleteUser.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

module.exports = router;