/* REACT */
import { useState, useEffect } from "react";
/* SOCKET IO */
// import { socket } from './socket';
/* STYLES */
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
/* BOOTSTRAP COMPONENTS */
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/esm/Button.js";
/* COMPONENTS */
import Header from "./components/Header/index.jsx";
import Dashboard from "./pages/Dashboard";
import Matchmaker from "./pages/Matchmaker";
import UserInfo from "./pages/UserInfo";

/* API */
import {
  fetchUsers,
  fetchElligibleUsers,
  fetchUserCount,
  fetchUserDateCountAverage,
  fetchFinishedUsers,
  fetchUserSimResults,
  deleteUser,
} from "./api/users";
import { fetchPods, fetchPodsCount, addPods } from "./api/pods.js";
import {
  fetchMatchesData,
  fetchMatchCount,
  createMatch,
  deleteMatches,
} from "./api/matches.js";
import { fetchSimStatus } from "./api/sim.js";

/* DEFAULT VALUES */

const BUFFERDURATION = 5;
const DATEDURATION = 1;
const DEFAULTDATECAP = 3;

const App = () => {
  /*--------LOCAL STATE---------- */
  /* SOCKET */
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);
  /*LOADING */
  const [isLoading, setIsLoading] = useState(false);
  /* SIMULATION */
  const [simIsStarting, setSimIsStarting] = useState(false);
  const [simIsRunning, setSimIsRunning] = useState(false);
  const [simIsPaused, setSimIsPaused] = useState(false);
  const [simIsComplete, setSimIsComplete] = useState(false);
  const [simResultsData, setSimResultsData] =useState(null);
  /* Session Time */
  const [sessionDuration, setSessionDuration] = useState(0);
  /* DATES */
  const [bufferDuration, setBufferDuration] = useState(BUFFERDURATION);
  const [dateDuration, setDateDuration] = useState(DATEDURATION);
  const [dateMax, setDateMax] = useState(DEFAULTDATECAP);
  const [dateMin, setDateMin] = useState(DEFAULTDATECAP);
  /* USERS */
  const [users, setUsers] = useState([]);
  const [elligibleUsers, setElligibleUsers] = useState([]);
  //COUNT
  const [availableUsersCount, setAvailableUsersCount] = useState(0);
  const [waitingUsersCount, setWaitingUsersCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [finishedUsersCount, setFinishedUsersCount] = useState(0);
  const [userDateCountAverage, setUserDateCountAverage] = useState(0);
  /* PODS */
  const [totalPodCount, setTotalPodCount] = useState(0);
  const [availablePodCount, setAvailablePodCount] = useState(0);
  const [occupiedPodCount, setOccupiedPodCount] = useState(0);
  /* MATCHES */
  const [matchesInProgress, setMatchesInProgress] = useState([]);
  const [totalMatchCount, setTotalMatchCount] = useState(0);
  const [activeMatchCount, setActiveMatchCount] = useState(0);
  const [completedMatchCount, setCompletedMatchCount] = useState(0);

  /* ----------LOCAL STATE------------- */

  /* ---------------STATE DEPENDANT VARIABLES FORMATTED DATA AND METRICS-------------------------- */
  /* ---------------STATE DEPENDANT FORMATTED DATA AND METRICS-------------------------- */

  /* --------------------HANDLERS------------- */
  /* ----------SIMULATION------------- */
  //*
  const simulationStartHandler = () => {
    setSimIsStarting(true);
    setSimIsRunning(false);
    setSimIsPaused(false);
    setSimIsComplete(false);
  };
  const simulationRunHandler = () => {
    setSimIsStarting(true);
    setSimIsRunning(true);
    setSimIsPaused(false);
    setSimIsComplete(false);
  };
  //*
  const simulationPauseHandler = () => {
    setSimIsRunning(false);
    setSimIsPaused(true);
  };
  //*
  const simulationCancellationHandler = () => {
    setSimIsStarting(false);
    setSimIsRunning(false);
    setSimIsPaused(false);
    setSimIsComplete(false);
  };
  const simCompletionHandler = () => {
    setSimIsComplete(true);
    setSimIsRunning(false);
    setSimIsPaused(false);
    setSimIsStarting(false);
  };


  const simResetHandler = async () => {
      await deleteMatches();
      await matchCountUpdateHandler();
      await podCountUpdateHandler();
      await setSessionDuration(0);
      await simulationCancellationHandler();
  };

  /* ----------SIMULATION------------- */

  /* --------------------USERS-------------*/
  const userUpdateHandler = async () => {
    try {
      setIsLoading(true);
      const userResults = await fetchUsers();
      const elligibleUsersResults = await fetchElligibleUsers(dateMin);
      setIsLoading(false);
      if (!isLoading) {
        const updatedUserData = userResults.data;
        const updatedElligibleUsersData = elligibleUsersResults.data;
        setUsers(updatedUserData);
        setElligibleUsers(updatedElligibleUsersData);
      }
    } catch (error) {
      console.log("ERROR:  ", error);
      throw error
    }
  };
  const userDeleteHandler = async (id) => {
    try {
      console.log("DELETEY", id);
      setIsLoading(true);
      await deleteUser(id);
      await userUpdateHandler();
      setIsLoading(false);
    } catch (err) {
      console.log("ERROR:  ", err);
      throw err
    }
  };

  const userCountUpdateHandler = async () => {
    try {
      console.log("userCountUpdateHandler fired");
      setIsLoading(true);
      const usersCountResults = await fetchUserCount();
      const userAverageDateCountResults = await fetchUserDateCountAverage();
      console.log("usersCountResults:  ", usersCountResults);
      const updatedAvailableUsersCountData =
        usersCountResults.data.available[0].available_user_count;
      const updatedWaitingUsersCountData =
        usersCountResults.data.waiting[0].waiting_user_count;
      const updatedTotalUsersCountData =
        usersCountResults.data.total[0].total_count;
      const userAverageDateCountData =
        userAverageDateCountResults.data[0].average_matches;
      setIsLoading(false);
      if (!isLoading) {
        const updatedAvailableUsersCount = parseInt(
          updatedAvailableUsersCountData
        );
        const updatedWaitingUsersCount = parseInt(updatedWaitingUsersCountData);
        const updatedTotalUsersCount = parseInt(updatedTotalUsersCountData);
        setAvailableUsersCount(updatedAvailableUsersCount);
        setWaitingUsersCount(updatedWaitingUsersCount);
        setTotalUsersCount(updatedTotalUsersCount);
      }
    } catch (err) {
      console.log("ERROR:  ", err);
      throw err
    }
  };
  /* --------------------USERS------------- */
  /* ----------PODS-------------*/
  const podCountUpdateHandler = async () => {
    try {
      setIsLoading(true);
      const podCountResults = await fetchPodsCount();
      const updatedOccupiedPodCountData =
        podCountResults.data.occupiedPodCount[0].occupied_pod_count;
      const updatedAvailablePodCountData =
        podCountResults.data.availablePodCount[0].available_pod_count;
      const updatedTotalPodCountData =
        podCountResults.data.totalPodCount[0].total_pod_count;
      setIsLoading(false);
      if (!isLoading) {
        const updatedAvailablePodCount = parseInt(updatedAvailablePodCountData);
        const updatedOccupiedPodCount = parseInt(updatedOccupiedPodCountData);
        const updatedTotalPodCount = parseInt(updatedTotalPodCountData);
        setTotalPodCount(updatedTotalPodCount);
        setOccupiedPodCount(updatedOccupiedPodCount);
        setAvailablePodCount(updatedAvailablePodCount);
      }
    } catch (err) {
      console.log("INITIAL LOAD FAILED:  ", err);
      throw err
    }
  };
  /* ----------PODS------------- */
  /* ----------MATCHES------------- */
  const matchCountUpdateHandler = async () => {
    try {
      setIsLoading(true);
      const matchCountResults = await fetchMatchCount();
      const finishedUserResults = await fetchFinishedUsers(dateMin);
      const userDateCountAverageResults = await fetchUserDateCountAverage();
      setIsLoading(false);
      if (!isLoading) {
        const updatedActiveMatchCountData =
          matchCountResults.data.currentMatchesCount[0].current_match_count;
        const updatedCompletedMatchCountData =
          matchCountResults.data.completedMatchesCount[0].complete_match_count;
        const updatedTotalMatchCountData =
          matchCountResults.data.totalMatchesCount[0].total_match_count;

        setActiveMatchCount(updatedActiveMatchCountData);
        setCompletedMatchCount(updatedCompletedMatchCountData);
        setTotalMatchCount(updatedTotalMatchCountData);
        setFinishedUsersCount(finishedUserResults.data.length);
        setUserDateCountAverage(
          userDateCountAverageResults.data[0].average_matches
        );
      }
    } catch (err) {
      console.log("ERROR:  ", err);
      throw err
    }
  };

  /* ----------MATCHES------------- */

  /* ----------EVENT CONDITION CHANGE------------- */
  const bufferDurationChangeHandler = (e) => {
    let updatedBufferDuration = e.target.value;
    updatedBufferDuration = parseInt(updatedBufferDuration);
    setBufferDuration(updatedBufferDuration);
  };
  const dateDurationChangeHandler = (e) => {
    let updatedDateDuration = e.target.value;
    updatedDateDuration = parseInt(updatedDateDuration);
    setDateDuration(updatedDateDuration);
  };

  const dateMinChangeHandler = (e) => {
    let updatedMinimumDateAmount = e.target.value;
    setDateMin(updatedMinimumDateAmount);
  };
  const dateMaxChangeHandler = (e) => {
    let updatedMaximumDateAmount = e.target.value;
    setDateMax(updatedMaximumDateAmount);
  };
  /* ----------EVENT CONDITION CHANGE------------- */
  /* --------------------HANDLERS------------- */
  /* ---------------LIFECYCLE-------------------------- */
  /* --------INIT-------- */

  async function fetchUserAndPodData() {
    try {
      fetchUsers().then((userResults) => setUsers(userResults.data));
      fetchFinishedUsers(dateMin).then((finishedUserResults) =>
        setFinishedUsersCount(finishedUserResults.data.length)
      );
      userCountUpdateHandler();
      podCountUpdateHandler();
      fetchUserDateCountAverage().then((userDateCountAverageResults) =>
        setUserDateCountAverage(
          userDateCountAverageResults.data[0].average_matches
        )
      );
    } catch (err) {
      console.log("INITIAL LOAD FAILED:  ", err);
      throw err;
    }
  }

  useEffect(() => {
    fetchUserAndPodData();
    // function onConnect() {
    //   setIsConnected(true);
    // }

    // function onDisconnect() {
    //   setIsConnected(false);
    // }

    // function onFooEvent(value) {
    //   setFooEvents(previous => [...previous, value]);
    // }

    // socket.on('connect', onConnect);
    // socket.on('disconnect', onDisconnect);
    // socket.on('foo', onFooEvent);

    // return () => {
    //   socket.off('connect', onConnect);
    //   socket.off('disconnect', onDisconnect);
    //   socket.off('foo', onFooEvent);
    // };

  }, []);
  /* --------INIT-------- */
  /* --------SESSION DURATION TRACKER-------- */
  useEffect(() => {
    let interval;
    if (simIsRunning) {
      interval = setInterval(() => {
        setSessionDuration((seconds) => seconds + 1);
      }, 1000);
    } else if (simIsPaused) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [simIsRunning]);
  /* --------SESSION DURATION TRACKER-------- */

  const fetchAndSetMatches = async () => {
    console.log("FETCH AND SET MATCHES FIRED")
    const updatedMatchesInProgressResults = await fetchMatchesData(
      dateDuration + bufferDuration
    );
    console.log("updatedCurrentResults:  ", updatedMatchesInProgressResults);
    const updatedMatchesInProgress = await updatedMatchesInProgressResults.data;
    console.log("updatedCurrent:  ", updatedMatchesInProgress);
    await setMatchesInProgress(updatedMatchesInProgress);
  };


  const checkForSimCompletion = async ()=>{
    const updatedSimStatus = await fetchSimStatus(dateMin, dateMax, dateDuration + bufferDuration)
    console.log("updatedSimStatus:  ", updatedSimStatus.data.simStatus)
    await setSimIsComplete(updatedSimStatus.data.simStatus)
  }

  /* sim loop */
  useEffect(() => {
    const progressSimulation = async ()=>{
      // console.log("SIM IS PROGRESSING")
      await fetchUserAndPodData()
      await fetchAndSetMatches()
      await createMatch(dateMax)
      await checkForSimCompletion()
      // console.log("SIM IS PROGRESSED")
    }
    console.log("SESSION MOVING")
    progressSimulation()
    // Promise.all([
    //   fetchUserAndPodData(),
    //   createMatch(dateMax).then(fetchAndSetMatches()),
    //   checkForSimCompletion(),
    // ])
    //   .then(fetchSimStatus(dateMin, dateMax, dateDuration + bufferDuration))
    //   .then((result) => {
    //     console.log("SIMSTATUS:  ", result)
    //     console.log("SIMSTATUS:  ", result.data)
    //     setSimIsComplete(result.data.simStatus)
    //   }
    //   );
  }, [sessionDuration]);


  const fetchAndSetSimResultsData = async ()=>{
    const simulationResults = await fetchUserSimResults(dateMin, dateMax)
    console.log("Sim Results:  ", simulationResults)
    await setSimResultsData(simulationResults)
}
  useEffect(() => {
    if(simIsComplete){
      fetchAndSetSimResultsData()
      simCompletionHandler()
    }
  }, [simIsComplete]);

  /* ---------------LIFECYCLE-------------------------- */
  /* ---------------SOCKET STUFF-------------------------- */

  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //     socket.emit('message', {
  //       text: "flurby wurby derby",
  //       id: `${socket.id}${Math.random()}`,
  //       socketID: socket.id,
  //     });
  // };
    /* ---------------SOCKET STUFF-------------------------- */
  const dateLength = dateDuration + bufferDuration;
  return (
    <div className="App">
      <div className="apphead-container">
        <Header
          users={users}
          simIsComplete={simIsComplete}
          simIsPaused={simIsPaused}
          simIsRunning={simIsRunning}
          dateMin={dateMin}
          dateMax={dateMax}
          dateMinChangeHandler={dateMinChangeHandler}
          dateMaxChangeHandler={dateMaxChangeHandler}
          bufferDuration={bufferDuration}
          bufferDurationChangeHandler={bufferDurationChangeHandler}
          dateDuration={dateDuration}
          dateDurationChangeHandler={dateDurationChangeHandler}
          totalPodCount={totalPodCount}
          occupiedPodCount={occupiedPodCount}
          totalUsersCount={totalUsersCount}
          availableUsersCount={availableUsersCount}
          totalMatchCount={totalMatchCount}
          activeMatchCount={activeMatchCount}
          finishedUsersCount={finishedUsersCount}
          userDateCountAverage={userDateCountAverage}
        />
      </div>
      {/* <Button onClick={handleSendMessage}>SOCKET CONNECTION</Button> */}
      <Tabs defaultActiveKey="matchmaker" id="tab-text">
        {/* <Tab eventKey="dashboard" title="Dashboard">
        <Dashboard users={users} matchQueue={matchQueue} pods={pods} availablePods={availablePods} />
      </Tab> */}
        <Tab id="tab-text" eventKey="matchmaker" title="Matchmaker">
          <Matchmaker
            matchesInProgress={matchesInProgress}
            simResultsData={simResultsData}
            sessionDuration={sessionDuration}
            simIsPaused={simIsPaused}
            simIsComplete={simIsComplete}
            simIsRunning={simIsRunning}
            dateDuration={dateLength}
            dateMin={dateMin}
            dateMax={dateMax}
            simulationPauseHandler={simulationPauseHandler}
            simulationRunHandler={simulationRunHandler}
            simResetHandler={simResetHandler}
          />
        </Tab>
        <Tab id="tab-text" eventKey="userlist" title="User List">
          <UserInfo
            users={users}
            podCount={totalPodCount}
            userDeleteHandler={userDeleteHandler}
            userUpdateHandler={userUpdateHandler}
            podCountUpdateHandler={podCountUpdateHandler}
            userCountUpdateHandler={userCountUpdateHandler}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;
