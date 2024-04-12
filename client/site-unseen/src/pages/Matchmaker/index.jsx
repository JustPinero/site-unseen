/* REACT */
import {useState} from "react"
/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
/* COMPONENTS */
import MatchTable from "../../components/MatchTable"


const Matchmaker = ({dateLength, availableUsers, usersInSession, availablePods, podsInSession, matches, addMatch, addMatches, removeMatch, updateMatch, updatePods, updateUsers, completeDate, cancelMatch})=>{
  const [autoMatchActive, setAutoMatch] = useState(true);
  const [matchMakingCount, setMatchMakingCount] = useState(0);
  var TableMatches


  const availabilityCheckHandler = (options, restrictions)=>{
    for(let i=0; i<options.length; i++){
      let currentOption = options[i];
      if(currentOption.id!==undefined){
        if(restrictions.indexOf(currentOption.id)){
          return currentOption
        }
      }
      if(restrictions.indexOf(currentOption)){
        return currentOption
      }
    }
    return null
  }
  const matchFormatter = (user, userPod, match, matchPod) =>{
    //USER DATA
    const updatedUserPotentialMatches = user.potentialMatches.filter(potentialMatch=>potentialMatch.id!==match.id);
    const updatedUserDateList = [...user.hasHadDatesWith, match];
    const formattedUserData = {...user, status: "date in progress", potentialMatches:updatedUserPotentialMatches, hasHadDatesWith:updatedUserDateList};
    //USER POD DATA
    const formattedUserPod = {...userPod, isOccupied: true, occupantData: user};
    const match1Data = {user:formattedUserData , pod:formattedUserPod }
    //MATCH DATA
    const updatedMatchDateList = [...match.hasHadDatesWith, user];
    const updatedMatchPotentialMatches = match.potentialMatches.filter(potentialMatch=>potentialMatch.id!==match.id);
    const formattedMatchData = {...match, status: " ", potentialMatches:updatedMatchPotentialMatches, hasHadDatesWith:updatedMatchDateList};
    //MATCH POD DATA
    const formattedMatchPod = {...matchPod, isOccupied: true, occupantData: match};
    const match2Data = {user:formattedMatchData , pod:formattedMatchPod };
    //NEW MATCH
    const newMatch = {match1:match1Data, match2: match2Data};
    return newMatch;
  }
  const matchMakingHandler = ()=>{
    let MatchUpdatePayload = []
    let matchCounter = 0;
    let updatedUsersInSession = usersInSession;
    let updatedPodsInSession = podsInSession;
    for(let i=0 ; i< availableUsers.length; i++){
      matchCounter = matchCounter+1
      let currentUser = availableUsers[i];
      if(updatedUsersInSession.indexOf(currentUser.id)<0){
        let { potentialMatches } = currentUser;
        let currentMatch = availabilityCheckHandler(potentialMatches, updatedUsersInSession);
        updatedUsersInSession = [...updatedUsersInSession, currentUser.id, currentMatch.id];
          let userPodData
          let matchPodData
            let user1ClosestPods = currentUser.closestPods
            userPodData = availabilityCheckHandler(user1ClosestPods, updatedPodsInSession);
            if(userPodData){
              updatedPodsInSession=[...updatedPodsInSession, userPodData]
                let user2ClosestPods = currentMatch.closestPods;
                matchPodData=availabilityCheckHandler(user2ClosestPods, updatedPodsInSession);
                updatedPodsInSession=[...updatedPodsInSession, matchPodData]
                  if(userPodData && matchPodData ){
                    let formattedNewMatch = matchFormatter(currentUser, userPodData, currentMatch, matchPodData);
                    MatchUpdatePayload.push(formattedNewMatch)
        }
      }
    }
    }
    addMatches(MatchUpdatePayload)
  }

  return (
    <div className="matchmaker-tab">
      <div className="matchmaker-buttonbox">
        <Button onClick={matchMakingHandler}>
            START MATCHING ROUND
        </Button>
        <Button onClick={addMatch }>
            ADD NEW MATCH
        </Button>
      </div>
      <div className="matches-container">
          <MatchTable matches={matches}  dateLength={dateLength}/>
      </div>
    </div>
  );
}

export default Matchmaker;
