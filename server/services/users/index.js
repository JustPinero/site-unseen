/* DB */
const db = require("../../db");

const getEligibleUsers = async (maximumDateThreshHold) => {
  console.log(" getting Eligible Users")
  return await db.query(
    `
    SELECT u.id, u.username, u.gender, u.available, u.sexual_pref, COUNT(m.id) AS num_matches
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE u.available = TRUE
    GROUP BY u.id, u.username
    HAVING COUNT(m.id) <= $1
    ORDER BY num_matches ASC;
    ;`,
    [maximumDateThreshHold]
  ).then(data => data.rows);
};

const getUserProspects = async (user, maximumDateThreshHold) => {
  console.log(" getting User Prospects")
  const { id, gender, sexual_pref } = user;
  const userPreviousMatches = await db.query(
    `SELECT user2_id, user1_id  FROM matches WHERE user1_id = $1 OR user2_id = $1 `,
    [id]
  );
  const userPreviousDateIds = userPreviousMatches.rows.map((previousMatch) => {
    const { user1_id, user2_id } = previousMatch;
    return user1_id !== userID ? user1_id : user2_id;
  });
  //SEEK PROSPECTS
  let userProspectData = []
  if (gender !== "non-binary") {
    if (sexual_pref !== "bisexual") {
      //HETEROSEXUAL AND HOMOSEXUAL QUERY
      userProspectData = await db.query(
        `
      SELECT u.id, u.username, COUNT(m.id) AS num_matches
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      WHERE (u.gender = $2 AND u.sexual_pref = $1) AND u.available=TRUE
      GROUP BY u.id, u.username
      HAVING COUNT(m.id) < $3
      ORDER BY num_matches ASC;
      `,
        [gender, sexual_pref, maximumDateThreshHold]
      ).then(data => data.rows);
    } else {
      //BISEXUAL
      userProspectData = await db.query(
        `
      SELECT u.id, u.username, COUNT(m.id) AS num_matches
      FROM users u
      LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
      WHERE (u.sexual_pref = $1 OR u.sexual_pref = 'bisexual' ) AND u.available=TRUE
      GROUP BY u.id, u.username
      HAVING COUNT(m.id) < $2
      ORDER BY num_matches ASC;
      `,
        [gender, maximumDateThreshHold]
      ).then(data => data.rows);
    }
  } else {
    //NON BINARY PROSPECTS
    userProspectData = await db.query(
      `
    SELECT u.id, u.username, COUNT(m.id) AS num_matches
    FROM users u
    LEFT JOIN matches m ON u.id = m.user1_id OR u.id = m.user2_id
    WHERE (u.sexual_pref = 'bisexual' AND u.available=TRUE)
    GROUP BY u.id, u.username
    HAVING COUNT(m.id) < $1
    ORDER BY num_matches ASC;
    `,
      [ maximumDateThreshHold]
    ).then(data => data.rows);
  }
  userProspectData = userProspectData.filter((prospect)=>(userPreviousDateIds.indexOf(prospect.id) && prospect.id!==id ))
  return userProspectData;
};

module.exports = { getEligibleUsers, getUserProspects };
