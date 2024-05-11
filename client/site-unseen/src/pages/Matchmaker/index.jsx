/* REACT */
import { useState, useEffect } from "react";
/* STYLES */
import "./styles.css";
/* BOOTSTRAP COMPONENTS */
// import Modal from "react-bootstrap/Modal";
/* COMPONENTS */
import MatchTable from "../../components/MatchTable";
import MatchToolBox from "./MatchToolBox";
import SimulationResults from "./SimulationResults"
/* API */
import {fetchMatchesData, createMatch } from "../../api/matches";
import Button from "react-bootstrap/esm/Button";

const Matchmaker = ({
  simulationRunHandler,
  sessionTimerStartHandler,
  sessionDuration,
  sessionDurationChangeHandler,
  simIsPaused,
  pauseSimulation,
  simIsComplete,
  simIsRunning,
  simIsStarting,
  simulationStartHandler,
  simCompletionHandler,
  simResetHandler,
  dateDuration,
  totalPodCount,
  activeMatchCount,
  dateCap,
  updateUserCount,
  updatePodCount,
  updateMatchCount,

}) => {
  /*--------LOCAL STATE---------- */
  /*isLoading */
  const [isLoading, setIsLoading] = useState(false)
  /* MATCHLIST */
  const [currentMatches, setCurrentMatches] = useState([]);
  /*--------LOCAL STATE---------- */
  /*--------LIFECYCLE---------- */
  //INITIAL
  // useEffect(()=>{
  //   async function updateStatus() {
  //     try{
  //       setIsLoading(true)
  //       const updatedActiveMatchesResults = await fetchActiveMatches();
  //       const updatedActiveMatches = await updatedActiveMatchesResults.data;
  //       const elligibleUserListResults = await fetchElligibleUsers(dateCap);
  //       const updatedElligibleUserList = await elligibleUserListResults.data;
  //       setIsLoading(false)
  //       if(!isLoading){
  //         if(updatedActiveMatches.length===0 && matchCompletionQueue.length===0 && updatedElligibleUserList.length && simIsRunning){
  //           simCompletionCheckerHandler()
  //         }else{
  //           setCurrentMatches(updatedActiveMatches)
  //         }
  //       console.log("CURRENT MATCHES:  ", currentMatches)
  //     }
  //     }
  //     catch(err){
  //       console.log("ERROR:  ", err)
  //     }
  //   }
  //   updateStatus()
  // },[])

  useEffect(() => {
    async function updateStatus() {
      try{
        setIsLoading(true);
          await showStateAsIs();
        await updateUserCount()
        await updatePodCount()
        await updateMatchCount()
        setIsLoading(false);
        // if(!isLoading){
        //   if(!currentMatches.length){
        //     simCompletionCheckerHandler()
        //   }
        // }
      }
      catch(err){
        console.log("ERROR:  ", err)
      }
    }
    console.log("SESSION DURATION UE IS RUNNING:  ", sessionDuration)
    updateStatus()
  }, [sessionDuration]);

    useEffect(() => {
    async function updateCounts() {
       await generateMatchHandler();
    }
    updateCounts()
  }, [currentMatches]);

  useEffect(() => {
    console.log("sim is running")
    async function firstPull() {

       generateMatchHandler().then(()=>  sessionTimerStartHandler())


   }
   if(simIsStarting===true){
   return ()=>firstPull()
   }
  }, [simIsStarting]);


  /*--------LIFECYCLE ---------- */
  const runSimulation = () => {
    console.log("AM I STARTING")
    simulationRunHandler()
  };


  const generateMatchHandler = async ()=>{
    try{
      setIsLoading(true)
          const simStatusData =await createMatch(dateCap)
      setIsLoading(false)
          if(!isLoading){
            console.log("simStatusData", simStatusData)
            const updatedSimStatus = simStatusData.data.simstatus;
            if(updatedSimStatus === "complete"){
              simCompletionHandler()
            }
          }
    }
    catch(err){
      console.log("ERROR:  ", err)
    }
  }


  const showStateAsIs = async()=>{
    const updatedCurrentResults = await fetchMatchesData(dateDuration)
    const updatedCurrent = await updatedCurrentResults.data;
    console.log("updatedCurrent:  ", updatedCurrent)
    setCurrentMatches(updatedCurrent)
  }

  return (
    <div className="matchmaker-tab">
      <MatchToolBox  sessionDuration={sessionDuration} sessionDurationChangeHandler={sessionDurationChangeHandler} simIsPaused={simIsPaused} pauseSimulation={pauseSimulation} simIsRunning={simIsRunning} runSimulation={runSimulation}  />
      <div className="matchmaker-buttonbox" styles={{display:"flex", flexDirection:"row"}}>
            <Button onClick={()=>generateMatchHandler()} >
            {( totalPodCount===0 ? "CURRENTLY NO PODS EXIST": currentMatches.length === Math.floor(totalPodCount/2)) ? "PODS ARE FULL" :" GENERATE MATCH"}
            </Button>
            {/* <Button onClick={()=>addMatchToCompletionQueueButtonClickHandler()} >
              ADD MATCH to COMPLETION QUEUE
            </Button> */}
            <Button onClick={showStateAsIs} >
              GET MATCHES FROM BACKEND
            </Button>
            <Button onClick={simResetHandler} >
              RESET MATCHES
            </Button>
        </div>
        <div style={{display:"flex", flexWrap:"wrap"}}>
        </div>
      <div className="matches-container">
        <div className="stats-container">
          {
          simIsComplete ?
          <SimulationResults dateCount={dateCap}/>:
          <MatchTable
            simIsRunning={simIsRunning}
            simIsPaused={simIsPaused}
            matches={currentMatches}
            dateDuration={dateDuration}
          />
          }
        </div>
      </div>
    </div>
  );
};

export default Matchmaker;