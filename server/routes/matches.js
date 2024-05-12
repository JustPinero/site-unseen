var express = require("express");
var router = express.Router();
const db = require("../db");
/* SERVICES */
const {getMatchesInProgress, getCompletedMatches} = require("../services/matches")
const {getAvailablePods} = require("../services/pods")
const {getUserProspects} = require("../services/users")

/* GET Data  */
router.post("/data", async (req, res) => {
  const { maxDateDuration } = req.body;
  console.log("maxDateDuration:  ", maxDateDuration);
  try {
    console.log("GET MATCHES FIRED")
    const matchesInProgress = await getMatchesInProgress(maxDateDuration);
    console.log("  MATCHES IN PROGRESS:   ", matchesInProgress)
    const completedMatches = await getCompletedMatches(maxDateDuration);
    for (let i = 0; i < completedMatches.length; i++) {
      const match = completedMatches[i];
      const { id, user1_id, user2_id, pod1_id, pod2_id } = match;
      await db.query(`UPDATE matches SET status=$1, complete=$2 WHERE id=$3`, [
        "complete",
        true,
        id,
      ]);
      await db.query(`UPDATE users SET status=$1, available=$2 WHERE id=$3;`, [
        "available",
        true,
        user1_id,
      ]);

      await db.query(`UPDATE users SET status=$1, available=$2  WHERE id=$3;`, [
        "available",
        true,
        user2_id,
      ]);

      await db.query(
        `UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3;`,
        [false, null, pod1_id]
      );
      await db.query(
        `UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3;`,
        [false, null, pod2_id]
      );
    }

    const data = matchesInProgress;
    res.json(data);
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error;
  }
});

/* GET all matches  */
router.get("/", async (req, res) => {
  try {
    const allMatches = await db.query(`SELECT * FROM matches`);
    const data = allMatches.rows;
    res.json(data);
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error
  }
});

/* GET matches IN PROGRESS */
router.get("/inprogress", async (req, res) => {
  try {
    const allCompleteMatches = await db.query(
      `
    SELECT m.*, p1.id AS p1id, p2.id AS p2id , u1.username AS user1_username , u1.age AS user1_age, u1.gender AS user1_gender, u2.username AS user2_username, u2.age AS user2_age, u2.gender AS user2_gender,
    (SELECT COUNT(*) FROM matches WHERE user1_id = m.user1_id) AS user1_match_count,
    (SELECT COUNT(*) FROM matches WHERE user2_id = m.user2_id) AS user2_match_count
  FROM matches m
  LEFT JOIN pods p1 ON m.pod1_id = p1.id
  LEFT JOIN pods p2 ON m.pod2_id = p2.id
  LEFT JOIN users u1 ON m.user1_id = u1.id
  LEFT JOIN users u2 ON m.user2_id = u2.id
  WHERE m.complete = FALSE;`
    );
    const data = allCompleteMatches.rows;
    res.json(data);
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error;
  }
});

/* GET matches by status */
router.get("/status/:matchstatus", async (req, res) => {
  try {
    const { matchstatus } = req.params;
    const allMatches = await db.query(
      `SELECT * FROM matches WHERE status = $1 `,
      [matchstatus]
    );
    const data = allMatches.rows;
    res.json(data);
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error
  }
});

/* GET MATCHES BY ID */
router.get("match/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const match = await db.query(`SELECT * FROM matches where id=$1`, [id]);
    const data = match.rows;

    res.json(data);
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error
  }
});

/* COUNTS */
/* GET MATCH COUNTS */
router.get("/count", async (req, res) => {
  try {
    const totalMatchesCountResults = await db.query(
      `SELECT COUNT(*) AS total_match_count FROM matches`
    );
    const currentMatchesCountResults = await db.query(
      `SELECT COUNT(*) AS current_match_count FROM matches WHERE status = $1`,
      ["inProgress"]
    );
    const completedMatchesCountResults = await db.query(
      `SELECT COUNT(*) AS complete_match_count FROM matches WHERE complete = $1`,
      [true]
    );
    const data = {
      totalMatchesCount: totalMatchesCountResults.rows,
      currentMatchesCount: currentMatchesCountResults.rows,
      completedMatchesCount: completedMatchesCountResults.rows,
    };
    res.json(data);
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error;
  }
});

/* CREATE */
/* CREATE match */
router.post("/", async (req, res) => {
  try {
    console.log("CREATE MATCH FIRED")
    const { dateCount } = req.body;

    let success = [false];
    const availablePods = await getAvailablePods();
    if (availablePods.length < 2) {
      const response = { simstatus: "podsFull" };
      return res.status(200).json(response);
    }
    for (let i = 0; i < availablePods.length/2; i++) {
      //LOOK FOR ELLIGIBLE USERS
      const sortedUsersResults = await db.query(
        `
        SELECT u.id, u.username, u.gender, u.available, u.sexual_pref, COUNT(m.id) AS num_matches
        FROM users u
        LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
        WHERE u.available = TRUE
        GROUP BY u.id, u.username
        HAVING COUNT(m.id) < $1
        ORDER BY num_matches ASC;
        ;`,
        [dateCount]
      );
      const sortedUsers = sortedUsersResults.rows;
      if (!sortedUsers.length) {
        return res.status(200);
      }
      //SELECT MOST VIABLE CANDIDATE
      const user1 = sortedUsers[0];
      const userID = user1.id;
      const isUserAvailable = user1.available;
      if (isUserAvailable) {
        const user1Gender = user1.gender;
        const user1SexualPreference = user1.sexual_pref;
        const user1PreviousMatches = await db.query(
          `SELECT user2_id, user1_id  FROM matches WHERE user1_id = $1 OR user2_id = $1 `,
          [userID]
        );
        const user1PreviousDateIds = user1PreviousMatches.rows.map(
          (previousMatch) => {
            const { user1_id, user2_id } = previousMatch;
            let candidateID = user1_id !== userID ? user1_id : user2_id;
            return candidateID;
          }
        );
        //FETCH AVAILABLE POD DATA
        const vacantPodResults = await db.query(
          `SELECT pods.id FROM pods WHERE pods.occupied = FALSE`
        );
        const vacantPodsIdResults = vacantPodResults.rows;
        const vacantPodsIds = vacantPodsIdResults.map((podData)=>(podData.id));
          //SELECT OPEN POD FOR USER
          const userPodID = vacantPodsIds[0];
          let user1ProspectData;
          //SEEK PROSPECTS
          if (user1Gender !== "non-binary") {
            if (user1SexualPreference !== "bisexual") {
              //HETEROSEXUAL AND HOMOSEXUAL QUERY
              user1ProspectData = await db.query(
                `
            SELECT u.id, u.username, COUNT(m.id) AS num_matches
            FROM users u
            LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
            WHERE (u.gender = $2 AND u.sexual_pref = $1) AND u.available=$3
            GROUP BY u.id, u.username
            HAVING COUNT(m.id) < $4
            ORDER BY num_matches ASC;
            `,
                [user1Gender, user1SexualPreference, true, dateCount]
              );
            } else {
              //BISEXUAL
              user1ProspectData = await db.query(
                `
            SELECT u.id, u.username, COUNT(m.id) AS num_matches
            FROM users u
            LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
            WHERE (u.sexual_pref = $1 OR u.sexual_pref = $2 ) AND u.available=$3
            GROUP BY u.id, u.username
            HAVING COUNT(m.id) < $4
            ORDER BY num_matches ASC;
            `,
                [user1Gender, "bisexual", true, dateCount]
              );
            }
          } else {
            //NON BINARY PROSPECTS
            user1ProspectData = await db.query(
              `
          SELECT u.id, u.username, COUNT(m.id) AS num_matches
          FROM users u
          LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
          WHERE (u.sexual_pref = $1 AND u.available=$2)
          GROUP BY u.id, u.username
          HAVING COUNT(m.id) < $3
          ORDER BY num_matches ASC;
          `,
              ["bisexual", true, dateCount]
            );
          }
          let user1ProspectsList = user1ProspectData.rows.map(
            (prospectData) => prospectData.id
          );
          let waitingProspectList = user1ProspectData.rows.map(
            (prospectData) => {
              if (prospectData.status === "waiting") {
                return prospectData.id;
              }
            }
          );
          waitingProspectList = user1ProspectsList.filter(
            (prospectID) =>
              (user1PreviousDateIds.indexOf(prospectID) < 0 ||
                prospectID !== userID) &&
              prospectID !== undefined
          );
          user1ProspectsList = user1ProspectsList.filter(
            (prospectID) =>
              user1PreviousDateIds.indexOf(prospectID) < 0 ||
              prospectID !== userID
          );
          if (user1ProspectsList.length) {
            const matchID =
              waitingProspectList.length > 0
                ? waitingProspectList[0]
                : user1ProspectsList[0];
            const matchPodID = vacantPodsIds[1];
            //create a match
            await db.query(
              `INSERT into matches (user1_id, pod1_id, user2_id, pod2_id, status, complete) VALUES ($1, $2, $3, $4, $5, $6);`,
              [userID, userPodID, matchID, matchPodID, "inProgress", false]
            );
            //set user 1 to be unavailible
            await db.query(
              `UPDATE users SET status=$2, available=$3  WHERE id=$1;`,
              [userID, "unavailable", false]
            );
            //set user 2 to be unavailible
            await db.query(
              `UPDATE users SET status=$2, available=$3   WHERE id=$1;`,
              [matchID, "unavailable", false]
            );
            //set pod 1 as occupied and associate it's occupant with user 1
            await db.query(
              `UPDATE pods SET occupied=$3, occupant_id=$1 WHERE id=$2;`,
              [userID, userPodID, true]
            );
            //set pod 2 as occupied and associate it's occupant with user 2
            await db.query(
              `UPDATE pods SET occupied=$3, occupant_id=$1 WHERE id=$2;`,
              [matchID, matchPodID, true]
            );
            success.push(true);
          } else {
            // if no viable prospect found user is set to waiting
            await db.query(`UPDATE users SET status=$2  WHERE id=$1;`, [
              userID,
              "waiting",
            ]);
            success.push(false)
          }
      }
    }
    //^__ FOR LOOP CLOSES
    if (success.some((element)=>element===true)) {
      res.status(200).json({ message: "match succesful" });
    } else {
      res.status(200).json({ message: "match not found" });
    }
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error
  }
});

/* COMPLETE MATCH */
router.post("/complete", async (req, res) => {
  try {
    const { matches } = req.body;
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const { id, user1_id, user2_id, pod1_id, pod2_id } = match;
      await db.query(`UPDATE matches SET status=$1, complete=$2 WHERE id=$3`, [
        "complete",
        true,
        id,
      ]);
      await db.query(`UPDATE users SET status=$1, available=$2 WHERE id=$3;`, [
        "available",
        true,
        user1_id,
      ]);

      await db.query(`UPDATE users SET status=$1, available=$2  WHERE id=$3;`, [
        "available",
        true,
        user2_id,
      ]);

      await db.query(
        `UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3;`,
        [false, null, pod1_id]
      );
      await db.query(
        `UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3;`,
        [false, null, pod2_id]
      );
    }
    res.status(200);
    res.json({
      status: `matches ${matches.map((match) => match.id)} completed`,
    });
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error;
  }
});

router.put("/complete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user1_id, pod1_id, user2_id, pod2_id } = req.body;
    await db.query(`UPDATE matches SET status=$1, complete=$2 WHERE id=$3`, [
      "complete",
      true,
      id,
    ]);
    await db.query(`UPDATE users SET status=$1, available=$2 WHERE id=$3;`, [
      "available",
      true,
      user1_id,
    ]);

    await db.query(`UPDATE users SET status=$1, available=$2  WHERE id=$3;`, [
      "available",
      true,
      user2_id,
    ]);

    await db.query(`UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3;`, [
      false,
      null,
      pod1_id,
    ]);

    await db.query(`UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3;`, [
      false,
      null,
      pod2_id,
    ]);

    res.status(200);
    res.json({ status: `match ${id} completed` });
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error;
  }
});

/* UPDATE */
/* UPDATE match by id */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user1_id, pod1_id, user2_id, pod2_id, status, complete } = req.body;

    await db.query(
      `UPDATE matches SET user1_id=$1, pod1_id=$2, user2_id=$3, pod2_id=$4 status=$5 complete=$6 WHERE id=$7`,
      [user1_id, pod1_id, user2_id, pod2_id, status, complete, id]
    );
    res.status(200);
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error;
  }
});

/* DELETE */
/* DELETE match by id */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM matches WHERE id = $1`, [id]);
    res.status(200);
    res.json({ message: `DELETED ${id}` });
  } catch (error) {
    console.log("ERROR:  ", error.message);
  }
});

router.delete("/", async (req, res) => {
  try {
    await db.query(`DELETE FROM matches `);
    await db.query(`UPDATE pods SET occupied=FALSE, occupant_id = NULL;`);
    await db.query(`UPDATE users SET available=TRUE, status = 'available';`);
    res.status(200);
    res.json({ message: `DELETED ALL MATCHES, EMPTIED PODS, FREED UP USERS` });
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw error;
  }
});

module.exports = router;
