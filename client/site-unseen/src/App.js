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
import {fetchUsers, fetchElligibleUsers, fetchUserCount, fetchUserDateCountAverage, fetchFinishedUsers, deleteUser} from "./api/users";
import {fetchPods,fetchPodsCount, addPods } from "./api/pods.js";
import { fetchMatches, fetchMatchCount, deleteMatches } from "./api/matches.js";

/* DEFAULT VALUES */

const BUFFERDURATION = 5;
const DATEDURATION = 1;
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
  const [sessionDuration, setSessionDuration]= useState(0);
  /* DATES */
  const [bufferDuration, setBufferDuration]= useState(BUFFERDURATION);
  const [dateDuration, setDateDuration]= useState(DATEDURATION);
  const [dateCap, setDateCap] = useState(DEFAULTDATECAP)
  /* USERS */
  const [users, setUsers] = useState([]);
  const [elligibleUsers, setElligibleUsers] = useState([])
  //COUNT
  const [availableUsersCount, setAvailableUsersCount] = useState(0)
  const [waitingUsersCount, setWaitingUsersCount] = useState(0)
  const [totalUsersCount, setTotalUsersCount] = useState(0)
  const [finishedUsersCount, setFinishedUsersCount] = useState(0)
  const [userDateCountAverage, setUserDateCountAverage] = useState(0)
  /* PODS */
  const [totalPodCount, setTotalPodCount] = useState(0)
  const [availablePodCount, setAvailablePodCount] = useState(0)
  const [occupiedPodCount, setOccupiedPodCount] = useState(0)
  /* MATCHES */
  const [totalMatchCount, setTotalMatchCount] = useState(0);
  const [activeMatchCount, setActiveMatchCount] = useState(0)
  const [completedMatchCount, setCompletedMatchCount] =useState(0)
  
/* ----------LOCAL STATE------------- */

/* ---------------STATE DEPENDANT VARIABLES FORMATTED DATA AND METRICS-------------------------- */
/* ---------------STATE DEPENDANT FORMATTED DATA AND METRICS-------------------------- */

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
const simCompletionHandler = ()=>{
  setSimIsComplete(true)
  setSimIsRunning(false)
  setSimIsPaused(false)
}

const simCompletionCheckerHandler = async ()=>{
  try {
   if(simIsRunning && !elligibleUsers){
    if(!activeMatchCount){
      simCompletionHandler()
    }
   }
  } catch (error) {
    console.log("error:  ", error)
  }
}
const simResetHandler = async()=>{
  try {
    setIsLoading(true);
    await deleteMatches()
    await matchCountUpdateHandler()
    await podCountUpdateHandler()
    setIsLoading(false);
    if(!isLoading){
      setSessionDuration(0)
      simulationCancellationHandler()
    }
  } catch (err) {
    console.log("ERROR:  ", err)
  }
}

/* ----------SIMULATION------------- */

/* --------------------USERS-------------*/
const userUpdateHandler = async ()=>{
  try {
    setIsLoading(true)
    const userResults = await fetchUsers();
    const elligibleUsersResults = await fetchElligibleUsers(dateCap);
    const finishedUserResults = await fetchFinishedUsers(dateCap);
    setIsLoading(false)
    if(!isLoading){
      const updatedUserData = userResults.data;
      const updatedElligibleUsersData= elligibleUsersResults.data
      const finishedUserData = finishedUserResults.data;
      setUsers(updatedUserData)
      setElligibleUsers(updatedElligibleUsersData)
      // setFinishedUsersCount()
    }
  } catch (error) {
    console.log("ERROR:  ", error)
  }
}
const userDeleteHandler = async (id)=> {
  try{
    console.log("DELETEY", id)
    setIsLoading(true)
      await deleteUser(id)
      await userUpdateHandler()
    setIsLoading(false)
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
/* ----------MATCHES------------- */
const matchCountUpdateHandler = async ()=>{
  try{
    setIsLoading(true);
    const matchCountResults = await fetchMatchCount();
    const finishedUserResults = await fetchFinishedUsers(dateCap);
    const userDateCountAverageResults = await fetchUserDateCountAverage();
    setIsLoading(false);
    if(!isLoading){
      const updatedActiveMatchCountData = matchCountResults.data.currentMatchesCount[0].current_match_count;
      const updatedCompletedMatchCountData = matchCountResults.data.completedMatchesCount[0].complete_match_count;
      const updatedTotalMatchCountData = matchCountResults.data.totalMatchesCount[0].total_match_count;

      setActiveMatchCount(updatedActiveMatchCountData)
      setCompletedMatchCount(updatedCompletedMatchCountData)
      setTotalMatchCount(updatedTotalMatchCountData)
      setFinishedUsersCount(finishedUserResults.data.length)
      setUserDateCountAverage(userDateCountAverageResults.data[0].average_matches)
    }
  }
  catch(err){
    console.log("ERROR:  ", err)
  }
}

/* ----------MATCHES------------- */
/* ----------SESSION DURATION------------- */
const sessionDurationChangeHandler = (updatedSessionTime)=>{
  setSessionDuration(updatedSessionTime)
}
/* ----------SESSION DURATION------------- */
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
//   /* ---------------LIFECYCLE-------------------------- */
/* --------INIT-------- */
useEffect(()=>{
  async function startFetching() {
    try{
    setIsLoading(true)
    const userResults = await fetchUsers();
    const finishedUserResults = await fetchFinishedUsers(dateCap);
    await userCountUpdateHandler()
    await podCountUpdateHandler()

    const matchResults = await fetchMatches();
    const userDateCountAverageResults = await fetchUserDateCountAverage();
    setIsLoading(false)
    if (!isLoading) {
      setUsers(userResults.data);
      setTotalMatchCount(matchResults.data.length)
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
const dateLength =   dateDuration+bufferDuration
  return (
    <div className="App">
      <div className="apphead-container">
        <Header users={users} simIsComplete={simIsComplete} simIsPaused={simIsPaused} simIsRunning={simIsRunning} dateCap={dateCap} dateCapChangeHandler={dateCapChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}  totalPodCount={totalPodCount} occupiedPodCount={occupiedPodCount} totalUsersCount={totalUsersCount} availableUsersCount={availableUsersCount} totalMatchCount={totalMatchCount} activeMatchCount={activeMatchCount} finishedUsersCount={finishedUsersCount} userDateCountAverage={userDateCountAverage}/>
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
          sessionDuration={sessionDuration}
          sessionDurationChangeHandler={sessionDurationChangeHandler}
          simCompletionHandler={simCompletionHandler}
          simResetHandler={simResetHandler}
          simIsPaused={simIsPaused}
          pauseSimulation= {simulationPauseHandler}
          simIsComplete={simIsComplete}
          simIsRunning={simIsRunning}
          simulationStartHandler={simulationStartHandler}
          elligibleUsers={elligibleUsers}
          dateDuration={dateLength}
          dateCap={dateCap}
          occupiedPodCount={occupiedPodCount}
          totalPodCount={totalPodCount}
          activeMatchCount={activeMatchCount}
          totalMatchCount={totalMatchCount}
          updateUserCount={userCountUpdateHandler}
          updateMatchCount={matchCountUpdateHandler}
          updatePodCount={podCountUpdateHandler}
        />
      </Tab>
      <Tab eventKey="userlist" title="User List" >
        <UserInfo users={users} podCount={totalPodCount} userDeleteHandler={userDeleteHandler} userUpdateHandler={userUpdateHandler} podCountUpdateHandler={podCountUpdateHandler}/>
      </Tab>
    </Tabs>
    </div>
  );
}

export default App;