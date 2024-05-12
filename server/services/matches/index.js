/* DB */
const e = require("express");
const db = require("../../db");
const { getAvailablePods } = require("../pods");
const { getEligibleUsers, getUserProspects } = require("../users");

const getMatchesInProgress = async (maxDateDuration) => {
  return await db.query(
    `SELECT m.*, p1.id AS p1id, p2.id AS p2id , u1.username AS user1_username , u1.age AS user1_age, u1.gender AS user1_gender, u2.username AS user2_username, u2.age AS user2_age, u2.gender AS user2_gender,
    (SELECT COUNT(*) FROM matches WHERE user1_id = m.user1_id) AS user1_match_count,
    (SELECT COUNT(*) FROM matches WHERE user2_id = m.user2_id) AS user2_match_count
    FROM matches m
    LEFT JOIN pods p1 ON m.pod1_id = p1.id
    LEFT JOIN pods p2 ON m.pod2_id = p2.id
    LEFT JOIN users u1 ON m.user1_id = u1.id
    LEFT JOIN users u2 ON m.user2_id = u2.id
    WHERE started_at > CURRENT_TIMESTAMP - ($1 || ' seconds')::interval;
    `,
    [maxDateDuration]
  ).then(data => data.rows);
};

const getCompletedMatches = async (maxDateDuration) => {
  console.log("get Completed Matches with max duration of  ", maxDateDuration)
  return await db.query(
    `
    SELECT m.*, p1.id AS p1id, p2.id AS p2id , u1.username AS user1_username , u1.age AS user1_age, u1.gender AS user1_gender, u2.username AS user2_username, u2.age AS user2_age, u2.gender AS user2_gender,
    (SELECT COUNT(*) FROM matches WHERE user1_id = m.user1_id) AS user1_match_count,
    (SELECT COUNT(*) FROM matches WHERE user2_id = m.user2_id) AS user2_match_count
    FROM matches m
    LEFT JOIN pods p1 ON m.pod1_id = p1.id
    LEFT JOIN pods p2 ON m.pod2_id = p2.id
    LEFT JOIN users u1 ON m.user1_id = u1.id
    LEFT JOIN users u2 ON m.user2_id = u2.id
    WHERE started_at < CURRENT_TIMESTAMP - ($1 || ' seconds')::interval;
    `,
    [maxDateDuration]
  ).then(data => data.rows);
};

const getPotentialMatches = async (maxDateThreshHold) => {
  console.log("GET POTENTIAL MATCHES")
  const elligibleUsers = getEligibleUsers(maxDateThreshHold);
  const availablePods = getAvailablePods();
  let potentialMatches = [];
  // if pods are avaibles
  if ((await availablePods.length) >= 2) {
    if ((await elligibleUsers.length) >= 2) {
      // if there is greater than or equal to two users availble, meaning they are not in an inprogess match or they have not exceeded the max date count
      return elligibleUsers
        .map((elligibleUser) => {
          // if amoung those users there are two that are compadible ()
          return {
            user: elligibleUser,
            prospects: getUserProspects(elligibleUser, maxDateThreshHold),
          };
        })
        .filter((potentialMatch) => potentialMatch.propsects.length > 0);
    }
  }
  console.log("RETURNED POTENTIAL MATCHES LENGTH", potentialMatches.length)
  return potentialMatches;
};

module.exports = {
  getMatchesInProgress,
  getCompletedMatches,
  getPotentialMatches,
};
