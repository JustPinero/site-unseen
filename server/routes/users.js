var express = require('express');
var router = express.Router();
const db = require("../db");
const { faker } = require('@faker-js/faker');

/* GET all users  */
router.get('/', async(req,res)=>{
	try {
		const allUsers = await db.query(
		  `
      SELECT u.*, COUNT(m.id) AS num_matches
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      GROUP BY u.id
      `
	  );
  const data = allUsers.rows;
	res.json(data);
	} catch (error) {
		console.log("ERROR:  ", error.message);
	}
});

/* GET all users by gender */
router.get('/gender/:gender', async(req,res)=>{
	try {
    const {gender} = req.params;
		const allUsersByGender = await db.query(
		`SELECT * FROM users WHERE gender = $1`,[gender]
	);
	res.json(allUsersByGender)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET user by id */
router.get('user/:id', async(req,res)=>{
	try {
    const {id} = req.params
		const user = await db.query(
		`SELECT * FROM users where id=$1`,[id]
	);
	res.json(user.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET user dates by id */
router.get('user/:id/dates', async(req,res)=>{
	try {
    const {id} = req.params
		const user = await db.query(
		`select count(*) from matches
      where $1 = user1_id or $1 = user2_id
      ;`,[id]
	);
	res.json(user.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET AVERAGE NUMBER OF USER MATCHES */
router.get('/dates/avg', async(req,res)=>{
	try {
		const userAverageDateCountResults = await db.query(
      `
      SELECT AVG(num_matches) AS average_matches
      FROM (
          SELECT COUNT(*) AS num_matches
          FROM matches
          GROUP BY user1_id
          UNION ALL
          SELECT COUNT(*) AS num_matches
          FROM matches
          GROUP BY user2_id
      ) AS match_counts
      ;`
	);
  const userAverageDateCount= userAverageDateCountResults.rows
	res.json(userAverageDateCount)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});


/* GET ALL users who still need dates */
router.get('/dates/:datecount', async(req,res)=>{
	try {
    const {datecount} = req.params
		const sortedUsersResults = await db.query(
      `
      SELECT u.id, u.username, COUNT(m.id) AS num_matches
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      WHERE u.available = TRUE
      GROUP BY u.id, u.username
      HAVING COUNT(m.id) <= $1
      ORDER BY num_matches ASC;
      ;`, [datecount]
	);
  const sortedUsers = sortedUsersResults.rows;
	res.json(sortedUsers)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET ALL users who have finished dating*/
router.get('/finished/:datecount', async(req,res)=>{
	try {
    const {datecount} = req.params
		const usersResults = await db.query(
      `
      SELECT u.id, u.username, COUNT(m.id) AS num_matches
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      GROUP BY u.id, u.username
      HAVING COUNT(m.id) >= $1
      ;`, [datecount]
	);
  const usersData = usersResults.rows;
	res.json(usersData)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* COUNTS */
/* GENERAL COUNTS */
router.get('/counts/all', async(req,res)=>{
	try {


    const totalUsersCountResults = await db.query(
      `
      SELECT COUNT(*) AS total_count
      FROM users;
`,
	);
		const waitingUsersCountResults = await db.query(
      `
      SELECT COUNT(*) AS waiting_user_count
      FROM users
      WHERE status='waiting';
`
	);
  const availableUsersCountResults = await db.query(
    `
    SELECT COUNT(*) AS available_user_count
    FROM users
    WHERE status='available';
`
);
  const totalUsersCountData = totalUsersCountResults.rows;
  const waitingUsersCountData= waitingUsersCountResults.rows;
  const availableUsersCountData= availableUsersCountResults.rows;

	const data ={
    total: totalUsersCountData,
    waiting: waitingUsersCountData,
    available: availableUsersCountData
  };
	res.json(data)
    res.status(200)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* DATES COUNTS */
/* FINISHED */
router.get('/finished/:datecount/count', async(req,res)=>{
	try {
    const {datecount} = req.params
    const finishedTotalResults = await db.query(
      `
      SELECT COUNT(*) AS user_count
      FROM (
      SELECT u.id
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      GROUP BY u.id
      HAVING COUNT(m.id) >= $1
      ) AS subquery;
`, [datecount]
	);
		const finishedMaleResults = await db.query(
      `
      SELECT COUNT(*) AS user_count
      FROM (
      SELECT u.id
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      WHERE u.gender = 'male'
      GROUP BY u.id
      HAVING COUNT(m.id) >= $1
      ) AS subquery;
`, [datecount]
	);
  const finishedFemaleResults = await db.query(
    `
    SELECT COUNT(*) AS user_count
    FROM (
    SELECT u.id
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE u.gender = 'female'
    GROUP BY u.id
    HAVING COUNT(m.id) >= $1
    ) AS subquery;
`, [datecount]
);
  const finishedNbResults = await db.query(
    `
    SELECT COUNT(*) AS user_count
    FROM (
    SELECT u.id
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE u.gender = 'non-binary'
    GROUP BY u.id
    HAVING COUNT(m.id) >= $1
    ) AS subquery;
  `, [datecount]
  );
  const finishedTotalData = finishedTotalResults.rows
  const finishedMaleData = finishedMaleResults.rows;
  const finishedFemaleData = finishedFemaleResults.rows;
  const finishedNbData = finishedNbResults.rows;
	const data ={
    total:finishedTotalData,
    male:finishedMaleData,
    female: finishedFemaleData,
    nb:finishedNbData
  }
	res.json(data)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* UNFINISHED */
router.get('/unfinished/:datecount/count', async(req,res)=>{
	try {
    const {datecount} = req.params
    const unfinishedTotalResults = await db.query(
      `
      SELECT COUNT(*) AS user_count
      FROM (
      SELECT u.id
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      GROUP BY u.id
      HAVING COUNT(m.id) < $1
      ) AS subquery;
`, [datecount]
	);
		const unfinishedMaleResults = await db.query(
      `
      SELECT COUNT(*) AS user_count
      FROM (
      SELECT u.id
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      WHERE u.gender = 'male'
      GROUP BY u.id
      HAVING COUNT(m.id) < $1
      ) AS subquery;
`, [datecount]
	);
  const unfinishedFemaleResults = await db.query(
    `
    SELECT COUNT(*) AS user_count
    FROM (
    SELECT u.id
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE u.gender = 'female'
    GROUP BY u.id
    HAVING COUNT(m.id) < $1
    ) AS subquery;
`, [datecount]
);
  const unfinishedNbResults = await db.query(
    `
    SELECT COUNT(*) AS user_count
    FROM (
    SELECT u.id
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE u.gender = 'non-binary'
    GROUP BY u.id
    HAVING COUNT(m.id) < $1
    ) AS subquery;
  `, [datecount]
  );
  const unfinishedTotalData = unfinishedTotalResults.rows
  const unfinishedMaleData = unfinishedMaleResults.rows;
  const unfinishedFemaleData = unfinishedFemaleResults.rows;
  const unfinishedNbData = unfinishedNbResults.rows;
	const data ={
    total: unfinishedTotalData,
    male:unfinishedMaleData,
    female: unfinishedFemaleData,
    nb:unfinishedNbData
  }
	res.json(data)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});


//USER SIMULATION RESULTS
router.post('/simresults', async(req, res)=>{
  try{
  const {dateMax, dateMin} =req.body;
//   /* --------------------FINISHED USER TOTALS----------------------- */
  console.log("USER SIM RESULTS STARTS")
  console.log("finishedTotalResults works")
  const finishedTotalResults = await db.query(
    `
    SELECT COUNT(*) AS user_count
    FROM (
    SELECT u.id
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    GROUP BY u.id
    HAVING COUNT(m.id) >= $1
    ) AS subquery;
`, [dateMin]
);
  const finishedMaleResults = await db.query(
    `
    SELECT COUNT(*) AS user_count
    FROM (
    SELECT u.id
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE u.gender = 'male'
    GROUP BY u.id
    HAVING COUNT(m.id) >= $1
    ) AS subquery;
`, [dateMin]
);
// console.log("finishedMaleResults works")
const finishedFemaleResults = await db.query(
  `
  SELECT COUNT(*) AS user_count
  FROM (
  SELECT u.id
  FROM users u
  LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
  WHERE u.gender = 'female'
  GROUP BY u.id
  HAVING COUNT(m.id) >= $1
  ) AS subquery;
`, [dateMin]
);
// console.log("finishedFemaleResults works")
const finishedNbResults = await db.query(
  `
  SELECT COUNT(*) AS user_count
  FROM (
  SELECT u.id
  FROM users u
  LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
  WHERE u.gender = 'non-binary'
  GROUP BY u.id
  HAVING COUNT(m.id) >= $1
  ) AS subquery;
`, [dateMin]
);
// console.log("finishedNbResults works")
// /* --------------------UNFINISHED USER TOTALS----------------------- */
  const unfinishedTotalResults = await db.query(
    `
    SELECT COUNT(*) AS user_count
    FROM (
    SELECT u.id
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    GROUP BY u.id
    HAVING COUNT(m.id) < $1
    ) AS subquery;
`, [dateMin]
);
// console.log("unfinishedTotalResults works")
  const unfinishedMaleResults = await db.query(
    `
    SELECT COUNT(*) AS user_count
    FROM (
    SELECT u.id
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE u.gender = 'male'
    GROUP BY u.id
    HAVING COUNT(m.id) < $1
    ) AS subquery;
`, [dateMin]
);
// console.log("unfinishedMaleResults works")
const unfinishedFemaleResults = await db.query(
  `
  SELECT COUNT(*) AS user_count
  FROM (
  SELECT u.id
  FROM users u
  LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
  WHERE u.gender = 'female'
  GROUP BY u.id
  HAVING COUNT(m.id) < $1
  ) AS subquery;
`, [dateMin]
);
// console.log("unfinishedFemaleResults works")
const unfinishedNbResults = await db.query(
  `
  SELECT COUNT(*) AS user_count
  FROM (
  SELECT u.id
  FROM users u
  LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
  WHERE u.gender = 'non-binary'
  GROUP BY u.id
  HAVING COUNT(m.id) < $1
  ) AS subquery;
`, [dateMin]
);
// console.log("unfinishedNbResults works")
// /* --------------------SIM DETAILS----------------------- */
// //MALE
const maleDetailsResults = await db.query(
  `
SELECT
    u.gender,
    u.sexual_pref,
    COUNT(DISTINCT u.id) AS male_user_count,
    COUNT(m.id) AS match_count,
    max_min_avg_match_counts.max_match_count,
    max_min_avg_match_counts.min_match_count,
    max_min_avg_match_counts.avg_match_count
FROM
    users u
LEFT JOIN
    matches m ON u.id = m.user1_id OR u.id = m.user2_id
LEFT JOIN
    (
        SELECT
            u.gender,
            u.sexual_pref,
            MAX(sub_matches.match_count) AS max_match_count,
            MIN(sub_matches.match_count) AS min_match_count,
            AVG(sub_matches.match_count) AS avg_match_count
        FROM
            users u
        LEFT JOIN
            (
                SELECT
                    user1_id AS user_id,
                    COUNT(id) AS match_count
                FROM
                    matches
                GROUP BY
                    user1_id

                UNION ALL

                SELECT
                    user2_id AS user_id,
                    COUNT(id) AS match_count
                FROM
                    matches
                GROUP BY
                    user2_id
            ) AS sub_matches ON u.id = sub_matches.user_id
        WHERE
            u.gender = 'male'
        GROUP BY
            u.gender,
            u.sexual_pref
    ) AS max_min_avg_match_counts ON u.gender = max_min_avg_match_counts.gender AND u.sexual_pref = max_min_avg_match_counts.sexual_pref
WHERE
    u.gender = 'male'
GROUP BY
    u.gender,
    u.sexual_pref,
    max_min_avg_match_counts.max_match_count,
    max_min_avg_match_counts.min_match_count,
    max_min_avg_match_counts.avg_match_count;
`
);
// console.log("maleDetailsResults works")
// //SUB DEMOGRAPHIC FINISHED COUNT
const maleSubDemographicTotalFinishedUsers = await db.query(
  `
  SELECT sexual_pref, COUNT(*) AS user_count
  FROM (
      SELECT u.id, u.sexual_pref
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      WHERE u.gender = 'male'
      GROUP BY u.id, u.sexual_pref
      HAVING COUNT(m.id) >= $1
  ) AS subquery
  GROUP BY sexual_pref;
  `, [dateMin]);
//   console.log("maleSubDemographicTotalFinishedUsers works")
// //SUB DEMOGRAPHIC UNFINISHED COUNT
  const maleSubDemographicTotalUnfinishedUsers = await db.query(
    `
    SELECT sexual_pref, COUNT(*) AS user_count
    FROM (
        SELECT u.id, u.sexual_pref
        FROM users u
        LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
        WHERE u.gender = 'male'
        GROUP BY u.id, u.sexual_pref
        HAVING COUNT(m.id) < $1
    ) AS subquery
    GROUP BY sexual_pref;
    `, [dateMin]);
//     console.log("maleSubDemographicTotalUnfinishedUsers works")
// //FEMALE USERS
// console.log("femaleDetailsResults starting")
const femaleDetailsResults = await db.query(
  `
SELECT
    u.gender,
    u.sexual_pref,
    COUNT(DISTINCT u.id) AS female_user_count,
    COUNT(m.id) AS match_count,
    max_min_avg_match_counts.max_match_count,
    max_min_avg_match_counts.min_match_count,
    max_min_avg_match_counts.avg_match_count
FROM
    users u
LEFT JOIN
    matches m ON u.id = m.user1_id OR u.id = m.user2_id
LEFT JOIN
    (
        SELECT
            u.gender,
            u.sexual_pref,
            MAX(sub_matches.match_count) AS max_match_count,
            MIN(sub_matches.match_count) AS min_match_count,
            AVG(sub_matches.match_count) AS avg_match_count
        FROM
            users u
        LEFT JOIN
            (
                SELECT
                    user1_id AS user_id,
                    COUNT(id) AS match_count
                FROM
                    matches
                GROUP BY
                    user1_id

                UNION ALL

                SELECT
                    user2_id AS user_id,
                    COUNT(id) AS match_count
                FROM
                    matches
                GROUP BY
                    user2_id
            ) AS sub_matches ON u.id = sub_matches.user_id
        WHERE
            u.gender = 'female'
        GROUP BY
            u.gender,
            u.sexual_pref
    ) AS max_min_avg_match_counts ON u.gender = max_min_avg_match_counts.gender AND u.sexual_pref = max_min_avg_match_counts.sexual_pref
WHERE
    u.gender = 'female'
GROUP BY
    u.gender,
    u.sexual_pref,
    max_min_avg_match_counts.max_match_count,
    max_min_avg_match_counts.min_match_count,
    max_min_avg_match_counts.avg_match_count;
`
);
// console.log("femaleDetailsResults works")
const femaleSubDemographicTotalFinishedUsers = await db.query(
`
SELECT sexual_pref, COUNT(*) AS user_count
FROM (
    SELECT u.id, u.sexual_pref
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE u.gender = 'female'
    GROUP BY u.id, u.sexual_pref
    HAVING COUNT(m.id) >= $1
) AS subquery
GROUP BY sexual_pref;
`, [dateMin])
console.log("femaleSubDemographicTotalFinishedUsers works")
const femaleSubDemographicTotalUnfinishedUsers = await db.query(
  `
  SELECT sexual_pref, COUNT(*) AS user_count
  FROM (
      SELECT u.id, u.sexual_pref
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      WHERE u.gender = 'female'
      GROUP BY u.id, u.sexual_pref
      HAVING COUNT(m.id) < $1
  ) AS subquery
  GROUP BY sexual_pref;
  `, [dateMin]);
//   console.log("femaleSubDemographicTotalUnfinishedUsers works")

// //NON-BINARY USERS
const nonbinaryDetailsResults = await db.query(
  `
SELECT
    u.gender,
    u.sexual_pref,
    COUNT(DISTINCT u.id) AS nb_user_count,
    COUNT(m.id) AS match_count,
    max_min_avg_match_counts.max_match_count,
    max_min_avg_match_counts.min_match_count,
    max_min_avg_match_counts.avg_match_count
FROM
    users u
LEFT JOIN
    matches m ON u.id = m.user1_id OR u.id = m.user2_id
LEFT JOIN
    (
        SELECT
            u.gender,
            u.sexual_pref,
            MAX(sub_matches.match_count) AS max_match_count,
            MIN(sub_matches.match_count) AS min_match_count,
            AVG(sub_matches.match_count) AS avg_match_count
        FROM
            users u
        LEFT JOIN
            (
                SELECT
                    user1_id AS user_id,
                    COUNT(id) AS match_count
                FROM
                    matches
                GROUP BY
                    user1_id

                UNION ALL

                SELECT
                    user2_id AS user_id,
                    COUNT(id) AS match_count
                FROM
                    matches
                GROUP BY
                    user2_id
            ) AS sub_matches ON u.id = sub_matches.user_id
        WHERE
            u.gender = 'non-binary'
        GROUP BY
            u.gender,
            u.sexual_pref
    ) AS max_min_avg_match_counts ON u.gender = max_min_avg_match_counts.gender AND u.sexual_pref = max_min_avg_match_counts.sexual_pref
WHERE
    u.gender = 'non-binary'
GROUP BY
    u.gender,
    u.sexual_pref,
    max_min_avg_match_counts.max_match_count,
    max_min_avg_match_counts.min_match_count,
    max_min_avg_match_counts.avg_match_count;


`
);
// console.log("nonbinaryDetailsResults works")
// //SUB DEMOGRAPHIC FINISHED COUNT
const nbSubDemographicTotalFinishedUsers = await db.query(
  `
  SELECT sexual_pref, COUNT(*) AS user_count
  FROM (
      SELECT u.id, u.sexual_pref
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      WHERE u.gender = 'non-binary'
      GROUP BY u.id, u.sexual_pref
      HAVING COUNT(m.id) >= $1
  ) AS subquery
  GROUP BY sexual_pref;
  `, [dateMin]);
//   console.log("nbSubDemographicTotalFinishedUsers works")
// //SUB DEMOGRAPHIC UNFINISHED COUNT
  const nbSubDemographicTotalUnfinishedUsers = await db.query(
    `
    SELECT sexual_pref, COUNT(*) AS user_count
    FROM (
        SELECT u.id, u.sexual_pref
        FROM users u
        LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
        WHERE u.gender = 'non-binary'
        GROUP BY u.id, u.sexual_pref
        HAVING COUNT(m.id) < $1
    ) AS subquery
    GROUP BY sexual_pref;
    `, [dateMin]);
//     console.log("nbSubDemographicTotalUnfinishedUsers works")


// //FINISHED
// //_____MALE_____
// //MALE COUNT
const finishedMaleData = finishedMaleResults.rows;
// //SUBDEMOGRAPHICS
const maleSubdemographicFinishedUserData = maleSubDemographicTotalFinishedUsers.rows;
// //_____FEMALE_____
// //FEMALE COUNT
const finishedFemaleData = finishedFemaleResults.rows;
// //SUBDEMOGRAPHICS
const femaleSubdemographicFinishedUserData = femaleSubDemographicTotalFinishedUsers.rows;
// //_____NONBINARY_____
// //NB COUNT
const finishedNbData = finishedNbResults.rows;
// //SUBDEMOGRAPHICS
const nbSubdemographicFinishedUserData = nbSubDemographicTotalFinishedUsers.rows;
// //_____ALL_____
const finishedTotalData = finishedTotalResults.rows
// //UNFINISHED
// //_____MALE_____
const unfinishedMaleData = unfinishedMaleResults.rows;
// //SUBDEMOGRAPHICS
const maleSubdemographicUnfinishedUserData =maleSubDemographicTotalUnfinishedUsers.rows
// //_____FEMALE_____
const unfinishedFemaleData = unfinishedFemaleResults.rows;
// //SUBDEMOGRAPHICS
const femaleSubdemographicUnfinishedUserData =femaleSubDemographicTotalUnfinishedUsers.rows
// //_____NONBINARY_____
const unfinishedNbData = unfinishedNbResults.rows;
// //SUBDEMOGRAPHICS
const nbSubdemographicUnfinishedUserData =nbSubDemographicTotalUnfinishedUsers.rows
// //_____ALL_____
const unfinishedTotalData = unfinishedTotalResults.rows
// //DETAILS
// //MALE
const maleDetailsData = maleDetailsResults.rows
// //FEMALE
const femaleDetailsData = femaleDetailsResults.rows
// //NON BINARY
const nonBinaryDetailsData = nonbinaryDetailsResults.rows

// /*--------------PAYLOAD---------------*/

const data ={
  finished:{
    male:{
      total: finishedMaleData,
      subDemographicCounts: maleSubdemographicFinishedUserData
    },
    female: {
      total: finishedFemaleData,
      subDemographicCounts: femaleSubdemographicFinishedUserData
    },
    nb: {
      total:finishedNbData,
      subDemographicCounts:nbSubdemographicFinishedUserData
    },
    total:finishedTotalData
  },
  unfinished:{
    male:{
      total: unfinishedMaleData,
      subDemographicCounts: maleSubdemographicUnfinishedUserData
    },
    female: {
      total: unfinishedFemaleData,
      subDemographicCounts: femaleSubdemographicUnfinishedUserData
    },
    nb: {
      total: unfinishedNbData,
      subDemographicCounts: nbSubdemographicUnfinishedUserData
    },
    total:unfinishedTotalData
  },
  details:{
    male:maleDetailsData,
    female: femaleDetailsData,
    nb: nonBinaryDetailsData,
  },
};
console.log("data: ", data)
res.status(200).json(data)
} catch (error) {
  console.log("ERROR:  ", error.message)
  throw error
}
})


/* CREATE user */
router.post('/', async(req, res)=>{
	try {
		const {username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography} =req.body;
		await db.query(
		`insert into users (username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, status, available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		[username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, "available", true]
	);
  res.status(200)
  res.json({status: `new user created`})
	} catch (error) {
		console.log("ERROR:  ", error.message)
    throw error
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
      status: newUserStatus,
      available: true
    };
    return generatedUser;
  };
  const {username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, status, available} =userGenerationHelper();
  await db.query(
  `insert into users (username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, status, available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
  [username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, status, available]
);
    res.status(200)
    res.json({status: `NEW USER GENERATED`})
} catch (error) {
  console.log("ERROR:  ", error.message)
  throw error;
}
});


/* UPDATE user by id */
router.put('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const {username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, status, available} =req.body;

		await db.query(
		`UPDATE users SET username=$1, firstname=$2, lastname=$3, email=$4, password=$5, gender=$6, age=$7, interests=$8, sexual_pref=$9, biography=$10 status=$12 available=$13  WHERE id=$11`,		[username, firstname, lastname, email, password, gender, age, interests, sexual_pref, biography, "available", true, id],
	);
  res.status(200)
  res.json({status: `user ${id} updated`})
	} catch (error) {
		console.log("ERROR:  ", error.message)
    throw error;
	}
});

/* DELETE user by id */
router.delete('remove/:id', async(req,res)=>{
  const {id} = req.params
	try {
		await db.query(
		`DELETE FROM users WHERE id=$1`,[id]
	);
  const postDeletionUsersResults = await db.query(
    `
    SELECT u.*, COUNT(m.id) AS num_matches
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    GROUP BY u.id
    `
	);
  const data = postDeletionUsersResults.rows;
	res.status(200);
  res.json(data)
	} catch (error) {
		console.log("ERROR:  ", error.message)
    throw error;
	}
});

/* DELETE All USERS */
router.delete('/removeall', async(req,res)=>{
	try {
    await db.query(`UPDATE pods SET occupied=FALSE, occupant_id = NULL;`);
		await db.query(
		`DELETE FROM users `
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
    throw error
	}
});

module.exports = router;