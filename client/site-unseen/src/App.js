/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
/* API */
import fetchUsers from "./api";
/* BOOTSTRAP COMPONENTS */
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
/* COMPONENTS */
import Dashboard from "./pages/Dashboard";
import Matchmaker from "./pages/Matchmaker";
import UserInfo from "./pages/UserInfo";
/* DUMMY DATA */
import DUMMYUSERS from "./dummydata/users.json";
/* DEFAULT VALUES */
const USERNUMBER = 280;
const PODNUMBER = 84;
const BUFFERDURATION = 60;
const DATEDURATION = 660;
const MINIMUMDATENUMBER = 6;
/* HELPERS */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function IDGenerator(dataList){
  let newID = 0;
  dataList.forEach((data)=>{
    const {id} = data
    if(id>=newID){
      newID= id;
    }
  })
  newID = newID+1 ;
  return newID
}

const podDummyDataGenerator = (numberOfPods)=>{
  let podData = [];
  for(let i=0; i<numberOfPods ;i++){
    const pod = {id: i+1, isOccupied:false, occupantID:null, occupantData: null, remainingTime:null}
    podData.push(pod)
  }
  return podData
}



const App = ()=> {
  /*--------LOCAL STATE---------- */
  /* Session Time */
  const [sessionLength, setSessionLength]= useState(1);
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
  const [matches, setMatches] = useState([]);
   /* ALERTS */
   //PODS
   const [allPodsAreFull, setallPodsAreFull] = useState(false);
   //DATES
  const [hasUnderThanMinimumPotentialDates, setHasUnderThanMinimumPotentialDates] = useState(false);
  const [usersWithTooFewDates, setUsersWithTooFewDates] = useState([]);
  /* ----------LOCAL STATE------------- */
  /* ---------------STATE DEPENDANT FORMATTED DATA AND METRICS-------------------------- */
  /* DATE DURATION */
  const dateLength = bufferDuration + dateDuration;
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
  };
  /* ---------------STATE DEPENDANT FORMATTED DATA AND METRICS-------------------------- */
  /* ---------------LIFECYCLE-------------------------- */
  useEffect(()=>{
    const updatedUserData = DUMMYUSERS
    const POD_DUMMY_DATA = podDummyDataGenerator(podCount)
    let notEnoughDatesList =[];
    const formattedUpdatedUserData = updatedUserData.map(userData =>{
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
      let potentialMatches =  []
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
      const formattedUserData = {...userData, isInDate:false, dateCount:0, hasHadDatesWith:[], closestPods: updatedPodList, possibleDates: potentialMatches};
      return formattedUserData;
    })
    if(notEnoughDatesList.length){
      setUsersWithTooFewDates(notEnoughDatesList)
      setHasUnderThanMinimumPotentialDates(true)
    }else{
      setHasUnderThanMinimumPotentialDates(false)
    }
    setUsers(formattedUpdatedUserData);
    setPods(POD_DUMMY_DATA);
  },[]);

  useEffect(()=>{
    const updatedAvailableUsers = users.filter(user=> user.isInDate === false);
    setAvailableUsers(updatedAvailableUsers);
  },[users]);

  useEffect(()=>{
    const updatedAvailablePods = pods.filter(pod=> pod.isOccupied === false);
    setAvailablePods(updatedAvailablePods);
  },[pods]);
/* ---------------LIFECYCLE-------------------------- */
/* --------------------HANDLERS------------- */
/* ----------USERS------------- */
const userMatchHandler = (userGender, userPreference, userDateHistory)=>{
  let matchOptions = [];
  switch(userGender){
    case "male":
      if(userPreference==="male"){
        matchOptions = [...homoSexualMaleUsers, ...biSexualMaleUsers];
      }else if(userPreference==="female"){
        matchOptions = [...heteroSexualfemaleUsers, ...biSexualfemaleUsers, ];
      } else{
        matchOptions = [...nonBinaryUsers, ...homoSexualMaleUsers, ...heteroSexualfemaleUsers];
      }
    case "female":
      if(userPreference==="male"){
        matchOptions = [...heteroSexualMaleUsers, ...biSexualMaleUsers];
      }else if(userPreference==="female"){
        matchOptions = [...homoSexualfemaleUsers, ...biSexualfemaleUsers, ];
      } else{
        matchOptions = [...nonBinaryUsers, ...homoSexualMaleUsers, ...heteroSexualfemaleUsers];
      }
    case "non-binary":
      if(userPreference==="male"){
        matchOptions = [...biSexualMaleUsers];
      }else if(userPreference==="female"){
        matchOptions = [...biSexualfemaleUsers, ];
      } else{
        matchOptions = [...nonBinaryUsers];
      }
  }
  let filteredMatchOptions = matchOptions.filter((matchOption)=> (userDateHistory.indexOf(matchOption.id)<0));
  console.log("FILTERED OPTIONS:  ", filteredMatchOptions)
  return filteredMatchOptions;
};

const clearUsersHandler = ()=>{
  setUsers([]);
  setMatches([]);
}
/* ----------USERS------------- */
/* ----------PODS------------- */
const availablePodSearchHandler = (userData)=>{
  const {closestPods} = userData;
  for(let i=0; i<closestPods; i++){
    let closestPod = closestPods[i];
    if((podsInSession.length ===0) || (podsInSession.indexOf(closestPod)<0)){
        return closestPod;
    }
  }
}
/* ----------PODS------------- */
/* ----------MATCH------------- */
  const matchAdditionHandler = (match1, match2)=>{
    /* MATCHDATA */
    const newMatchID = IDGenerator(matches);
    const newMatch = {id:newMatchID, match1:match1, match2:match2};
    let updatedMatches = [...matches, newMatch];
    /* USER UPDATE*/
    const user1Update = match1.user;
    const user2Update = match2.user;
    usersUpdateHandler([user1Update, user2Update])
    /* POD UPDATE 2 */
    const pod1Update = match1.Pod;
    const pod2Update = match2.Pod;
    podsUpdateHandler([pod1Update, pod1Update])
    setMatches(updatedMatches)
  }

  const matchRemovalHandler = (matchID)=>{
    let updatedMatches = matches.filter((match)=>(match.id !== matchID))
    setMatches(updatedMatches)
  }

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


  const matchUpdateHandler = (matchID, matchUpdate)=>{
    let updatedMatches = matches.map((match)=> {
      if(match.id === matchID){
        return matchUpdate;
      }else{
        return match;
      }
    });
    setMatches(updatedMatches)
  }
/* ----------MATCH------------- */
/* -------USERS---------- */
//ADD USER
  const addUser = (newUserData)=>{
    const updatedUsers = [...users, newUserData]
    setUsers(updatedUsers)
  }
//ADD USERS
  const addUsers = (newUsersData)=>{
    const updatedUsers = [...users, ...newUsersData]
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
      for(let i= 0; i<=updatedUserUpdateList.length; i++){
        let updatedUserData = updatedUserUpdateList[i];
        const {id, userData} = updatedUserData;
        if(user.id===id){
          let updatedListHead = updatedUserUpdateList.slice(0, i);
          updatedListHead = updatedListHead.length ? updatedListHead: [];
          let updatedUserListTail = updatedUserUpdateList.slice(i+1);
          updatedUserListTail = updatedUserListTail.length ? updatedUserListTail: [];
          updatedUserUpdateList = [...updatedListHead, ...updatedUserListTail];
          return userData;
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
/* -----------USERS------------ */
/* ----------PODS------------- */
//ADD POD
const podAdditionHandler = (podCount)=>{
  let updatedPods = [...pods]
  for(let i= pods.length ; i < (pods.length + podCount) ; i++){
    const pod = {id: i+1, isOccupied:false, occupantID:null, occupantData: null, remainingTime:null};
    updatedPods.push(pod)
  }
  setPods(updatedPods)
}
//UPDATE POD
const podUpdateHandler = (id, podUpdate)=>{
  const updatedPods = pods.map(pod=>{
    if(pod.id===id){
      return podUpdate
    }
      return pod
  })
  setPods(updatedPods)
}
//UPDATE PODS
const podsUpdateHandler = (podUpdatelist)=>{
  let updatedPodUpdateList = podUpdatelist;
  const updatedPods = pods.map(pod=>{
    for(let i= 0; i<=updatedPodUpdateList.length; i++){
      let updatedPodData = updatedPodUpdateList[i];
      const {id, podData} = updatedPodData;
      if(pod.id===id){
        let updatedListHead = updatedPodUpdateList.slice(0, i);
        updatedListHead = updatedListHead.length ? updatedListHead: [];
        let updatedPodListTail = updatedPodUpdateList.slice(i+1);
        updatedPodListTail = updatedPodListTail.length ? updatedPodListTail: [];
        updatedPodUpdateList = [...updatedListHead, ...updatedPodListTail];
        return podData;
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
/* ----------PODS------------- */
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
    const updatedUser1 = {...user1, isInDate:false, dateCount: user1.dateCount +1, hasHadDatesWith:[...user1.hasHadDatesWith, user2.id]}
    const updatedUser2 = {...user2, isInDate:false, dateCount: user2.dateCount +1, hasHadDatesWith:[...user2.hasHadDatesWith, user1.id]}
    usersUpdateHandler([updatedUser1, updatedUser2])
    podsUpdateHandler([updatedPod1, updatedPod2])
  };
/* -----------DATES------------ */
/* --------------------HANDLERS------------- */
  return (
    <div className="App">
      <div>
        <h1 className ="header-text">
          Site Unseen
        </h1>
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
        <Matchmaker dateLength={dateLength} users={availableUsers} pods={availablePods}  matches={matches} addMatch={matchAdditionHandler} removeMatch={matchRemovalHandler} updateMatch={matchUpdateHandler} updatePod={podUpdateHandler} updatePods={podsUpdateHandler} updateUser={userUpdateHandler} updateUsers={usersUpdateHandler} completeDate={dateCompletionHandler} cancelMatch={matchCancellationHandler}/>
      </Tab>
      <Tab eventKey="userlist" title="User List" >
        <UserInfo users={users} pods={pods} matches={matches} addPods={podAdditionHandler} removePods={podDeletionHandler} updateUsers={(updatedUsers)=>{setUsers(updatedUsers)}} addUser={addUser} addUsers={addUsers} clearUsers={clearUsersHandler} removeUser={userRemovalHandler} updateUser={userUpdateHandler} />
      </Tab>
    </Tabs>
    </div>
  );
}

export default App;