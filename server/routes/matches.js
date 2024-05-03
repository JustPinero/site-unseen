var express = require('express');
var router = express.Router();
const db = require("../db");
const { faker } = require('@faker-js/faker');

/* GET all matches  */
router.get('/', async(req,res)=>{
	try {
		const allMatches = await db.query(
		`SELECT * FROM matches`
	);
	console.log(allMatches.rows)
	res.json(allMatches.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET matches by status */
router.get('/status/:matchstatus', async(req,res)=>{
	try {
    const {matchstatus} = req.params;
		const allMatches = await db.query(
		`SELECT * FROM matches WHERE status = $1 `,[matchstatus]
	);
	console.log(allMatches.rows)
	res.json(allMatches.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});


/* GET matches by id */
router.get('/:id', async(req,res)=>{
	try {
    const {id} = req.params
		const match = await db.query(
		`SELECT * FROM matches where id=$1`,[id]
	);
	console.log(match.rows)
	res.json(match.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* CREATE match */
router.post('/', async(req, res)=>{
	try {
		const {userID, dateCount } =req.body;
    console.log("USERID:  ", userID)
    const userData = await db.query(`SELECT * FROM users WHERE id = $1`, [userID]);
    const user1 = userData.rows[0];
    const user1Gender = user1.gender;
    const user1SexualPreference = user1.sexual_pref;
    const user1PastDatesData = await db.query(`SELECT user2_id AS id FROM matches WHERE user1_id = $1`, [userID]);
    console.log("PAST DATE DATA:  ", user1PastDatesData.rows)
    const user1PastDates = user1PastDatesData.rows.map((dateData)=>(dateData.id));
    console.log("PAST DATE LIST:  ", user1PastDates)
    const vacantPodData = await db.query(`SELECT id FROM pods WHERE status = $1`, ["vacant"]);
    const vacantPods = vacantPodData.rows.map((podData)=>(podData.id));
    if(vacantPods.length >=2 ){
      const userPodID = vacantPods[0];
      let user1ProspectData
      if(user1Gender !== "non-binary" ){
        if(user1SexualPreference !== "bisexual"){
          user1ProspectData = await db.query(
          `
            SELECT users.id, COUNT(matches.user1_id) AS dates
            FROM users 
            LEFT JOIN matches
            ON matches.user1_id = users.id
            WHERE gender = $1 AND sexual_pref = $2 
            GROUP BY users.id
            HAVING COUNT(matches.user1_id) < $3
            ORDER BY dates
          `,[ user1SexualPreference, user1Gender, dateCount]);
        } else{
          user1ProspectData = await db.query(
          `
            SELECT users.id, COUNT(matches.user1_id) AS dates
            FROM users 
            LEFT JOIN matches
            ON matches.user1_id = users.id
            WHERE sexual_pref = $1 OR sexual_pref = $2
            GROUP BY users.id
            HAVING COUNT(matches.user1_id) < $3
            ORDER BY dates
          `,[ user1Gender, "bisexual", dateCount]);
        }
      }else{
        user1ProspectData = await db.query(
          `
          SELECT users.id, COUNT(matches.user1_id) AS dates
          FROM users
          LEFT JOIN matches
          ON matches.user1_id = users.id
          WHERE sexual_pref = $1
          GROUP BY users.id
          HAVING COUNT(matches.user1_id) < $2
          ORDER BY dates
          `, ["bisexual", dateCount]);
      }    
      let user1Prospects = user1ProspectData.rows.map((prospectData)=>(prospectData.id));
      console.log(" PROSPECTS LIST:  ", user1Prospects)
      console.log(" PAST DATE  LIST:  ", user1PastDates)
      user1Prospects = user1Prospects.filter(prospectID => ((user1PastDates.indexOf(prospectID))<0) || prospectID!==userID )
      if(user1Prospects.length){
        const matchID = user1Prospects[0];
        const matchPodID = vacantPods[1];
        const newMatches = await db.query(
          `INSERT into matches (user1_id, pod1_id, user2_id, pod2_id, status) VALUES ($1, $2, $3, $4, $5), ($3, $4, $1, $2, $5);`,
          [userID, userPodID, matchID, matchPodID, "inProgress", "occupied"]
        );

        const userUpdate = await db.query(
          `UPDATE users SET status=$2,  WHERE id=$1;`,
          [userID, "unavailable"]
        );

        const matchUpdate = await db.query(
          `UPDATE users SET status=$2,  WHERE id=$1;`,
          [matchID, "unavailable"]
        );

        const userPodUpdate = await db.query(
          `UPDATE pods SET status=$3, occupant_id=$1 WHERE id=$3;`,
          [ userID, userPodID, "occupied"]
        );

        const matchPodUpdate = await db.query(
          `UPDATE pods SET status=$3, occupant_id=$1 WHERE id=$2;`,
          [ matchID, matchPodID, "occupied"]
        );
        console.log(newMatches.rows)
        res.json(newMatches.rows)
      }else {
        res.status(404).send('Sorry no matches at this time')
      }
    }
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* COMPLETE MATCH */
router.put('/complete/:id', async (req, res)=>{
	try {
		const {id} = req.params;
    console.log("ID:  ", id)
		const {user1_id, pod1_id, user2_id, pod2_id, status} =req.body;
    console.log("body:  ", user1_id, pod1_id, user2_id, pod2_id, status)
		const updateMatch = await db.query(
		  `UPDATE matches SET status=$1 WHERE id=$2`, [status, id]
	  );
    const userUpdate = await db.query(
      `UPDATE users SET status=$2 WHERE id=$1;`,
      [user1_id, "available"]
    );

    const matchUpdate = await db.query(
      `UPDATE users SET status=$2  WHERE id=$1;`,
      [user2_id, "available"]
    );

    const userPodUpdate = await db.query(
      `UPDATE pods SET status=$3, occupant_id=$1 WHERE id=$2;`,
      [ null, pod1_id, "vacant"]
    );

    const matchPodUpdate = await db.query(
      `UPDATE pods SET status=$3, occupant_id=$1 WHERE id=$2;`,
      [ null, pod2_id, "vacant"]
    );
    
	console.log(updateMatch.rows)
	res.json(updateMatch.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});



/* UPDATE match by id */
router.put('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const {user1_id, pod1_id, user2_id, pod2_id} =req.body;

		const updateMatch = await db.query(
		`UPDATE matches SET user1_id=$1, pod1_id=$2, user2_id=$3, pod2_id=$4 status=$5 WHERE id=$6`, [user1_id, pod1_id, user2_id, pod2_id, "complete", id]
	);
	console.log(updateMatch.rows)
	res.json(updateMatch.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* DELETE match by id */
router.delete('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const deleteMatch = await db.query(
		`DELETE FROM matches WHERE id = $1`,[id]
	);
	console.log(deleteMatch.rows)
	res.json(deleteMatch.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

module.exports = router;