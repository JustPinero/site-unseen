/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Modal from 'react-bootstrap/Modal';
/* COMPONENTS */
import MatchTable from "../../components/MatchTable"
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
  addMatch,
  IDGenerator,
  dateCompletionHandler,
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
  biSexualNonBinaryMatchList
})=>{
  console.log("matchQueue:  ", matchQueue)
  /* LOCAL STATE */
  //
  const [matchCandidate, setMatchCandidate] = useState(null)
      /* MATCHLIST */
  const [ currentMatches, setCurrentMatches] = useState([])
  /* WAITLIST */
  // const [waitList, setWaitList] = useState([]);
  // const [roundCount, setRoundCount] = useState(0);

  // let updatedUsersInSession = usersInSession
  // let updatedPodsInSession = podsInSession

  useEffect(()=>{
    console.log("updated match queue detected:  ", matchQueue)
    if(matchQueue.length){
    for(let i=0; i<matchQueue.length; i++){
      const newCandidateData = matchQueue[i]
      console.log("updated CURRENT MATCHES LENGTH", currentMatches.length)
      if(newCandidateData && currentMatches.length<=(podCount/2)) {
        console.log("updated MATCH CANDIDATE:  ", matchQueue[i])
        matchCandidateAdditionHandler(newCandidateData)
      } else {
        break;
      }
    }
  }
  },[matchQueue]);

  useEffect(()=>{
    console.log("matchCandidate:  ", matchCandidate)
    if(matchCandidate!==null){
      if(usersInSession.indexOf(matchCandidate.id)<0){
        matchMakingHandler(matchCandidate)
      }
    }
  },[matchCandidate]);


  // useEffect(()=>{
  //   console.log("current matches recieved a change:  ", currentMatches)
  //   const updatedMatchCount = currentMatches.length;
  //   countMatches(updatedMatchCount)
  // },[currentMatches]);
  
  const matchCandidateAdditionHandler = (newCandidate)=>{
    console.log("matchCandidateAdditionHandler:  ", newCandidate)
    let updatedMatchCandidate = newCandidate;
    setMatchCandidate(updatedMatchCandidate);
  }

  const matchesAdditionHandler = (newMatchData)=>{
    console.log("MATCH HANDLER STARTING CURRENT MATCHES:  ", currentMatches)
    const {match1, match2, status} = newMatchData;
    /* MATCHDATA */
    const newMatchID = currentMatches.length+1;
    const newMatch = {id:newMatchID, match1:match1, match2:match2, status:status};
    const matchesUpdate = [...currentMatches, newMatch]
    console.log("MATCH HANDLER INCOMING MATCHES UPDATE:  ", matchesUpdate)
    setCurrentMatches(matchesUpdate)
  }

  const deleteMatch = (matchID)=>{
    let updatedMatches = currentMatches.filter((removedMatch)=>{
      return (matchID!==removedMatch.id)});
    setCurrentMatches(updatedMatches)
  }

  const availabilityCheckHandler = (options, restrictions)=>{
    console.log("I BROKE IT:  ", options, restrictions)
    for(let i=0; i<options.length; i++){
      let currentOption = options[i];
      if(currentOption.id===undefined){
        if(restrictions.indexOf(currentOption)<0){
          return currentOption
        }
      }else if(restrictions.indexOf(currentOption.id)<0){
        return currentOption
      }
    }
    return null
  }

const matchFinder = (userSeekingMatch, busyUserList)=>{
  console.log("MATCHMAKER:  ", userSeekingMatch, busyUserList)
  let prospectsKey =  {
    male:{
      male: homoSexualMaleMatchList,
      female: heteroSexualMaleMatchList,
      bisexual: biSexualMaleMatchList
    },
    female:{
      male: heteroSexualFemaleMatchList,
      female: homoSexualFemaleMatchList,
      bisexual: biSexualFemaleMatchList
    },
    nonbinary: {
      male: nonBinarySeekingMalesMatchList,
      female: nonBinarySeekingFemalesMatchList,
      bisexual: biSexualNonBinaryMatchList
    }
  }
  const {gender, sexual_pref, hasHadDatesWith}=userSeekingMatch;
  const prospects = prospectsKey[gender==="non-binary" ? "nonbinary": gender][sexual_pref];
  const restrictions = [userSeekingMatch.id, ...busyUserList, ...hasHadDatesWith];
  const newMatch =availabilityCheckHandler(prospects, restrictions);
  console.log("MATCHMADE:  ", newMatch)
  return newMatch;
}

  const matchFormatter = (user, userPod, match, matchPod, status) =>{
    //USER DATA
    const updatedUserPotentialMatches = user.potentialMatches.filter(potentialMatch=>potentialMatch.id!==match.id);
    const updatedUserDateList = [...user.hasHadDatesWith, match];
    const formattedUserData = {...user, status: "date in progress", potentialMatches:updatedUserPotentialMatches, hasHadDatesWith:updatedUserDateList};
    //USER POD DATA
    const formattedUserPod = {id:userPod, isOccupied: true, occupantData: user};
    const match1Data = {user:formattedUserData , pod:formattedUserPod }
    //MATCH DATA
    const updatedMatchDateList = [...match.hasHadDatesWith, user];
    const updatedMatchPotentialMatches = match.potentialMatches.filter(potentialMatch=>potentialMatch.id!==match.id);
    const formattedMatchData = {...match, status: " ", potentialMatches:updatedMatchPotentialMatches, hasHadDatesWith:updatedMatchDateList};
    //MATCH POD DATA
    const formattedMatchPod = {id:matchPod, isOccupied: true, occupantData: match};
    const match2Data = {user:formattedMatchData , pod:formattedMatchPod };
    //NEW MATCH
    const newMatch = {match1:match1Data, match2: match2Data, status:status};
    return newMatch;
  }
  const matchMakingHandler = (currentUser)=>{
    console.log("MATCHMAKER RUNNING!  ")
    let updatedUsersInSession = usersInSession;
    let updatedPodsInSession = podsInSession;
    console.log("MATCHING USER:  ", currentUser)
    const currentUserNotInSession = updatedUsersInSession.indexOf(currentUser.id)<0;
    if(currentUserNotInSession){
      updatedUsersInSession = [...updatedUsersInSession, currentUser.id];
      console.log("2nd time USER BEFORE MATCH CHECK:  ", currentUser)
      let currentMatch = matchFinder(currentUser,updatedUsersInSession)
      if(currentMatch!==null){
      updatedUsersInSession = [...updatedUsersInSession, currentMatch.id];
      let userPodData
      let matchPodData
      let user1ClosestPods = currentUser.closestPods
      console.log("3rd time USER BEFORE CLOSEST POD CHECK:  ", currentUser)
          userPodData = availabilityCheckHandler(user1ClosestPods, updatedPodsInSession);
          if(userPodData!==null){
            updatedPodsInSession=[...updatedPodsInSession, userPodData]
              let user2ClosestPods = currentMatch.closestPods;
              console.log("4rtj time MATCH BEFORE CLOSEST POD CHECK:  ", currentMatch)
              matchPodData=availabilityCheckHandler(user2ClosestPods, updatedPodsInSession);
                if(userPodData!==null && matchPodData!==null ){
                  updatedPodsInSession=[...updatedPodsInSession, matchPodData]
                  let formattedNewMatch = matchFormatter(currentUser, userPodData, currentMatch, matchPodData, "inProgress");
                  matchesAdditionHandler(formattedNewMatch)
                }
          }
      }
    }
    console.log("updatedUsersInSession:  ",updatedUsersInSession, "updatedPodsInSession:  ", updatedPodsInSession)
    updateInSessionLists(updatedUsersInSession, updatedPodsInSession)
  }
  let userOptions = matchQueue;
  if(usersInSession.length){
    userOptions = matchQueue.filter(userOption=>(usersInSession.indexOf(userOption.id)<0))
  };

  const runSimulation = ()=>{
    // simulationStartHandler()
    // let updatedRoundCount = 0
    // while(matchQueue.length ){
    //   setRoundCount(updatedRoundCount+1)
    //   matchMakingRoundHandler()
    // }
    // matchMakingRoundHandler()
  }
  return (
    <div className="matchmaker-tab">
        {/* <MatchToolBox roundCount={roundCount} simIsRunning={simIsRunning} runSimulation={runSimulation} waitList={waitList} matchMakingHandler={()=>{}} addMatch={addMatch}   /> */}
      <div className="matches-container">
          <MatchTable matches={currentMatches} dateDuration={dateDuration} bufferDuration={bufferDuration} dateCompletionHandler={dateCompletionHandler} deleteMatch={deleteMatch}/>
      </div>
    </div>
  );
}

export default Matchmaker;
