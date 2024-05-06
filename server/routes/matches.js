var express = require('express');
var router = express.Router();
const db = require("../db");

/* GET all matches  */
router.get('/', async(req,res)=>{
	try {
		const allMatches = await db.query(
		`SELECT * FROM matches`
	);
  const data= allMatches.rows;
	console.log(data)
	res.json(data)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET matches IN PROGRESS */
router.get('/inprogress', async(req,res)=>{
	try {
		const allCompleteMatches = await db.query(
		`SELECT m.*, p1.*, p2.*, u1.username AS user1_username , u1.age AS user1_age, u1.gender AS user1_gender, u2.username AS user2_username, u2.age AS user2_age, u2.gender AS user2_gender,
      (SELECT COUNT(*) FROM matches WHERE user1_id = m.user1_id) AS user1_match_count,
      (SELECT COUNT(*) FROM matches WHERE user2_id = m.user2_id) AS user2_match_count
    FROM matches m
    LEFT JOIN pods p1 ON m.pod1_id = p1.id
    LEFT JOIN pods p2 ON m.pod2_id = p2.id
    LEFT JOIN users u1 ON m.user1_id = u1.id
    LEFT JOIN users u2 ON m.user2_id = u2.id
    WHERE m.complete = FALSE; `
	);
  const data= allCompleteMatches.rows
	console.log(data)
	res.json(data)
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
  const data= allMatches.rows
	console.log(data)
	res.json(data)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});


/* GET MATCHES BY ID */
router.get('/:id', async(req,res)=>{
	try {
    const {id} = req.params
		const match = await db.query(
		`SELECT * FROM matches where id=$1`,[id]
	);
  const data = match.rows;
	console.log(data);
	res.json(data);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* CREATE match */
router.post('/', async(req, res)=>{
	try {
		const {userID } =req.body;
    const userData = await db.query(`SELECT * FROM users WHERE id = $1`, [userID]);
    const user1 = userData.rows[0];
    const user1Gender = user1.gender;
    const user1SexualPreference = user1.sexual_pref;
    const user1PastDatesResults = await db.query(`SELECT user2_id, user1_id  FROM matches WHERE user1_id = $1 OR user2_id = $1 `, [userID]);
    const user1PastDatesList = user1PastDatesResults.rows.map((candidateData)=>{
      const {user1_id, user2_id} = candidateData;
      let candidateID = (user1_id !== userID) ? user1_id : user2_id;
      return candidateID;
    })
    const vacantPodResults= await db.query(`SELECT * FROM pods WHERE pods.occupied = $1`, [false]);
    console.log("PAST DATE LIST:  ", user1PastDatesList)
    console.log("vacantPodData:  ", vacantPodResults)
    const vacantPodsData = vacantPodResults.rows;
    const vacantPodsList = vacantPodsData.map((podData)=>(podData.id));
    console.log("vacantPodsList:  ", vacantPodsList)
    if(vacantPodsList.length >=2 ){
      const userPodID = vacantPodsList[0];
      console.log("userPodID:  ", userPodID)
      let user1ProspectData
      if(user1Gender !== "non-binary" ){
        if(user1SexualPreference !== "bisexual"){
          console.log(" HETERO OR HOMO SEXUAL MATCH")
          user1ProspectData = await db.query(
          `
          SELECT u.id, u.username, COUNT(m.id) AS num_matches
          FROM users u
          LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
          WHERE (u.gender = $2 AND u.sexual_pref = $1) AND u.available=$3
          GROUP BY u.id, u.username
          ORDER BY num_matches ASC;
          `,[ user1SexualPreference, user1Gender, true]);
        } else{
          console.log(" BISEXUAL MATCH")
          user1ProspectData = await db.query(
          `
          SELECT u.id, u.username, COUNT(m.id) AS num_matches
          FROM users u
          LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
          WHERE (u.sexual_pref = $1 OR u.sexual_pref = $2 ) AND u.available=$3
          GROUP BY u.id, u.username
          ORDER BY num_matches ASC;
          `,[ user1Gender, "bisexual", true]);
        }
      }else{
        console.log(" BISEXUAL NON BINARY MATCH")
        user1ProspectData = await db.query(
          `
          SELECT u.id, u.username, COUNT(m.id) AS num_matches
          FROM users u
          LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
          WHERE (u.sexual_pref = $1 AND u.available=$2)
          GROUP BY u.id, u.username
          ORDER BY num_matches ASC;
          `, ["bisexual", true]);
      }    
      let user1ProspectsList = user1ProspectData.rows.map((prospectData)=>(prospectData.id));
      console.log(" PROSPECTS LIST:  ", user1ProspectsList)
      console.log(" PAST DATE  LIST:  ", user1PastDatesList)
      user1ProspectsList = user1ProspectsList.filter(prospectID => ((user1PastDatesList.indexOf(prospectID))<0) || prospectID!==userID )
      if(user1ProspectsList.length){
        const matchID = user1ProspectsList[0];
        const matchPodID = vacantPodsList[1];
        console.log("matchPodID:  ", matchPodID)
        await db.query(
          `INSERT into matches (user1_id, pod1_id, user2_id, pod2_id, status, complete) VALUES ($1, $2, $3, $4, $5, $6);`,
          [userID, userPodID, matchID, matchPodID, "inProgress", false]
        );
        console.log("1:  ", 1)
        await db.query(
          `UPDATE users SET status=$2, available=$3  WHERE id=$1;`,
          [userID, "unavailable", false]
        );
        await db.query(
          `UPDATE users SET status=$2, available=$3   WHERE id=$1;`,
          [matchID, "unavailable", false]
        );
        await db.query(
          `UPDATE pods SET occupied=$3, occupant_id=$1 WHERE id=$2;`,
          [ userID, userPodID, true ]
        );
        await db.query(
          `UPDATE pods SET occupied=$3, occupant_id=$1 WHERE id=$2;`,
          [ matchID, matchPodID, true]
        );
        res.status(200)
        res.json({status: "match made"})
      }else {
        await db.query(
          `UPDATE users SET status=$2  WHERE id=$1;`,
          [userID, "waiting"]
        );
        res.status(200)
        res.json({status: "match succesful"})
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
		const {user1_id, pod1_id, user2_id, pod2_id} =req.body;
    console.log("body:  ", user1_id, pod1_id, user2_id, pod2_id)
		await db.query(
		  `UPDATE matches SET status=$1, complete=$2 WHERE id=$3`, ["complete", true, id]
	  );
    await db.query(
      `UPDATE users SET status=$1, available=$2 WHERE id=$3;`,
      [ "available", true, user1_id]
    );

    await db.query(
      `UPDATE users SET status=$1, available=$2  WHERE id=$3;`,
      ["available", true, user2_id,]
    );

    await db.query(
      `UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3;`,
      [  false, null, pod1_id,]
    );

    await db.query(
      `UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3;`,
      [ false, null, pod2_id]
    );
    
    res.status(200)
    res.json({status: `match ${id} completed`})
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});



/* UPDATE match by id */
router.put('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const {user1_id, pod1_id, user2_id, pod2_id, status, complete} =req.body;

		await db.query(
		`UPDATE matches SET user1_id=$1, pod1_id=$2, user2_id=$3, pod2_id=$4 status=$5 complete=$6 WHERE id=$7`, [user1_id, pod1_id, user2_id, pod2_id, status, complete, id]
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* DELETE match by id */
router.delete('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		await db.query(
		`DELETE FROM matches WHERE id = $1`,[id]
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

module.exports = router;