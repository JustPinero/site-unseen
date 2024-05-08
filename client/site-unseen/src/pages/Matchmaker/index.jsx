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
import {fetchUsers, fetchElligibleUsers, } from "../../api/users";
import { fetchActiveMatches, createMatch, completeMatch, deleteMatches } from "../../api/matches";
import Button from "react-bootstrap/esm/Button";

const Matchmaker = ({
  simCompletionHandler,
  simIsPaused,
  pauseSimulation,
  simIsComplete,
  simIsRunning,
  simulationStartHandler,
  dateDuration,
  podCount,
  dateCap,
  updateMatchCount
}) => {
  /* LOCAL STATE */
  /* MATCHLIST */
  const [currentMatches, setCurrentMatches] = useState([]);
  const [matchCompletionQueue, setMatchCompletionQueue] = useState([]);

  let LOADING =false

  useEffect(()=>{
    async function updateStatus() {
      try{
        if(!LOADING){
          LOADING = true
          const updatedActiveMatchesResults = await fetchActiveMatches();
          const updatedActiveMatchesData = updatedActiveMatchesResults.data;
          const elligibleUserList = await fetchElligibleUsers(dateCap);
          const nextUser = elligibleUserList.data[0];
          if(updatedActiveMatchesData.length===0 && matchCompletionQueue.length===0 && simIsRunning){
            simCompletionHandler()
          }else{
            setCurrentMatches(updatedActiveMatchesData)
          }
        LOADING = false;
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
        if(!LOADING){
          LOADING = true;
          await completeMatchInQueue()
          await updateMatchCount()
          LOADING = false;
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
            if(!LOADING){
              LOADING = true
                await generateMatchHandler()
            }
            LOADING = false;
          }
        }
          catch(err){
            console.log("ERROR:  ", err)
          }
        }
    let matchLimit = Math.floor(podCount/2)
    console.log("MATCH LIMIT:  ", matchLimit)
    if(currentMatches.length<=matchLimit){
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
        const elligibleUserList = await fetchElligibleUsers(dateCap);
        const nextUser = elligibleUserList.data[0];
        if((currentMatches.length===0 && !nextUser)||(currentMatches.length===0 && matchCompletionQueue.length===0 && simIsRunning)){
          simCompletionHandler()
        }
          await createMatch(nextUser.id, dateCap)
          const updatedActiveMatchesResults = await fetchActiveMatches();
          const updatedActiveMatchesData = updatedActiveMatchesResults.data;
          setCurrentMatches(updatedActiveMatchesData)
    }
    catch(err){
      console.log("ERROR:  ", err)
    }
  }

  return (
    <div className="matchmaker-tab">
      <MatchToolBox simIsPaused={simIsPaused} pauseSimulation={pauseSimulation} simIsRunning={simIsRunning} runSimulation={runSimulation}  />
      <div className="matches-container">
        <div styles={{display:"flex", flexDirection:"row"}}>
          <Button onClick={()=>generateMatchHandler()} >
          {( currentMatches.length >= Math.floor(podCount/2)) ? "PODS ARE FULL" :" GENERATE MATCH"}
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
          <Button onClick={()=>deleteMatches()} >
            RESET MATCHES
          </Button>
      </div>
      <div>
        {matchCompletionQueue.map((completedMatch, index)=>{
          return (<div key={index}>{completedMatch.id}</div>)})}
      </div>
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