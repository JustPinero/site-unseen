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
const USERNUMBER = 280;
const PODNUMBER = 84;
const EVENTDURATION = 10800
const BUFFERDURATION = 60;
const DATEDURATION = 660;
const MINIMUMDATENUMBER = 6;

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
    const pod = {id: i+1, isOccupied:false, occupantID:null, occupantData: null}
    podData.push(pod)
  }
  return podData
}



const App = ()=> {
  /*--------LOCAL STATE---------- */
  /* Session Time */
  const [sessionLength, setSessionLength]= useState(EVENTDURATION);
  /* DATES */
  const [bufferDuration, setBufferDuration]= useState(BUFFERDURATION);
  const [dateDuration, setDateDuration]= useState(DATEDURATION);
  /* USERS */
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersInSession, setUsersInSession] = useState([]);
  /* PODS */
  const [podCount, setPodCount] = useState(PODNUMBER)
  const [pods, setPods] = useState([]);
  const [availablePods, setAvailablePods] = useState([]);
  const [podsInSession, setPodsInSession] = useState([]);
  /* MATCHES */
  const [matches, setMatches] =useState([])
  const [matchCount, setMatchCount] = useState([]);
   /* ALERTS */
   //PODS
   const [allPodsAreFull, setallPodsAreFull] = useState(false);
   //DATES
  const [hasUnderThanMinimumPotentialDates, setHasUnderThanMinimumPotentialDates] = useState(false);
  const [usersWithTooFewDates, setUsersWithTooFewDates] = useState([]);
  /* ----------LOCAL STATE------------- */
  /* ---------------STATE DEPENDANT VARIABLES FORMATTED DATA AND METRICS-------------------------- */
  /* DATE DURATION */
  const dateLength = bufferDuration + dateDuration;

//   /* ---------------STATE DEPENDANT FORMATTED DATA AND METRICS-------------------------- */
//   /* ---------------LIFECYCLE-------------------------- */
  useEffect(()=>{
    let initialUsers = userGenerationHelper(USERNUMBER);
    if(initialUsers){
    initialUsers = initialUsers.map((user)=>({...user, id:users.length+user.id}))
    const initialPods = podDummyDataGenerator(podCount);
    const formattedUpdatedUserData = initialUsers.map(userData =>{
      const {gender, sexual_pref} = userData
      function generateClosestPods(){
        let closestPodList = [];
        for(let i =0; i<= 83 ; i++){
          let newPodID = getRandomInt(0, 84 );
          closestPodList.push(newPodID);
        }
        return closestPodList;
      }
      const updatedPodList = generateClosestPods();
      let potentialMatches =  [];

      const formattedUserData = {...userData, isInDate:false, dateCount:0, hasHadDatesWith:[], closestPods: updatedPodList, potentialMatches: potentialMatches, status: "available"};
      return formattedUserData;
    })
    setUsers(formattedUpdatedUserData);
    setPods(initialPods);
  }
  },[]);
  const MatchingUsers =
  useEffect(()=>{
  let updatedAvailableUsers = users.filter(user=> user.isInDate === false);
  let notEnoughDatesList =[];
  //GENDER
  //MALE
  const maleUsers = users?.filter(user=>user.gender==="male");
  const maleUserCount = maleUsers.length;
  //SEXUAL PREFERENCES
  const heteroSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="female");
  const heteroSexualMaleUserCount = heteroSexualMaleUsers.length;
  const homoSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="male");
  const homoSexualMaleUserCount = homoSexualMaleUsers.length;
  const biSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="bisexual");
  const biSexualMaleUserCount = biSexualMaleUsers.length;
  //FEMALE
  const femaleUsers = users?.filter(user=>user.gender==="female");
  const femaleUserCount = femaleUsers.length;
  //SEXUAL PREFERENCES
  const heteroSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="male");
  const heteroSexualFemaleUserCount = heteroSexualfemaleUsers.length;
  const homoSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="female");
  const homoSexualFemaleUserCount = homoSexualfemaleUsers.length;
  const biSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="bisexual");
  const biSexualFemaleUserCount = biSexualfemaleUsers.length;
  //NON-BINARY
  const nonBinaryUsers = users?.filter(user=>user.gender==="non-binary");
  const nonBinaryUserCount = nonBinaryUsers.length;
  const nonBinaryUsersSeekingMale = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="male");
  const nonBinaryUsersSeekingMaleCount = nonBinaryUsersSeekingMale.length;
  const nonBinaryUsersSeekingFemale = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="female");
  const nonBinaryUsersSeekingFemaleCount = nonBinaryUsersSeekingFemale.length;
  const nonBinaryBisexualUsers = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="bisexual");
  const nonBinaryBisexualUsersCount = nonBinaryBisexualUsers.length;

  let prospectsKey =  {
    male:{
      male: [...homoSexualMaleUsers, ...biSexualMaleUsers],
      female: [...heteroSexualfemaleUsers, ...biSexualfemaleUsers],
      bisexual: [...homoSexualMaleUsers, ...biSexualMaleUsers, ...heteroSexualfemaleUsers, ...biSexualfemaleUsers, ...nonBinaryBisexualUsers]
    },
    female:{
      male: [...heteroSexualMaleUsers, ...biSexualMaleUsers],
      female: [...homoSexualfemaleUsers, ...biSexualfemaleUsers],
      bisexual: [...homoSexualfemaleUsers, ...biSexualfemaleUsers, ...heteroSexualMaleUsers, ...biSexualMaleUsers, ...nonBinaryBisexualUsers]
    },
    nonbinary: {
      male: [...biSexualMaleUsers, ...nonBinaryBisexualUsers],
      female: [...biSexualfemaleUsers, ...nonBinaryBisexualUsers],
      bisexual: [...biSexualMaleUsers, ...biSexualfemaleUsers, ...nonBinaryBisexualUsers]
    }
  }
  updatedAvailableUsers = updatedAvailableUsers.map((userData)=>{
    let potentialMatches =  [];
    const {gender, sexual_pref} = userData;
      switch(gender){
        case "male":
          potentialMatches= prospectsKey.male[sexual_pref];
          break;
        case "female":
          potentialMatches= prospectsKey.female[sexual_pref];
          break;
        case "non-binary":
          potentialMatches= prospectsKey.nonbinary[sexual_pref];
          break;
        default:
          break;
      };
      let possibleDateCount = potentialMatches.length;
      if(possibleDateCount<MINIMUMDATENUMBER){
        notEnoughDatesList.push(userData);
      }
      potentialMatches = potentialMatches.filter(match=>match.id!==userData.id)
      const formattedUserData = {...userData, isInDate:false, dateCount:0, hasHadDatesWith:[], potentialMatches: potentialMatches, status: "available"};
      return formattedUserData;
    })
    if(notEnoughDatesList.length){
      setUsersWithTooFewDates(notEnoughDatesList)
      setHasUnderThanMinimumPotentialDates(true)
    }else{
      setHasUnderThanMinimumPotentialDates(false)
    }
    setAvailableUsers(updatedAvailableUsers);
  },[users]);

  useEffect(()=>{
    const updatedAvailablePods = pods.filter(pod=> pod.isOccupied === false);
    setAvailablePods(updatedAvailablePods);
  },[pods]);
// /* ---------------LIFECYCLE-------------------------- */
// /* --------------------HANDLERS------------- */
// /* ----------USERS------------- */

const clearUsersHandler = ()=>{
  setUsers([]);
  setMatches([]);
}
// /* ----------USERS------------- */

// /* ----------PODS------------- */
// /* ----------MATCH------------- */


  const matchCancellationHandler = (matchID)=>{
    let updatedMatches = matches.filter((match)=>{
    if(matchID==match.id){
      const {pod1, pod2} = match;
      const user1 = pod1?.occupantData;
      const user2 = pod2?.occupantData;
      const updatedPods = pods.map(pod=>{
        if(pod1 && (pod.id ===pod1.id)){
          const updatedPod1 = {...pod1, isOccupied:false, occupantID:null, occupantData: null}
          return updatedPod1;
        }else
        if(pod2 && (pod.id ===pod2.id)){
          const updatedPod2 = {...pod2, isOccupied:false, occupantID:null, occupantData: null}
          return updatedPod2;
        }else{
        return pod
        }
      })
    const updatedUsers = users.map((user)=>{
      if(user1 && (user.id === user1.id)){
        const updatedUser1 = {...user1, isInDate:false}
        return updatedUser1;
      }else
      if(user2 && (user.id === user2.id)){
        const updatedUser2 = {...user2, isInDate:false}
        return updatedUser2;
      }else {
      return user
      }
    })
    setUsers(updatedUsers)
    setPods(updatedPods)
    }
  })
    setMatches(updatedMatches);
  }
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
    let updatedUserUpdateList = userUpdatelist;
    const updatedUsers = users.map(user=>{
      for(let i= 0; i<updatedUserUpdateList.length; i++){
        let updatedUserData = updatedUserUpdateList[i];
        if(user.id===updatedUserData.id){
          let updatedListHead = updatedUserUpdateList.slice(0, i);
          updatedListHead = updatedListHead.length ? updatedListHead: [];
          let updatedUserListTail = updatedUserUpdateList.slice(i+1);
          updatedUserListTail = updatedUserListTail.length ? updatedUserListTail: [];
          updatedUserUpdateList = [...updatedListHead, ...updatedUserListTail];
          return updatedUserData;
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
    const updatedUser1 = {...user1, isInDate:false, dateCount: user1.dateCount +1, hasHadDatesWith:[...user1.hasHadDatesWith, user2]}
    const updatedUser2 = {...user2, isInDate:false, dateCount: user2.dateCount +1, hasHadDatesWith:[...user2.hasHadDatesWith, user1]}
    usersUpdateHandler([updatedUser1, updatedUser2])
    podsUpdateHandler([updatedPod1, updatedPod2])
  };
/* -----------DATES------------ */
const updateInSessionLists = (busyUsers, usedPods)=>{
  const updatedUsersInSession = [...usersInSession, ...busyUsers];
  const updatedPodsInSession = [...podsInSession, ...usedPods];
  setUsersInSession(updatedUsersInSession)
  setPodsInSession(updatedPodsInSession)
}
/* --------------------HANDLERS------------- */
  return (
    <div className="App">
      <div className="apphead-container">
        <Header sessionLength={sessionLength} podCount={pods?.length} userCount={users?.length} matchCount={matchCount}/>
        <EventWarning affectedUsers={usersWithTooFewDates}/>
      </div>
    <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="dashboard" title="Dashboard">
        <Dashboard users={users} availableUsers={availableUsers} pods={pods} availablePods={availablePods} />
      </Tab>
      <Tab eventKey="matchmaker" title="Matchmaker">
        <Matchmaker dateLength={dateLength} availableUsers={availableUsers} podCount={pods?.length} addPods={podAdditionHandler} removePods={podDeletionHandler} usersInSession={usersInSession} updateInSessionLists={updateInSessionLists} podsInSession={podsInSession} completeDate={dateCompletionHandler} cancelMatch={matchCancellationHandler} IDGenerator={IDGenerator} dateCompletionHandler={dateCompletionHandler} countMatches={matchCountChangeHandler}/>
      </Tab>
      <Tab eventKey="userlist" title="User List" >
        <UserInfo users={availableUsers} pods={pods} matches={matches} addPods={podAdditionHandler} removePods={podDeletionHandler} updateUsers={(updatedUsers)=>{setUsers(updatedUsers)}} addUser={addUser} addUsers={addUsers} clearUsers={clearUsersHandler} removeUser={userRemovalHandler} updateUser={userUpdateHandler} />
      </Tab>
    </Tabs>
    </div>
  );
}

export default App;