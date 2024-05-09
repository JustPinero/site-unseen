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

/* API */
import {fetchUsers, fetchUserCount, fetchUserDateCountAverage, fetchFinishedUsers, deleteUser} from "./api/users";
import {fetchPods,fetchPodsCount, addPods } from "./api/pods.js";
import { fetchMatches, fetchMatchCount } from "./api/matches.js";

/* DEFAULT VALUES */
const USERNUMBER = 0;
const PODNUMBER = 0;
const EVENTDURATION = 10800
const BUFFERDURATION = 10;
const DATEDURATION = 10;
const DEFAULTDATECAP = 3


const App = ()=> {
  /*--------LOCAL STATE---------- */
  /*LOADING */
  const [isLoading, setIsLoading] = useState(false)
  /* SIMULATION */
  const [simIsRunning, setSimIsRunning] = useState(false);
  const [simIsPaused, setSimIsPaused] = useState(false);
  const [simIsComplete, setSimIsComplete] = useState(false);
  /* Session Time */
  const [sessionLength, setSessionLength]= useState(EVENTDURATION);
  /* DATES */
  const [bufferDuration, setBufferDuration]= useState(BUFFERDURATION);
  const [dateDuration, setDateDuration]= useState(DATEDURATION);
  const [dateCap, setDateCap] = useState(DEFAULTDATECAP)
  /* USERS */
  const [users, setUsers] = useState([]);
  const [availableUsersCount, setAvailableUsersCount] = useState(0)
  const [waitingUsersCount, setWaitingUsersCount] = useState(0)
  const [totalUsersCount, setTotalUsersCount] = useState(0)
  const [finishedUsersCount, setFinishedUsersCount] = useState(0)
  const [userDateCountAverage, setUserDateCountAverage] = useState(0)
  /* PODS */
  const [totalPodCount, setTotalPodCount] = useState(PODNUMBER)
  const [availablePodCount, setAvailablePodCount] = useState(PODNUMBER)
  const [occupiedPodCount, setOccupiedPodCount] = useState(0)
  /* MATCHES */
  const [matchCount, setMatchCount] = useState(0);
  
  /* ----------LOCAL STATE------------- */

  /* ---------------STATE DEPENDANT VARIABLES FORMATTED DATA AND METRICS-------------------------- */
//   /* ---------------STATE DEPENDANT FORMATTED DATA AND METRICS-------------------------- */
//   /* ---------------LIFECYCLE-------------------------- */
/* --------INIT-------- */
useEffect(()=>{
  async function startFetching() {
    try{
    setIsLoading(true)
    const userResults = await fetchUsers();
    const finishedUserResults = await fetchFinishedUsers(dateCap);
    const podCountResults = await fetchPodsCount();
    const usersCountResults = await fetchUserCount();
    const updatedAvailableUsersCountData = usersCountResults.data.available[0].available_user_count;
    const updatedWaitingUsersCountData = usersCountResults.data.waiting[0].waiting_user_count;
    const updatedTotalUsersCountData = usersCountResults.data.total[0].total_count;
    const updatedOccupiedPodCountData = podCountResults.data.occupiedPodCount[0].occupied_pod_count;
    const updatedAvailablePodCountData = podCountResults.data.availablePodCount[0].available_pod_count;
    const updatedTotalPodCountData = podCountResults.data.totalPodCount[0].total_pod_count;
    const matchResults = await fetchMatches();
    const userDateCountAverageResults = await fetchUserDateCountAverage();
    setIsLoading(false)
    console.log("usersCountResults:  ", usersCountResults)
    console.log("occupiedPodCount:  ",  podCountResults.data.occupiedPodCount[0]);
    console.log("availablePodCount:  ",  podCountResults.data.availablePodCount[0]);
    console.log("totalPodCount:  ",  podCountResults.data.totalPodCount[0]);
    if (!isLoading) {
      const updatedAvailableUsersCount = parseInt(updatedAvailableUsersCountData);
      const updatedWaitingUsersCount = parseInt(updatedWaitingUsersCountData);
      const updatedTotalUsersCount = parseInt(updatedTotalUsersCountData);
      setAvailableUsersCount(updatedAvailableUsersCount)
      setWaitingUsersCount(updatedWaitingUsersCount);
      setTotalUsersCount(updatedTotalUsersCount);
      setUsers(userResults.data);
      setTotalPodCount(updatedTotalPodCountData)
      setMatchCount(matchResults.data.length)
      setFinishedUsersCount(finishedUserResults.data.length)
      setUserDateCountAverage(userDateCountAverageResults.data[0].average_matches)
    }
  }
  catch(err){
    console.log("INITIAL LOAD FAILED:  ", err)
  }
}
  startFetching();
},[])

  /* --------INIT-------- */

/* ---------------LIFECYCLE-------------------------- */
/* --------------------HANDLERS------------- */
/* ----------SIMULATION------------- */
const simulationStartHandler = ()=>{
  setSimIsRunning(true)
  setSimIsPaused(false)
  setSimIsComplete(false)
}
const simulationPauseHandler = ()=>{
  setSimIsRunning(false)
  setSimIsPaused(true)
}
const simulationCancellationHandler = ()=>{
  setSimIsRunning(false)
  setSimIsPaused(false)
  setSimIsComplete(false)
}
const increaseMatchCount = ()=>{
  const updatedMatchCount = matchCount+1;
  setMatchCount(updatedMatchCount)
}

const updateMatchCount = async ()=>{
  try{
    setIsLoading(true)
    const matchCountResults = await fetchMatchCount();
    const finishedUserResults = await fetchFinishedUsers(dateCap);
    const userDateCountAverageResults = await fetchUserDateCountAverage()
    if(!isLoading){
      const matchCountData = matchCountResults.data
      console.log("matchCountData:  ", matchCountData)
      const updatedMatchCount = matchCountData.totalMatchesCount[0].total_match_count;
      setMatchCount(updatedMatchCount)
      setFinishedUsersCount(finishedUserResults.data.length)
      setUserDateCountAverage(userDateCountAverageResults.data[0].average_matches)
    }
  }
  catch(err){
    console.log("ERROR:  ", err)
  }
}
const tempMatchCountHandler = (count )=>{
  const updatedMatchCount = parseInt(count)
  setMatchCount(updatedMatchCount)
}

const simCompletionHandler = ()=>{
  setSimIsComplete(true)
  setSimIsRunning(false)
  setSimIsPaused(false)
}
const simResetHandler = async()=>{
  try {
    setIsLoading(true);
    await updateMatchCount()
    await podCountUpdateHandler()
    setIsLoading(false);
    if(!isLoading){
      simulationCancellationHandler()
    }
  } catch (err) {
    console.log("ERROR:  ", err)
  }
}
/* ----------SIMULATION------------- */
/* --------------------USERS-------------*/
const userDeleteHandler = async (id)=> {
  try{
    console.log("DELETEY", id)
    const updatedUsersResults = await deleteUser(id)
    console.log("updatedUsersData:  ", updatedUsersResults)
    const updatedUsersData= updatedUsersResults.data
    console.log("updatedUsersData:  ", updatedUsersData)
    setUsers(updatedUsersData)
  }
  catch(err){
    console.log("ERROR:  ", err)
  }
}

const userCountUpdateHandler = async ()=> {
  try{
    console.log("userCountUpdateHandler fired")
    setIsLoading(true)
    const usersCountResults = await fetchUserCount();
    console.log("usersCountResults:  ", usersCountResults)
    const updatedAvailableUsersCountData = usersCountResults.data.available[0].available_user_count;
    const updatedWaitingUsersCountData = usersCountResults.data.waiting[0].waiting_user_count;
    const updatedTotalUsersCountData = usersCountResults.data.total[0].total_count;
    setIsLoading(false)
    if (!isLoading) {
      const updatedAvailableUsersCount = parseInt(updatedAvailableUsersCountData);
      const updatedWaitingUsersCount = parseInt(updatedWaitingUsersCountData);
      const updatedTotalUsersCount = parseInt(updatedTotalUsersCountData);
      setAvailableUsersCount(updatedAvailableUsersCount)
      setWaitingUsersCount(updatedWaitingUsersCount);
      setTotalUsersCount(updatedTotalUsersCount);
    }
  }
  catch(err){
    console.log("ERROR:  ", err)
  }
}
/* --------------------USERS------------- */
/* ----------PODS-------------*/
const podCountUpdateHandler = async ()=>{
  try{
    setIsLoading(true)
    const podCountResults = await fetchPodsCount();
    console.log("occupiedPodCount:  ",  podCountResults.data.occupiedPodCount[0]);
    console.log("availablePodCount:  ",  podCountResults.data.availablePodCount[0]);
    console.log("totalPodCount:  ",  podCountResults.data.totalPodCount[0]);
    const updatedOccupiedPodCountData = podCountResults.data.occupiedPodCount[0].occupied_pod_count;
    const updatedAvailablePodCountData = podCountResults.data.availablePodCount[0].available_pod_count;
    const updatedTotalPodCountData = podCountResults.data.totalPodCount[0].total_pod_count;
    setIsLoading(false)
    if (!isLoading) {
      const updatedAvailablePodCount = parseInt(updatedAvailablePodCountData);
      const updatedOccupiedPodCount = parseInt(updatedOccupiedPodCountData);
      const updatedTotalPodCount = parseInt(updatedTotalPodCountData);
      setTotalPodCount(updatedTotalPodCount);
      setOccupiedPodCount(updatedOccupiedPodCount);
      setAvailablePodCount(updatedAvailablePodCount);
    }
  }
  catch(err){
    console.log("INITIAL LOAD FAILED:  ", err)
  }
}
/* ----------PODS------------- */
/* ----------EVENT CONDITION CHANGE------------- */
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

const dateCapChangeHandler = (e)=>{
  let updatedMinimumDateAmount= e.target.value
  setDateCap(updatedMinimumDateAmount)
}
/* ----------EVENT CONDITION CHANGE------------- */
/* --------------------HANDLERS------------- */
const dateLength =   dateDuration+bufferDuration
  return (
    <div className="App">
      <div className="apphead-container">
        <Header simIsComplete={simIsComplete} simIsPaused={simIsPaused} simIsRunning={simIsRunning} dateCap={dateCap} dateCapChangeHandler={dateCapChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}  sessionLength={sessionLength} totalPodCount={totalPodCount} occupiedPodCount={occupiedPodCount} totalUsersCount={totalUsersCount} availableUsersCount={availableUsersCount} matchCount={matchCount} finishedUsersCount={finishedUsersCount} userDateCountAverage={userDateCountAverage}/>
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
          simCompletionHandler={simCompletionHandler}
          simResetHandler={simResetHandler}
          increaseMatchCount={increaseMatchCount}
          simIsPaused={simIsPaused}
          pauseSimulation= {simulationPauseHandler}
          simIsComplete={simIsComplete}
          simIsRunning={simIsRunning}
          simulationStartHandler={simulationStartHandler}
          dateDuration={dateLength}
          dateCap={dateCap}
          podCount={totalPodCount}
          matchCount={matchCount}
          updateUserCount={userCountUpdateHandler}
          updateMatchCount={updateMatchCount}
          updatePodCount={podCountUpdateHandler}
          tempUpdateMatchCount={tempMatchCountHandler}
        />
      </Tab>
      <Tab eventKey="userlist" title="User List" >
        <UserInfo users={users} podCount={totalPodCount} userDeleteHandler={userDeleteHandler} />
      </Tab>
    </Tabs>
    </div>
  );
}

export default App;