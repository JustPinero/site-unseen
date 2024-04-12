/* REACT */
import {useState} from "react"
/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
/* COMPONENTS */
import MatchTable from "../../components/MatchTable"


const Matchmaker = ({dateLength, availableUsers, usersInSession, podsInSession, addMatch, IDGenerator})=>{
  const [ currentMatches, setCurrentMatches] = useState([])
  const [autoMatchActive, setAutoMatch] = useState(true);
  const [matchMakingCount, setMatchMakingCount] = useState(0);
  var TableMatches


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

  const availabilityCheckHandler = (options, restrictions)=>{
    console.log("USERS DRIVING ME CRAZY:  ", options, restrictions)
    for(let i=0; i<options.length; i++){
      let currentOption = options[i];
      console.log("USERS DRIVING ME CRAZY currentOption not undefined:  ", currentOption)
      if(currentOption.id===undefined){
        if(restrictions.indexOf(currentOption)<0){
          console.log("USERS DRIVING ME CRAZY currentOption not RESTRICTED INDEX:  ", currentOption.id, restrictions.indexOf(currentOption.id)<0)
          return currentOption
        }
      }else if(restrictions.indexOf(currentOption.id)<0){
        console.log("CURRENT OPTION HAS NO ID", currentOption, restrictions.indexOf(currentOption)<0)
        return currentOption
      }
    }

    console.log(options, "MADE IT TO NULL")
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
    let updatedOutliers = []
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
            if(userPodData){
              updatedPodsInSession=[...updatedPodsInSession, userPodData]
                let user2ClosestPods = currentMatch.closestPods;
                matchPodData=availabilityCheckHandler(user2ClosestPods, updatedPodsInSession);
                updatedPodsInSession=[...updatedPodsInSession, matchPodData]
                  if(userPodData && matchPodData ){
                    let formattedNewMatch = matchFormatter(currentUser, userPodData, currentMatch, matchPodData, "inProgress");
                    MatchUpdatePayload.push(formattedNewMatch)
            }
        }
      }
      }
   }
   console.log("CURRENTMATCHES", MatchUpdatePayload)
   matchesAdditionHandler(MatchUpdatePayload)
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
          <MatchTable matches={currentMatches}  dateLength={dateLength}/>
      </div>
    </div>
  );
}

export default Matchmaker;
