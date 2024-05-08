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
import {fetchUsers, fetchUserDateCountAverage, fetchFinishedUsers} from "./api/users";
import {fetchPods, addPods } from "./api/pods.js";
import { fetchMatches } from "./api/matches.js";

/* DEFAULT VALUES */
const USERNUMBER = 284;
const PODNUMBER = 20;
const EVENTDURATION = 10800
const BUFFERDURATION = 10;
const DATEDURATION = 10;
const DEFAULTDATECAP = 3


const App = ()=> {
  /*--------LOCAL STATE---------- */
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
  const [finishedUsersCount, setFinishedUsersCount] = useState(0)
  const [userDateCountAverage, setUserDateCountAverage] = useState(0)
  /* PODS */
  const [podCount, setPodCount] = useState(0)
  /* MATCHES */
  const [matchCount, setMatchCount] = useState(0);
  
  /* ----------LOCAL STATE------------- */
  /* ---------------STATE DEPENDANT VARIABLES FORMATTED DATA AND METRICS-------------------------- */
  /* DATE DURATION */

//   /* ---------------STATE DEPENDANT FORMATTED DATA AND METRICS-------------------------- */
//   /* ---------------LIFECYCLE-------------------------- */
/* --------INIT-------- */
useEffect(()=>{
  async function startFetching() {
    try{
    const userResults = await fetchUsers();
    const finishedUserResults = await fetchFinishedUsers(dateCap);
    const podResults = await fetchPods()
    const matchResults = await fetchMatches()
    const userDateCountAverageResults = await fetchUserDateCountAverage()
    if (!ignore) {
      setUsers(userResults.data);
      setPodCount(podResults.data.length)
      setMatchCount(matchResults.data.length)
      setFinishedUsersCount(finishedUserResults.data.length)
      setUserDateCountAverage(userDateCountAverageResults.data[0].average_matches)
    }
  }
  catch(err){
    console.log("INITIAL LOAD FAILED:  ", err)
  }
}
  let ignore = false;
  startFetching();
  return () => {
    ignore = true;
  }
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
    const finishedUserResults = await fetchFinishedUsers(dateCap);
    const matchResults = await fetchMatches()
    const userDateCountAverageResults = await fetchUserDateCountAverage()
    setFinishedUsersCount(finishedUserResults.data.length)
    setUserDateCountAverage(userDateCountAverageResults.data[0].average_matches)
    setMatchCount(matchResults.data.length)
  }
  catch(err){
    console.log("ERROR:  ", err)
  }
}

const simCompletionHandler = ()=>{
  setSimIsComplete(true)
  setSimIsRunning(false)
  setSimIsPaused(false)
}
/* ----------SIMULATION------------- */


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

/* --------------------HANDLERS------------- */
const dateLength =   dateDuration+bufferDuration
  return (
    <div className="App">
       {/* <div className="apphead-container">
        <Header simIsRunning={simIsRunning} dateCap={dateCap} dateCapChangeHandler={dateCapChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}  sessionLength={sessionLength} podCount={podCount} userCount={users?.length} matchCount={matchCount} finishedUsersCount={finishedUsersCount} userDateCountAverage={userDateCountAverage}/>
      </div> */}
      I AM WORKING BUT YOUR MEMORY LEAK IS KILLING ME
      {/* <div className="apphead-container">
        <Header simIsRunning={simIsRunning} dateCap={dateCap} dateCapChangeHandler={dateCapChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}  sessionLength={sessionLength} podCount={podCount} userCount={users?.length} matchCount={matchCount} finishedUsersCount={finishedUsersCount} userDateCountAverage={userDateCountAverage}/>
      </div>
    <Tabs
      defaultActiveKey="matchmaker"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="dashboard" title="Dashboard">
        <Dashboard users={users} matchQueue={matchQueue} pods={pods} availablePods={availablePods} />
      </Tab>
      <Tab eventKey="matchmaker" title="Matchmaker">
        <Matchmaker
          simCompletionHandler={simCompletionHandler}
          increaseMatchCount={increaseMatchCount}
          simIsPaused={simIsPaused}
          pauseSimulation= {simulationPauseHandler}
          simIsComplete={simIsComplete}
          simIsRunning={simIsRunning}
          simulationStartHandler={simulationStartHandler}
          dateDuration={dateLength}
          dateCap={dateCap}
          podCount={podCount}
          updateMatchCount={updateMatchCount}
        />
      </Tab>
      <Tab eventKey="userlist" title="User List" >
        <UserInfo podCount={podCount} />
      </Tab>
    </Tabs> */}
    </div>
  );
}

export default App;