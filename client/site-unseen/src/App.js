/* HELPERS */
import userGenerationHelper from "./components/helpers/userGenerationHelper.js"
/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
/* BOOTSTRAP COMPONENTS */
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
/* COMPONENTS */
import Header from "./components/Header/index.jsx";
import Dashboard from "./pages/Dashboard";
import Matchmaker from "./pages/Matchmaker";
import UserInfo from "./pages/UserInfo";
import EventWarning from "./components/Alerts/EventWarning";
/* DEFAULT VALUES */
const USERNUMBER = 284;
const PODNUMBER = 20;
const EVENTDURATION = 10800
const BUFFERDURATION = 10;
const DATEDURATION = 10;
const MINIMUMDATENUMBER = 3;

/* ---------HELPERS--------- */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function IDGenerator(dataList, offset){
  let newID = 1;
  dataList.forEach((data)=>{
    const {id} = data
    if(id>=newID){
      newID= id;
    }
  })
  newID = newID+offset;
  return newID
}

const podDummyDataGenerator = (numberOfPods)=>{
  let podData = [];
  for(let i=0; i<numberOfPods ;i++){
    const pod = {id: i, isOccupied:false, occupantID:null, occupantData: null}
    podData.push(pod)
  }
  return podData
}
/* ---------HELPERS--------- */

const App = ()=> {
  /*--------LOCAL STATE---------- */
  /* SIMULATION */
  const [simIsRunning, setSimIsRunning] = useState(false)
  const [simIsComplete, setSimIsComplete] = useState(false)
  const [roundCount, setRoundCount] = useState(0);
  /* Session Time */
  const [sessionLength, setSessionLength]= useState(EVENTDURATION);
  /* DATES */
  const [bufferDuration, setBufferDuration]= useState(BUFFERDURATION);
  const [dateDuration, setDateDuration]= useState(DATEDURATION);
  const [minumumDateAmount, setMinimumDateAmount] = useState(MINIMUMDATENUMBER)
  /* USERS */
  const [users, setUsers] = useState([]);
  const [matchQueue, setMatchQueue] = useState([]);
  const [usersInSession, setUsersInSession] = useState([]);
  /* PODS */
  const [podCount, setPodCount] = useState(PODNUMBER)
  const [pods, setPods] = useState([]);
  const [availablePods, setAvailablePods] = useState([]);
  const [podsInSession, setPodsInSession] = useState([]);
  /* MATCHES */
  const [currentMatches, setCurrentMatches] = useState([]);
  const [matchCount, setMatchCount] = useState([]);
  /* MATCH GROUPS */
  //MALE
  const [heteroSexualMaleMatchList, setHeteroSexualMaleMatchList] = useState([]);
  const [homoSexualMaleMatchList, setHomoSexualMaleMatchList] =  useState([]);
  const [biSexualMaleMatchList, setBiSexualMaleMatchList] =  useState([])
  //FEMALE
  const [heteroSexualFemaleMatchList, setHeteroSexualFemaleMatchList] = useState([]);
  const [homoSexualFemaleMatchList, setHomoSexualFemaleMatchList] =  useState([]);
  const [biSexualFemaleMatchList, setBiSexualFemaleMatchList] =  useState([]);
  //NON-BINARY
  const [nonBinarySeekingMalesMatchList, setNonBinarySeekingMaleMatchList] = useState([]);
  const [nonBinarySeekingFemalesMatchList, setNonBinarySeekingFemaleMatchList] = useState([]);
  const [biSexualNonBinaryMatchList, setBiSexualNonBinaryMatchList] = useState([]);
   /* ALERTS */
   //PODS
   const [allPodsAreFull, setallPodsAreFull] = useState(false);
   //DATES
  const [completedDateQueue, setCompletedDateQueue] = useState([]);
  const [hasUnderThanMinimumPotentialDates, setHasUnderThanMinimumPotentialDates] = useState(false);
  const [usersWithTooFewDates, setUsersWithTooFewDates] = useState([]);
  
  /* ----------LOCAL STATE------------- */
  /* ---------------STATE DEPENDANT VARIABLES FORMATTED DATA AND METRICS-------------------------- */
  /* DATE DURATION */

//   /* ---------------STATE DEPENDANT FORMATTED DATA AND METRICS-------------------------- */
//   /* ---------------LIFECYCLE-------------------------- */
/* --------INIT-------- */
  useEffect(()=>{
    console.log("INIT!")
    let initialUsers = userGenerationHelper(USERNUMBER);
    if(initialUsers){
    initialUsers = initialUsers.map((user)=>({...user, id:users.length+user.id}))
    const initialPods = podDummyDataGenerator(podCount);
    const formattedUpdatedUserData = initialUsers.map(userData =>{
      const {gender, sexual_pref} = userData
      function generateClosestPods(){
        let closestPodList = [];
        for(let i =0; i<= podCount ; i++){
          let newPodID = getRandomInt(0, podCount );
          closestPodList.push(newPodID);
        }
        return closestPodList;
      }
      const updatedPodList = generateClosestPods();

      const formattedUserData = {...userData, isInDate:false, dateCount:0, hasHadDatesWith:[], closestPods: updatedPodList, status: "available"};
      return formattedUserData;
    })
    setUsers(formattedUpdatedUserData);
    setPods(initialPods);
  }
  },[]);
  /* --------INIT-------- */
  /* --------USERS-------- */
  /* MATCH QUEUE FORMATTING */
  useEffect(()=>{
    console.log("A USER CHANGED!!:  ", users)
  let updatedMatchQueue = users.filter(user=> ((user.dateCount <  minumumDateAmount)|| (user.status !==  "noMoreProspects") ));
  if(!updatedMatchQueue.length && simIsRunning){
    setSimIsRunning(false)
    setSimIsComplete(true)
  }
  console.log("filtered Data:  ", updatedMatchQueue)
  updatedMatchQueue = updatedMatchQueue.sort((candidateA, candidateB)=>{
    const dateCountA = candidateA.dateCount
    const dateCountB = candidateB.dateCount
    return dateCountA - dateCountB ;
  })
  //GENDER
  //MALE
  const maleUsers = updatedMatchQueue?.filter(user=>user.gender==="male");
  //SEXUAL PREFERENCES
  const heteroSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="female");
  const homoSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="male");
  const biSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="bisexual");
  //FEMALE
  const femaleUsers = updatedMatchQueue?.filter(user=>user.gender==="female");
  //SEXUAL PREFERENCES
  const heteroSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="male");
  const homoSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="female");
  const biSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="bisexual");
  //NON-BINARY
  const nonBinaryUsers = updatedMatchQueue?.filter(user=>user.gender==="non-binary");
  //SEXUAL PREFERENCES
  const nonBinaryUsersSeekingMale = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="male");
  const nonBinaryUsersSeekingFemale = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="female");
  const nonBinaryBisexualUsers = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="bisexual");
/* MATCH GROUPS */
  //MALE
  const updatedHeteroSexualMaleMatchList = [...heteroSexualfemaleUsers, ...biSexualfemaleUsers];
  const updatedHomoSexualMaleMatchList = [...homoSexualMaleUsers, ...biSexualMaleUsers];
  const updatedBiSexualMaleMatchList = [...homoSexualMaleUsers, ...biSexualMaleUsers, ...heteroSexualfemaleUsers, ...biSexualfemaleUsers, ...nonBinaryBisexualUsers, ...nonBinaryUsersSeekingMale]
  setHeteroSexualMaleMatchList(updatedHeteroSexualMaleMatchList);
  setHomoSexualMaleMatchList(updatedHomoSexualMaleMatchList);
  setBiSexualMaleMatchList(updatedBiSexualMaleMatchList);
  //FEMALE
  const updatedHeteroSexualFemaleMatchList = [...heteroSexualMaleUsers, ...biSexualMaleUsers];
  const updatedHomoSexualFemaleMatchList = [...homoSexualfemaleUsers, ...biSexualfemaleUsers];
  const updatedBiSexualFemaleMatchList = [...homoSexualfemaleUsers, ...biSexualfemaleUsers, ...heteroSexualMaleUsers, ...biSexualMaleUsers, ...nonBinaryBisexualUsers, ...nonBinaryUsersSeekingFemale]
  setHeteroSexualFemaleMatchList(updatedHeteroSexualFemaleMatchList);
  setHomoSexualFemaleMatchList(updatedHomoSexualFemaleMatchList);
  setBiSexualFemaleMatchList(updatedBiSexualFemaleMatchList);
  //NON-BINARY
  const updatedNonBinarySeekingMaleMatchList = [...biSexualMaleUsers, ...nonBinaryBisexualUsers];
  const updatedNonBinarySeekingFemaleMatchList = [...biSexualfemaleUsers, ...nonBinaryBisexualUsers];
  const updatedBiSexualNonBinaryMatchList = [...biSexualMaleUsers, ...biSexualfemaleUsers, ...nonBinaryBisexualUsers]
  setNonBinarySeekingMaleMatchList(updatedNonBinarySeekingMaleMatchList);
  setNonBinarySeekingFemaleMatchList(updatedNonBinarySeekingFemaleMatchList);
  setBiSexualNonBinaryMatchList(updatedBiSexualNonBinaryMatchList);
  if(!updatedMatchQueue.length && simIsRunning){
    setSimIsRunning(false)
    setSimIsComplete(true)
  }
  console.log("INCOMING MATCH QUEUE UPDATE:  ", updatedMatchQueue)
  setMatchQueue(updatedMatchQueue);
  },[users]);
/* --------USERS-------- */

/* --------MATCH QUEUE-------- */
useEffect(()=>{
  console.log("MATCHEE MATCHEE:  ", currentMatches)
}, [currentMatches])
/* ---------------LIFECYCLE-------------------------- */
/* --------------------HANDLERS------------- */
/* ----------SIMULATION------------- */
const simulationStartHandler = ()=>{
  setSimIsRunning(true)
}
const simulationCancellationHandler = ()=>{
  setSimIsRunning(false)
}
/* ----------SIMULATION------------- */
/* ----------USERS------------- */

// const clearUsersHandler = ()=>{
//   setUsers([]);
//   setMatches([]);
// }
/* ----------USERS------------- */

/* ----------PODS------------- */
/* ----------MATCH------------- */


  // const matchCancellationHandler = (matchID)=>{
  //   let updatedMatches = matches.filter((match)=>{
  //   if(matchID==match.id){
  //     const {pod1, pod2} = match;
  //     const user1 = pod1?.occupantData;
  //     const user2 = pod2?.occupantData;
  //     const updatedPods = pods.map(pod=>{
  //       if(pod1 && (pod.id ===pod1.id)){
  //         const updatedPod1 = {...pod1, isOccupied:false, occupantID:null, occupantData: null}
  //         return updatedPod1;
  //       }else
  //       if(pod2 && (pod.id ===pod2.id)){
  //         const updatedPod2 = {...pod2, isOccupied:false, occupantID:null, occupantData: null}
  //         return updatedPod2;
  //       }else{
  //       return pod
  //       }
  //     })
  //   const updatedUsers = users.map((user)=>{
  //     if(user1 && (user.id === user1.id)){
  //       const updatedUser1 = {...user1, isInDate:false}
  //       return updatedUser1;
  //     }else
  //     if(user2 && (user.id === user2.id)){
  //       const updatedUser2 = {...user2, isInDate:false}
  //       return updatedUser2;
  //     }else {
  //     return user
  //     }
  //   })
  //   setUsers(updatedUsers)
  //   setPods(updatedPods)
  //   }
  // })
  //   setMatches(updatedMatches);
  // }
const matchCountChangeHandler = (updatedCount)=>{
  setMatchCount(updatedCount)
}
// /* ----------MATCH------------- */
// /* -------USERS---------- */
//ADD USER
  const addUser = (newUserData)=>{
    const updatedUsers = [...users, newUserData]
    setUsers(updatedUsers)
  }
//ADD USERS
  const addUsers = (newUsersData)=>{
    const updatedUsers = [...newUsersData, ...users]
    setUsers(updatedUsers)
  }
// UPDATE USER
const userUpdateHandler = (userID, userUpdate)=>{
  const updatedUsers = users.map(user=>{
    if(user.id===userID){
      return userUpdate
    }
      return user
  })
  setUsers(updatedUsers)
}
// UPDATE USERS
  const usersUpdateHandler = (userUpdatelist)=>{
    console.log("userUpdatelist:  ", userUpdatelist)
    let updatedUserUpdateList = userUpdatelist;
    const updatedUsers = users.map((user)=>{
      for(let i= 0; i<updatedUserUpdateList.length; i++){
        const listedUser = updatedUserUpdateList[i];
        const listedUserID = listedUser.id;
        const userID = user.id;
        if(userID=== listedUserID){
          console.log("UPDATED USER DATA: ", listedUser)
          return listedUser
        }
      }
      return user;
    })
    setUsers(updatedUsers)
  }
//DELETE USER
const userRemovalHandler = (userID)=>{
  const updatedUsers = users.filter(user=>(user.id!==userID))
  setUsers(updatedUsers)
};
// /* -----------USERS------------ */
// /* ----------PODS------------- */
//ADD POD
const podAdditionHandler = (podCount)=>{
  let updatedPods = [...pods]
  for(let i= pods.length ; i < (pods.length + podCount) ; i++){
    const newPodID = IDGenerator(updatedPods, i)
    const pod = {id: newPodID, isOccupied:false, occupantID:null, occupantData: null, remainingTime:null};
    updatedPods.push(pod)
  }
  setPods(updatedPods)
}
//UPDATE POD
//UPDATE PODS
const podsUpdateHandler = (podUpdatelist)=>{
  let updatedPodUpdateList = podUpdatelist;
  const updatedPods = pods.map(pod=>{
    const currentId = pod.id;
    for(let i= 0; i<updatedPodUpdateList.length; i++){
      let updatedPodData = updatedPodUpdateList[i];
      const {id} = updatedPodData;
      const isPodBeingUpdated = currentId===id;
      if(isPodBeingUpdated){
        updatedPodUpdateList = updatedPodUpdateList.filter((updatedPod)=>(updatedPod.id!==id))
        return updatedPodData;
      }
    }
      return pod;
  })
  setPods(updatedPods)
}
//DELETE POD(S)
const podDeletionHandler = (podDeletionCount)=>{
  let updatedPods = pods.slice(0, (pods.length-podDeletionCount))
  setPods(updatedPods)
}
// /* ----------PODS------------- */
/* -----------DATES------------ */
  const dateCompletionHandler = (match)=>{
    const {match1, match2} = match;
    //PODS UDPATE
    const pod1 = match1.pod
    const pod2 = match2.pod
    const updatedPod1 = {...pod1, isOccupied:false, occupantID:null, occupantData: null}
    const updatedPod2 = {...pod2, isOccupied:false, occupantID:null, occupantData: null}
    //USERS UPDATE
    const user1 = match1.user;
    const user2 = match2.user;
    const updatedUser1 = {...user1, isInDate:false}
    const updatedUser2 = {...user2, isInDate:false}
    usersUpdateHandler([updatedUser1, updatedUser2])
    podsUpdateHandler([updatedPod1, updatedPod2])
  };

  const datesCompletionHandler = (matches)=>{
    let updatedUsers = [];
    let updatedPods =[];
    if(matches.length){
    matches.map(matchData=>{
      if(matchData){
    const {match1, match2, id} = matchData;
    //PODS UDPATE
    const pod1 = match1.pod
    const pod2 = match2.pod
    const updatedPod1 = {...pod1, isOccupied:false, occupantID:null, occupantData: null}
    const updatedPod2 = {...pod2, isOccupied:false, occupantID:null, occupantData: null}
    //USERS UPDATE
    const user1 = match1.user;
    const user2 = match2.user;
    const updatedUser1DateList = [...user1.hasHadDatesWith, user2];
    const updatedUser1DateCount = user1.dateCount+1
    const updatedUser2DateList = [...user2.hasHadDatesWith, user1];
    const updatedUser2DateCount = user2.dateCount+1

    const updatedUser1 = {...user1, isInDate:false, dateCount:updatedUser1DateCount, hasHadDatesWith:updatedUser1DateList}
    const updatedUser2 = {...user2, isInDate:false, dateCount:updatedUser2DateCount, hasHadDatesWith:updatedUser2DateList}
    updatedUsers = [ updatedUser1, updatedUser2];
    updatedPods = [ updatedPod1, updatedPod2]
      }
    })
    usersUpdateHandler(updatedUsers)
    podsUpdateHandler(updatedPods)
  }
  };
  const addToDateCompletionQueue = (date)=>{
    const updatedCompletedDateQueue = [...completedDateQueue, date]
    setCompletedDateQueue(updatedCompletedDateQueue)
  }
/* -----------DATES------------ */
const updateInSessionLists = (busyUsers, usedPods)=>{
  const updatedUsersInSession = [...usersInSession, ...busyUsers];
  const updatedPodsInSession = [...podsInSession, ...usedPods];
  setUsersInSession(updatedUsersInSession)
  setPodsInSession(updatedPodsInSession)
};
const bufferDurationChangeHandler = (e)=>{
  let updatedBufferDuration = e.target.value
  updatedBufferDuration=parseInt(updatedBufferDuration)
  setBufferDuration(updatedBufferDuration)
}
const dateDurationChangeHandler = (e)=>{
  let updatedDateDuration= e.target.value
  updatedDateDuration=parseInt(updatedDateDuration)
  setDateDuration(updatedDateDuration)
}

const minimumDateAmountChangeHandler = (e)=>{
  let updatedMinimumDateAmount= e.target.value
  setMinimumDateAmount(updatedMinimumDateAmount)
}
/* -----------DATES------------ */
/* -----------MATCHES------------ */
const matchAdditionHandler = (newMatchData)=>{
  const {match1, match2, status} = newMatchData;
  /* MATCHDATA */
  const newMatchID = currentMatches.length+1;
  const newMatch = {match1:match1, match2:match2, status:status};

  setCurrentMatches(prev => [...prev, {...newMatch, id:prev.length+1,}])
}
const matchesAdditionHandler = (newMatchesData)=>{
  const updatedMatches = newMatchesData.map((newMatchData, index)=>{
  const {match1, match2, status} = newMatchData;
  /* MATCHDATA */
  const newMatchID = index
  const newMatch = {id:newMatchID, match1:match1, match2:match2, status:status};
  return newMatch
  })
  console.log("UPDATED MATCHES:  ", updatedMatches)
  setCurrentMatches(updatedMatches)
}

const deleteMatch = (matchID)=>{
  let updatedMatches = currentMatches.filter((removedMatch)=>{
    return (matchID!==removedMatch.id)});
    setCurrentMatches(updatedMatches)
}
/* -----------MATCHES------------ */
/* -----------ROUNDS------------ */
const addRound = ()=>{
  const updatedRoundCount = roundCount+1;
  setRoundCount(updatedRoundCount)
}
const resetRoundCount = ()=>{
  const updatedRoundCount = 0;
  setRoundCount(updatedRoundCount)
}
/* -----------ROUNDS------------ */
/* --------------------HANDLERS------------- */
  return (
    <div className="App">
      <div className="apphead-container">
        <Header minimumDateAmount={minumumDateAmount} minimumDateAmountChangeHandler={minimumDateAmountChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}  sessionLength={sessionLength} podCount={pods?.length} userCount={users?.length} matchCount={matchCount}/>
      </div>
    <Tabs
      defaultActiveKey="matchmaker"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      {/* <Tab eventKey="dashboard" title="Dashboard">
        <Dashboard users={users} matchQueue={matchQueue} pods={pods} availablePods={availablePods} />
      </Tab> */}
      <Tab eventKey="matchmaker" title="Matchmaker">
        <Matchmaker
          simIsComplete={simIsComplete}
          simIsRunning={simIsRunning}
          simulationStartHandler={simulationStartHandler}
          dateDuration={dateDuration}
          bufferDuration={bufferDuration}
          matchQueue={matchQueue}
          podCount={pods?.length}
          usersInSession={usersInSession}
          updateInSessionLists={updateInSessionLists}
          podsInSession={podsInSession} completeDate={dateCompletionHandler}
          // cancelMatch={matchCancellationHandler}
          IDGenerator={IDGenerator} dateCompletionHandler={dateCompletionHandler}
          countMatches={matchCountChangeHandler}
          heteroSexualMaleMatchList={heteroSexualMaleMatchList}
          homoSexualMaleMatchList={homoSexualMaleMatchList}
          biSexualMaleMatchList={biSexualMaleMatchList}
          heteroSexualFemaleMatchList={heteroSexualFemaleMatchList}
          homoSexualFemaleMatchList={homoSexualFemaleMatchList}
          biSexualFemaleMatchList={biSexualFemaleMatchList}
          nonBinarySeekingMalesMatchList={nonBinarySeekingMalesMatchList}
          nonBinarySeekingFemalesMatchList={nonBinarySeekingFemalesMatchList}
          biSexualNonBinaryMatchList={biSexualNonBinaryMatchList}
          currentMatches={currentMatches}
          addMatch={matchAdditionHandler}
          addMatches={matchesAdditionHandler}
          deleteMatch={deleteMatch}
          completedDateQueue={completedDateQueue}
          datesCompletionHandler={datesCompletionHandler}
          addToDateCompletionQueue={addToDateCompletionQueue}
          roundCount={roundCount}
          addRound={addRound}
        />
      </Tab>
      {/* <Tab eventKey="userlist" title="User List" >
        <UserInfo users={matchQueue} pods={pods} matches={matches} addPods={podAdditionHandler} removePods={podDeletionHandler} updateUsers={(updatedUsers)=>{setUsers(updatedUsers)}} addUser={addUser} addUsers={addUsers} clearUsers={clearUsersHandler} removeUser={userRemovalHandler} updateUser={userUpdateHandler} />
      </Tab> */}
    </Tabs>
    </div>
  );
}

export default App;