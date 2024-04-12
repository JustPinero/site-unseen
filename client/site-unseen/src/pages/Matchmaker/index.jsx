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


const Matchmaker = ({dateLength, availableUsers, usersInSession, updateInSessionLists, podsInSession, addMatch, IDGenerator, dateCompletionHandler, countMatches, podCount})=>{
    /* LOCAL STATE */
  // MODAL
  const [showModal, setShowModal] = useState(false);
      /* MATCHLIST */
  const [ currentMatches, setCurrentMatches] = useState([])
  /* WAITLIST */
  const [waitList, setWaitList] = useState([]);
  const [autoMatchActive, setAutoMatch] = useState(true);
  const [matchMakingCount, setMatchMakingCount] = useState(0);
  var TableMatches
  useEffect(()=>{
    const updatedMatchCount = currentMatches.length;
    countMatches(updatedMatchCount)
  },[currentMatches]);

  const waitListAdditionHandler = (newWaitListAdditions)=>{
    const waitlistUpdates = [...waitList, ...newWaitListAdditions]
    setWaitList(waitlistUpdates)
  }

  const matchesAdditionHandler = (newMatchesList)=>{
    const updatedMatches = newMatchesList.map((newMatchData, index)=>{
    const {match1, match2, status} = newMatchData;
    /* MATCHDATA */
    const newMatchID = currentMatches.length ? IDGenerator(currentMatches, index) : index+1;
    const newMatch = {id:newMatchID, match1:match1, match2:match2, status:status};
    return newMatch
    })
    const matchesUpdate = [...currentMatches, ...updatedMatches]
    console.log(" INCOMING MATCHES UPDATE:  ", matchesUpdate)
    setCurrentMatches(matchesUpdate)
  }

  const deleteMatch = (matchID)=>{
    let updatedMatches = currentMatches.filter((removedMatch)=>{
      return (matchID!==removedMatch.id)});
    setCurrentMatches(updatedMatches)
  }


  const availabilityCheckHandler = (options, restrictions)=>{
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
  const matchMakingHandler = ()=>{
    let MatchUpdatePayload = [];
    let updatedUsersInSession = usersInSession;
    let updatedPodsInSession = podsInSession;
    let updatedWaitlist = []
    for(let i=0 ; i< availableUsers.length; i++){
      let currentUser = availableUsers[i];
      const currentUserNotInSession = updatedUsersInSession.indexOf(currentUser.id)<0;
      if(currentUserNotInSession){
        updatedUsersInSession = [...updatedUsersInSession, currentUser.id];
        let { potentialMatches } = currentUser;
        let currentMatch = availabilityCheckHandler(potentialMatches, updatedUsersInSession);
        if(currentMatch!==null){
        updatedUsersInSession = [...updatedUsersInSession, currentMatch.id];
        let userPodData
        let matchPodData
        let user1ClosestPods = currentUser.closestPods
            userPodData = availabilityCheckHandler(user1ClosestPods, updatedPodsInSession);
            if(userPodData!==null){
              updatedPodsInSession=[...updatedPodsInSession, userPodData]
                let user2ClosestPods = currentMatch.closestPods;
                matchPodData=availabilityCheckHandler(user2ClosestPods, updatedPodsInSession);
                  if(userPodData!==null && matchPodData!==null ){
                    updatedPodsInSession=[...updatedPodsInSession, matchPodData]
                    let formattedNewMatch = matchFormatter(currentUser, userPodData, currentMatch, matchPodData, "inProgress");
                    MatchUpdatePayload.push(formattedNewMatch)
                  }else{
                    const updatedWaitListAddition1 = {...currentUser, status: "waitingOnPod" };
                    updatedWaitlist.push(updatedWaitListAddition1)
                    const updatedWaitListAddition2 = {...currentUser, status: "waitingOnPod" };
                    updatedWaitlist.push(updatedWaitListAddition2)
                  }
            }else{
              updatedPodsInSession=updatedPodsInSession.filter(podID=>(podID!==userPodData))
              const updatedWaitListAddition = {...currentUser, status: "waitingOnPod" };
              updatedWaitlist.push(updatedWaitListAddition)
            }
        }else{
          updatedUsersInSession=updatedUsersInSession.filter(userID=>(userID!==currentUser.id))
          const updatedWaitListAddition = {...currentUser, status: "waitingOnMatch" };
          updatedWaitlist.push(updatedWaitListAddition)
      }
    }
   }
   console.log("updatedWaitlist", updatedWaitlist)
   matchesAdditionHandler(MatchUpdatePayload)
   waitListAdditionHandler(updatedWaitlist)
   console.log("updatedUsersInSession:  ",updatedUsersInSession, "updatedPodsInSession:  ", updatedPodsInSession)
   updateInSessionLists(updatedUsersInSession, updatedPodsInSession)
  }
  let userOptions = availableUsers;
  if(usersInSession.length){
    userOptions = availableUsers.filter(userOption=>(usersInSession.indexOf(userOption.id)<0))
  };
  return (
    <div className="matchmaker-tab">
      <MatchToolBox waitList={waitList} matchMakingHandler={matchMakingHandler} addMatch={addMatch} addUserButtonClickHandler={()=>setShowModal(true)} />
      <div className="matches-container">
          <MatchTable matches={currentMatches}  dateLength={dateLength} dateCompletionHandler={dateCompletionHandler} deleteMatch={deleteMatch}/>
      </div>
      <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ADD MATCH</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
          <div className="matchoptionsbody-container">
            <div className="matchuser-subheader">
              <p>Available Users: {waitList.length}</p><p>   Open Pods:  {podCount-podsInSession.length+1}</p>
            </div>
            <div className="matchuser-list">
            {
              waitList ?
              waitList.map(availableUser=><MatchUserOption userData={availableUser}/>): "No users are currently available"
            }
            </div>
          </div>
        }
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Matchmaker;
