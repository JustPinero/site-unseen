var express = require("express");
var router = express.Router();
const db = require("../db");
/* SERVICES */
const {
  getMatchesInProgress,
  getCompletedMatches,
  getPotentialMatches,
} = require("../services/matches");

/* GET SIM STATUS */

const getUsersWithDatesUnderThreshold = async (minDateThreshold) => {
  console.log("GET USERS WITH DATES UNDER THRESHOLD:  ", minDateThreshold)
  return await db.query(
    `
    SELECT u.id, u.username, COUNT(m.id) AS num_matches
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    GROUP BY u.id, u.username
    HAVING COUNT(m.id) < $1;
    `,
    [minDateThreshold]
  ).then(data => data.rows);
};

router.post("/status", async (req, res) => {
  const { minDateThreshold, maxDateThreshHold, maxDateDuration } = req.body;
  try {
    let isSimComplete = false;
    // if max duration exceded
    const usersWithDatesUnderThreshold = await getUsersWithDatesUnderThreshold(minDateThreshold)
    const matchesInProgress = await getMatchesInProgress(maxDateDuration)
    const potentialMatches = await getPotentialMatches(maxDateThreshHold)
    // if all users have had min dates
    if (await usersWithDatesUnderThreshold.length < 1) {
      console.log("NUMBER OF USERS WITH DATA UNDER THRESHHOLD", usersWithDatesUnderThreshold.length)
      isSimComplete = true;
    } else if (
      await matchesInProgress.length === 0 &&
      await potentialMatches.length === 0
    ) {
      console.log("I am in the no matches no no potential matches block")
      // there are no more matches possibble meaning there are no inprogress dates and there are no possible dates
      isSimComplete = true;
    } else {
      isSimComplete = false;
    }
    console.log("isSimComplete:  ", { simStatus: isSimComplete })
    res.status(200).json({ simStatus: isSimComplete });
  } catch (error) {
    console.log("ERROR:  ", error.message);
    throw err
  }
});

module.exports = router;
