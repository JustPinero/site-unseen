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
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [pods, setPods] = useState([]);
  const [availablePods, setAvailablePods] = useState([]);
  const [matches, setMatches] = useState([]);
  useEffect(()=>{
    const updatedUserData = DUMMYUSERS
    const POD_DUMMY_DATA = podDummyDataGenerator(70)
    const formattedUpdatedUserData = updatedUserData.map(userData =>{
      function generateClosestPods(){
        let closestPodList = [];
        for(let i =0; i<= 69 ; i++){
          let newPodID = getRandomInt(0, 70 )
          closestPodList.push(newPodID)
        }
        return closestPodList
      }
      const updatedPodList = generateClosestPods()
      const formattedUserData = {...userData, isInDate:false, dateCount:0, hasHadDatesWith:[], closestPods: updatedPodList}
      return formattedUserData
    })
    setUsers(formattedUpdatedUserData);
    setPods(POD_DUMMY_DATA);
// });
  },[])

  useEffect(()=>{
    const updatedAvailableUsers = users.filter(pod=> pod.isInDate === false);
    setAvailableUsers(updatedAvailableUsers);
  },[users])

  useEffect(()=>{
    const updatedAvailablePods = pods.filter(pod=> pod.isOccupied === false);
    setAvailablePods(updatedAvailablePods);
  },[pods])


  /* HANDLERS */
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
  const addUser = (newUserData)=>{
    const updatedUsers = [...users, newUserData]
    setUsers(updatedUsers)
  }

  const addUsers = (newUsersData)=>{
    const updatedUsers = [...users, ...newUsersData]
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
/* PODS */
  const podsUpdateHandler = (id, podUpdate)=>{
    const updatedPods = pods.map(pod=>{
      if(pod.id===id){
        return podUpdate
      }
        return pod
    })
    setPods(updatedPods)
  }

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
  }
  };

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
        <Matchmaker users={availableUsers} pods={availablePods}  matches={matches} addMatch={matchAdditionHandler} removeMatch={matchRemovalHandler} updateMatch={matchUpdateHandler} updatePods={podsUpdateHandler} updateUsers={usersUpdateHandler} completeDate={dateCompletionHandler} cancelMatch={matchCancellationHandler}/>
      </Tab>
      <Tab eventKey="userlist" title="User List" >
        <UserInfo users={users} pods={pods} matches={matches} updateUsers={(updatedUsers)=>{setUsers(updatedUsers)}} addUser={addUser} addUsers={addUsers} />
      </Tab>
    </Tabs>
    </div>
  );
}

export default App;
