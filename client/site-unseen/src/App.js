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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const podDummyDataGenerator = (numberOfPods)=>{
  let podData = [];
  for(let i=0; i<numberOfPods ;i++){
    const pod = {id: i+1, isOccupied:false, occupantID:null, occupantData: null, remainingTime:null}
    podData.push(pod)
  }
  return podData
}


function App() {
  /*--------LOCAL STATE---------- */
  /* Session Time */
  const [sessionLength, setSessionLength]= useState(1);
  /* Date length */
  const [dateLength, setDateLength]= useState(1);
  /* USERS */
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  /* PODS */
  const [pods, setPods] = useState([]);
  const [availablePods, setAvailablePods] = useState([]);
  /* MATCHES */
  const [matches, setMatches] = useState([]);
/* METRICS */


  useEffect(()=>{
    const updatedUserData = DUMMYUSERS
    const POD_DUMMY_DATA = podDummyDataGenerator(84)
    const formattedUpdatedUserData = updatedUserData.map(userData =>{
      function generateClosestPods(){
        let closestPodList = [];
        for(let i =0; i<= 83 ; i++){
          let newPodID = getRandomInt(0, 84 );
          closestPodList.push(newPodID);
        }
        return closestPodList;
      }
      const updatedPodList = generateClosestPods();
      const formattedUserData = {...userData, isInDate:false, dateCount:0, hasHadDatesWith:[], closestPods: updatedPodList};
      return formattedUserData;
    })
    setUsers(formattedUpdatedUserData);
    setPods(POD_DUMMY_DATA);
// });
  },[])

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
  const heteroSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="male")
  const heteroSexualFemaleUserCount = heteroSexualfemaleUsers.length;
  const homoSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="female")
  const homoSexualFemaleUserCount = homoSexualfemaleUsers.length;
  const biSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="bisexual")
  const biSexualFemaleUserCount = biSexualfemaleUsers.length;
  //NON-BINARY
  const nonBinaryUsers = users?.filter(user=>user.gender==="non-binary");
  const nonBinaryUserCount = nonBinaryUsers.length;
  const nonBinaryUsersSeekingMale = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="male")
  const nonBinaryUsersSeekingMaleCount = nonBinaryUsersSeekingMale.length;
  const nonBinaryUsersSeekingFemale = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="female")
  const nonBinaryUsersSeekingFemaleCount = nonBinaryUsersSeekingFemale.length;
  const nonBinaryBisexualUsers = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="bisexual")
  const nonBinaryBisexualUsersCount = nonBinaryBisexualUsers.length;

  useEffect(()=>{
    const updatedAvailableUsers = users.filter(pod=> pod.isInDate === false);
    setAvailableUsers(updatedAvailableUsers);
  },[users])

  useEffect(()=>{
    const updatedAvailablePods = pods.filter(pod=> pod.isOccupied === false);
    setAvailablePods(updatedAvailablePods);
  },[pods])

/* HELPERS */
// USERS
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
//PODS
const checkPodAvailability = (closestPods)=>{

  for(let i=0; i<closestPods; i++){
    if(availablePods[i]){
      
    }
  }
}


const podMatchHandler = (userData)=>{
  const {closestPods} = userData;
  let closestPod
  for(let j=0; j<closestPods; j++){
    if(availablePods[j]){
  }
}
}

  /* HANDLERS */
  const quickMatchHandler = (userData)=> {

  }

  const matchAdditionHandler = ()=>{
    const newMatchID = matches.length+1;
    const newMatch = {id:newMatchID, pod1:null, pod2:null};
    let updatedMatches = [...matches, newMatch];
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
/* USERS */
//CREATE
  const addUser = (newUserData)=>{
    const updatedUsers = [...users, newUserData]
    setUsers(updatedUsers)
  }

  const addUsers = (newUsersData)=>{
    const updatedUsers = [...users, ...newUsersData]
    setUsers(updatedUsers)
  }
//UPDATE
const userUpdateHandler = (userID, userUpdate)=>{
  const updatedUsers = users.map(user=>{
    if(user.id===userID){
      return userUpdate
    }
      return user
  })
  setUsers(updatedUsers)
}
  const usersUpdateHandler = (userID, userUpdate)=>{
    const updatedUsers = users.map(user=>{
      if(user.id===userID){
        return userUpdate
      }
        return user
    })
    setUsers(updatedUsers)
  }
//DELETE
const userRemovalHandler = (userID)=>{
  const updatedUsers = users.filter(user=>(user.id!==userID))
  setUsers(updatedUsers)
}
/* PODS */
//UPDATE
  const podsUpdateHandler = (id, podUpdate)=>{
    const updatedPods = pods.map(pod=>{
      if(pod.id===id){
        return podUpdate
      }
        return pod
    })
    setPods(updatedPods)
  }
/* DATES */
  const dateCompletionHandler = (match)=>{
    const {pod1, pod2} = match;
  if(pod1 && pod2){
    const user1 = pod1.occupantData;
    const user2 = pod2.occupantData;
    const updatedPods = pods.map(pod=>{
      if(pod.id ===pod1.id){
        const updatedPod1 = {...pod1, isOccupied:false, occupantID:null, occupantData: null}
        return updatedPod1;
      }else
      if(pod.id ===pod2.id){
        const updatedPod2 = {...pod2, isOccupied:false, occupantID:null, occupantData: null}
        return updatedPod2;
      }else{
      return pod
      }
    })

    const updatedUsers = users.map((user)=>{
      if(user.id === user1.id){
        const updatedUser1 = {...user1, isInDate:false, dateCount: user1.dateCount +1, hasHadDatesWith:[...user1.hasHadDatesWith, user2.id]}
        return updatedUser1;
      }else
      if(user.id === user2.id){
        const updatedUser2 = {...user2, isInDate:false, dateCount: user2.dateCount +1, hasHadDatesWith:[...user2.hasHadDatesWith, user1.id]}
        return updatedUser2;
      }else {
      return user
      }
    })
    setUsers(updatedUsers)
    setPods(updatedPods)
  };
}

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
        <Matchmaker dateLength={dateLength} users={availableUsers} pods={availablePods}  matches={matches} addMatch={matchAdditionHandler} removeMatch={matchRemovalHandler} updateMatch={matchUpdateHandler} updatePods={podsUpdateHandler} updateUsers={userUpdateHandler} completeDate={dateCompletionHandler} cancelMatch={matchCancellationHandler}/>
      </Tab>
      <Tab eventKey="userlist" title="User List" >
        <UserInfo users={users} pods={pods} matches={matches} updateUsers={(updatedUsers)=>{setUsers(updatedUsers)}} addUser={addUser} addUsers={addUsers} clearUsers={clearUsersHandler} removeUser={userRemovalHandler} updateUser={userUpdateHandler} />
      </Tab>
    </Tabs>
    </div>
  );
}

export default App;
