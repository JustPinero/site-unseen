/* REACT */
import { useState, useEffect } from "react";
/* STYLES */
import "./styles.css";
/* BOOTSTRAP COMPONENTS */
import Modal from "react-bootstrap/Modal";
/* COMPONENTS */
import MatchTable from "../../components/MatchTable";
import MatchToolBox from "./MatchToolBox";
import MatchUserOption from "../../components/MatchBox/MatchHalf/MatchUserOption";

const Matchmaker = ({
  simIsRunning,
  simulationStartHandler,
  dateDuration,
  bufferDuration,
  matchQueue,
  usersInSession,
  updateInSessionLists,
  podsInSession,
  IDGenerator,
  datesCompletionHandler,
  countMatches,
  podCount,
  heteroSexualMaleMatchList,
  homoSexualMaleMatchList,
  biSexualMaleMatchList,
  heteroSexualFemaleMatchList,
  homoSexualFemaleMatchList,
  biSexualFemaleMatchList,
  nonBinarySeekingMalesMatchList,
  nonBinarySeekingFemalesMatchList,
  biSexualNonBinaryMatchList,
  currentMatches,
  addMatch,
  addMatches,
  deleteMatch,
  completedDateQueue,
  addToDateCompletionQueue,
}) => {
  /* LOCAL STATE */
  /* MATCHLIST */
  // const [ currentMatches, setCurrentMatches] = useState([])
  const [matchCount, setMatchCount] = useState(0);
  let updatedMatches = currentMatches;
  let updatedUsersInSession = usersInSession;
  let updatedPodsInSession = podsInSession;
  let pauseMatchMaking = false


  useEffect(() => {
    if(completedDateQueue.length){
      pauseMatchMaking=true
    }else{
      pauseMatchMaking=false
    }
    datesCompletionHandler(completedDateQueue)
  }, [completedDateQueue]);

  /* -------MATCH QUEUE------- */
  useEffect(() => {

    if (matchQueue.length && !pauseMatchMaking) {
      if(matchCount <= podCount / 2){
      for (let i = 0; i < matchQueue.length; i++) {
        const newCandidateData = matchQueue[i];
        if (newCandidateData) {
          const newMatch = matchMakingHandler(newCandidateData);
          if(newMatch!==undefined){
            updatedMatches = [...updatedMatches, newMatch];
            addMatches(updatedMatches)
          }
        } else {
          break;
        }
      }
    }
    }
  }, [matchQueue]);

/*------ MATCHES----- */

const dateCompletedFunction = (date)=>{
  addToDateCompletionQueue(date)
}
  const matchRemovalHandler = (matchID) => {
    let updatedMatchCount = matchCount - 1;
    setMatchCount(updatedMatchCount);
    deleteMatch(matchID);
  };

/*------ MATCHES----- */
/*------ HELPERS----- */
  const availabilityCheckHandler = (options, restrictions) => {

    for (let i = 0; i < options.length; i++) {
      let currentOption = options[i];
      if (currentOption.id === undefined) {
        if (restrictions.indexOf(currentOption) < 0) {
          return currentOption;
        }
      } else if (restrictions.indexOf(currentOption.id) < 0) {
        return currentOption;
      }
    }
    return null;
  };

  const matchFinder = (userSeekingMatch, busyUserList) => {

    let prospectsKey = {
      male: {
        male: homoSexualMaleMatchList,
        female: heteroSexualMaleMatchList,
        bisexual: biSexualMaleMatchList,
      },
      female: {
        male: heteroSexualFemaleMatchList,
        female: homoSexualFemaleMatchList,
        bisexual: biSexualFemaleMatchList,
      },
      nonbinary: {
        male: nonBinarySeekingMalesMatchList,
        female: nonBinarySeekingFemalesMatchList,
        bisexual: biSexualNonBinaryMatchList,
      },
    };
    const { gender, sexual_pref, hasHadDatesWith } = userSeekingMatch;
    const prospects =
      prospectsKey[gender === "non-binary" ? "nonbinary" : gender][sexual_pref];
    const restrictions = [
      userSeekingMatch.id,
      ...busyUserList,
      ...hasHadDatesWith,
    ];
    const newMatch = availabilityCheckHandler(prospects, restrictions);

    return newMatch;
  };

  const matchFormatter = (user, userPod, match, matchPod, status) => {
    const updatedUserDateList = [...user.hasHadDatesWith, match];
    const formattedUserData = {
      ...user,
      status: "date in progress",
      hasHadDatesWith: updatedUserDateList,
    };
    //USER POD DATA
    const formattedUserPod = {
      id: userPod,
      isOccupied: true,
      occupantData: user,
    };
    const match1Data = { user: formattedUserData, pod: formattedUserPod };
    //MATCH DATA
    const updatedMatchDateList = [...match.hasHadDatesWith, user];
    const formattedMatchData = {
      ...match,
      status: " ",
      hasHadDatesWith: updatedMatchDateList,
    };
    //MATCH POD DATA
    const formattedMatchPod = {
      id: matchPod,
      isOccupied: true,
      occupantData: match,
    };
    const match2Data = { user: formattedMatchData, pod: formattedMatchPod };
    //NEW MATCH
    const newMatch = { match1: match1Data, match2: match2Data, status: status };
    return newMatch;
  };
/*------ HELPERS----- */

  //IN SESSION
  const addToUserInSessionList = (userID)=>{
    updatedUsersInSession = [...updatedUsersInSession, userID];
  }
  const removeFromUserInSessionList = (userID)=>{
    updatedUsersInSession = updatedUsersInSession.filter(inSessionID=> userID!==inSessionID)
  }
  const matchMakingHandler = (currentUser) => {


    const currentUserNotInSession =
      updatedUsersInSession.indexOf(currentUser.id) < 0;
    if (currentUserNotInSession) {
      updatedUsersInSession = [...updatedUsersInSession, currentUser.id];
      let currentMatch = matchFinder(currentUser, updatedUsersInSession);
      if (currentMatch !== null) {
        addToUserInSessionList(currentMatch.id)
        let userPodData;
        let matchPodData;
        let user1ClosestPods = currentUser.closestPods;
        userPodData = availabilityCheckHandler(
          user1ClosestPods,
          updatedPodsInSession,
        );
        if (userPodData !== null) {
          updatedPodsInSession = [...updatedPodsInSession, userPodData];
          let user2ClosestPods = currentMatch.closestPods;
          matchPodData = availabilityCheckHandler(
            user2ClosestPods,
            updatedPodsInSession,
          );
          if (userPodData !== null && matchPodData !== null) {
            setMatchCount(matchCount + 1);
            updatedPodsInSession = [...updatedPodsInSession, matchPodData];
            let formattedNewMatch = matchFormatter(
              currentUser,
              userPodData,
              currentMatch,
              matchPodData,
              "inProgress",
            );
            updatedUsersInSession =[...updatedUsersInSession, updatedUsersInSession, updatedPodsInSession];
            return formattedNewMatch;
          } else{
            removeFromUserInSessionList(currentUser.id)
            removeFromUserInSessionList(currentMatch.id)
          }
        }else{
          removeFromUserInSessionList(currentUser.id)
          removeFromUserInSessionList(currentMatch.id)
        }
      }
    }
  };

  const runSimulation = () => {
  };
  return (
    <div className="matchmaker-tab">
      {/* <MatchToolBox roundCount={roundCount} simIsRunning={simIsRunning} runSimulation={runSimulation} waitList={waitList} matchMakingHandler={()=>{}} addMatch={addMatch}   /> */}
      <div className="matches-container">
        <MatchTable
          matches={currentMatches}
          dateDuration={dateDuration}
          bufferDuration={bufferDuration}
          dateCompletionHandler={dateCompletedFunction}
          deleteMatch={matchRemovalHandler}
        />
      </div>
    </div>
  );
};

export default Matchmaker;
