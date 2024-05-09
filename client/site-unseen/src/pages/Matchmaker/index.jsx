/* REACT */
import { useState, useEffect } from "react";
/* STYLES */
import "./styles.css";
/* BOOTSTRAP COMPONENTS */
// import Modal from "react-bootstrap/Modal";
/* COMPONENTS */
import MatchTable from "../../components/MatchTable";
import MatchToolBox from "./MatchToolBox";
import MatchUserOption from "../../components/MatchBox/MatchHalf/MatchUserOption";
import SimulationResults from "./SimulationResults"
/* API */
import {fetchPodsCount} from "../../api/pods";
import {fetchUsers, fetchElligibleUsers, } from "../../api/users";
import { fetchActiveMatches, fetchMatchCount, createMatch, completeMatch, deleteMatches } from "../../api/matches";
import Button from "react-bootstrap/esm/Button";

const Matchmaker = ({
  simIsPaused,
  pauseSimulation,
  simIsComplete,
  simIsRunning,
  simulationStartHandler,
  simCompletionHandler,
  simResetHandler,
  dateDuration,
  podCount,
  matchCount,
  dateCap,
  updateUserCount,
  updatePodCount,
  updateMatchCount,
  tempUpdateMatchCount
}) => {
  /*--------LOCAL STATE---------- */
  /*isLoading */
  const [isLoading, setIsLoading] = useState(false)
  /* MATCHLIST */
  const [currentMatches, setCurrentMatches] = useState([]);
  const [matchCompletionQueue, setMatchCompletionQueue] = useState([]);
  /*--------LOCAL STATE---------- */

  useEffect(()=>{
    async function updateStatus() {
      try{
        if(!isLoading){
          setIsLoading(true)
          const updatedActiveMatchesResults = await fetchActiveMatches();
          const updatedActiveMatchesData = updatedActiveMatchesResults.data;
          const elligibleUserListResults = await fetchElligibleUsers(dateCap);
          const updatedElligibleUserList = elligibleUserListResults.data;
          if(updatedActiveMatchesData.length===0 && matchCompletionQueue.length===0 && updatedElligibleUserList.length && simIsRunning){
            simCompletionHandler()
          }else{
            setCurrentMatches(updatedActiveMatchesData)
          }
          setIsLoading(false);
        console.log("CURRENT MATCHES:  ", currentMatches)
      }
      }
      catch(err){
        console.log("ERROR:  ", err)
      }
    }
    updateStatus()
  },[])

  useEffect(()=>{
    async function updateCompletionQueue() {
      try{
        if(!isLoading){
          setIsLoading( true);
          await completeMatchInQueue()
          await updateMatchCount()
          setIsLoading( false)
        }
      }
      catch(err){
        console.log("ERROR:  ", err)
      }
    }
    if(matchCompletionQueue.length){
      updateCompletionQueue();
    }
  }, [matchCompletionQueue])


  useEffect(()=>{
    async function updateCurrentMatches() {
        try{
          if(simIsRunning){
            if(!isLoading){
              setIsLoading( true)
                await generateMatchHandler();
                setIsLoading( false);
            }
          }
        }
        catch(err){
          console.log("ERROR:  ", err)
        }
    }
    let matchLimit = Math.floor(podCount/2)
    console.log("MATCH LIMIT:  ", matchLimit)
    console.log("MATCH COUNT: ", matchCount)
    console.log("OK TO ADD MATCH?: ", matchCount<=matchLimit)
    if(matchCount<=matchLimit){
      updateCurrentMatches();
    }
  },[ currentMatches, simIsRunning])



  const runSimulation = () => {
    simulationStartHandler()
  };

  const fetchMatches = async ()=> {
    try{
      const activeMatches = await fetchActiveMatches()
      setCurrentMatches(activeMatches.data)
    }
    catch(err){
      console.log("ERROR:", err)
    }
  }

const completeMatchInQueue = async ()=>{
  try{
    console.log("matchCompletionQueue:  ", matchCompletionQueue)
    if(matchCompletionQueue.length){
      const nextCompletedMatch = matchCompletionQueue[0];
      const updatedCompletionQueue = matchCompletionQueue.filter(completedMatch=>(nextCompletedMatch.id !== completedMatch.id))
      setMatchCompletionQueue(updatedCompletionQueue)
      await completeMatch(nextCompletedMatch.id, nextCompletedMatch)
    }
  }
  catch(err){
    console.log("ERROR:  ", err)
  }
}

  const addMatchToCompletionQueue = async (completingMatch)=>{
    try{
      if(currentMatches.length){
      const nextCompletingMatch = completingMatch  || currentMatches[0]
      const updatedCurrentMatches = currentMatches.filter((match)=>(nextCompletingMatch.id!==match.id))
      let updatedCompletionQueue = [...matchCompletionQueue, nextCompletingMatch];
      setCurrentMatches(updatedCurrentMatches)
      setMatchCompletionQueue(updatedCompletionQueue)
      }
    }
  catch(err){
    console.log("ERROR:  ", err)
  }
}

  const dateCompletionHandler = async (matchData)=> {
    try{
      addMatchToCompletionQueue(matchData)
    }
    catch(err){
      console.log("ERROR:", err)
    }
  }
  const generateMatchHandler = async ()=>{
    try{
      setIsLoading(true)
        const podsCountResults = await fetchPodsCount();
        const elligibleUserList = await fetchElligibleUsers(dateCap);
        const fetchMatchCountResults = await fetchMatchCount();
        const nextUser = elligibleUserList.data[0];
        if((currentMatches.length===0 && !nextUser)||(currentMatches.length===0 && matchCompletionQueue.length===0 && simIsRunning)){
          console.log("INSIDE GEN MATCHES AT COMPLETE MATCH CONDITION")
          simCompletionHandler()
        }
        console.log("INSIDE GEN MATCHES AT GEN MATCH CONDITION")
          const updatedCurrentMatchResults = await createMatch(nextUser.id, dateCap)
          const updatedCurrentMatchCountData = fetchMatchCountResults.data.currentMatchesCount[0].current_match_count;
          const updatedOccupiedPodCountData = podsCountResults.data.occupiedPodCount[0].occupied_pod_count
          const updatedActiveMatchesData = updatedCurrentMatchResults.data;
          console.log("updatedActiveMatchesData:  ", updatedActiveMatchesData)
          setCurrentMatches(updatedActiveMatchesData)
          console.log("occupiedPodCount:  ",  podsCountResults.data.occupiedPodCount[0])
          console.log("availablePodCount:  ",  podsCountResults.data.availablePodCount[0])
          console.log("currentMatchesCount:  ", fetchMatchCountResults.data.currentMatchesCount[0])
          console.log("completedMatchesCount:  ", fetchMatchCountResults.data.completedMatchesCount[0])
          console.log("totalMatchesCount:  ", fetchMatchCountResults.data.totalMatchesCount[0])
          console.log("DID IT WORK:  ", updatedCurrentMatchCountData >= (updatedOccupiedPodCountData/2))
          await updatePodCount()
          await updateUserCount()
          await tempUpdateMatchCount(updatedCurrentMatchCountData)
          setIsLoading(false)
    }
    catch(err){
      console.log("ERROR:  ", err)
    }
  }

  const resetHandler = async ()=>{
    try{
      setIsLoading(true)
        await deleteMatches()
        await simResetHandler()
        const fetchMatchCountResults = await fetchMatchCount();
        console.log("INSIDE RESET MATCH")
          const updatedCurrentMatchResults = await fetchActiveMatches()
          const updatedCurrentMatchCountData = fetchMatchCountResults.data.currentMatchesCount[0].current_match_count;
          const updatedActiveMatchesData = updatedCurrentMatchResults.data;
          console.log("updatedActiveMatchesData:  ", updatedActiveMatchesData)
          setCurrentMatches(updatedActiveMatchesData)
          await updateUserCount()
          tempUpdateMatchCount(updatedCurrentMatchCountData)
          setIsLoading(false)
    }
    catch(err){
      console.log("ERROR:  ", err)
    }
  }

  return (
    <div className="matchmaker-tab">
      <MatchToolBox simIsPaused={simIsPaused} pauseSimulation={pauseSimulation} simIsRunning={simIsRunning} runSimulation={runSimulation}  />
      <div className="matchmaker-buttonbox" styles={{display:"flex", flexDirection:"row"}}>
            <Button onClick={()=>generateMatchHandler()} >
            {( podCount===0 ? "CURRENTLY NO PODS EXIST": currentMatches.length === Math.floor(podCount/2)) ? "PODS ARE FULL" :" GENERATE MATCH"}
            </Button>
            <Button onClick={()=>addMatchToCompletionQueue()} >
              ADD MATCH to COMPLETION QUEUE
            </Button>
            <Button onClick={completeMatchInQueue} >
              COMPLETE MATCH
            </Button>
            <Button onClick={fetchMatches} >
              ShowMatches
            </Button>
            <Button onClick={resetHandler} >
              RESET MATCHES
            </Button>
        </div>
        <div className ="matchmaker-infobox">
            <p>
              To
            </p>
            <p>
              To
            </p>
            <p>
              To
            </p>
            <p>
              To
            </p>
            <p>
              To
            </p>
            <p>
              To
            </p>
        </div>
      <div className="matches-container">
          {matchCompletionQueue.map((completedMatch, index)=>{
            return (<div key={index}>{completedMatch.id}</div>)})}
        <div className="stats-container">
          {
          simIsComplete ?
          <SimulationResults dateCount={dateCap}/>:
          <MatchTable
            simIsRunning={simIsRunning}
            simIsPaused={simIsPaused}
            matches={currentMatches}
            dateDuration={dateDuration}
            dateCompletionHandler={dateCompletionHandler}
          />
          }
        </div>
      </div>
    </div>
  );
};

export default Matchmaker;