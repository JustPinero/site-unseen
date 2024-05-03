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

/* API */
import {fetchUsers, fetchElligibleUsers, } from "./api/users";
import {fetchPods, addPods } from "./api/pods.js";

/* DEFAULT VALUES */
const USERNUMBER = 284;
const PODNUMBER = 20;
const EVENTDURATION = 10800
const BUFFERDURATION = 10;
const DATEDURATION = 10;
const DEFAULTDATECAP = 6


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
  /* PODS */
  const [podCount, setPodCount] = useState(PODNUMBER)
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
    setUsers(null);
    const userResults = await fetchUsers(dateCap);
    const podResults = await fetchPods()
    if(podCount===0){
      await addPods(PODNUMBER);
    }
    if (!ignore) {
      console.log("USERS:  ", userResults.data)
      console.log("PDOS:  ", podResults.data)
      setUsers(userResults.data);
      setPodCount(podResults.data.length)
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
  return (
    <div className="App">
      <div className="apphead-container">
        <Header simIsRunning={simIsRunning} dateCap={dateCap} dateCapChangeHandler={dateCapChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}  sessionLength={sessionLength} podCount={podCount} userCount={users?.length} matchCount={matchCount}/>
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
          increaseMatchCount={increaseMatchCount}
          simIsPaused={simIsPaused}
          pauseSimulation= {simulationPauseHandler}
          simIsComplete={simIsComplete}
          simIsRunning={simIsRunning}
          simulationStartHandler={simulationStartHandler}
          dateDuration={dateDuration}
          bufferDuration={bufferDuration}
          users = {users}
          dateCap={dateCap}
        />
      </Tab>
      <Tab eventKey="userlist" title="User List" >
        <UserInfo />
      </Tab>
    </Tabs>
    </div>
  );
}

export default App;