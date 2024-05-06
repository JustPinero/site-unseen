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
import { fetchActiveMatches, createMatch, completeMatch } from "../../api/matches";
import Button from "react-bootstrap/esm/Button";

const Matchmaker = ({
  increaseMatchCount,
  simIsPaused,
  pauseSimulation,
  simIsComplete,
  simIsRunning,
  simulationStartHandler,
  dateDuration,
  podCount,
  dateCap
}) => {
  /* LOCAL STATE */
  /* MATCHLIST */
  const [users, setUsers] = useState([]);
  const [currentMatches, setCurrentMatches] = useState([]);
  const [matchCompletionQueue, setMatchCompletionQueue] = useState([]);

  let matchLimit = Math.floor(podCount/2)
  const podsAreFull = currentMatches >= matchLimit
  console.log("podsAreFull:  ", podsAreFull)

  useEffect(()=>{
    async function updateMatches() {
      try{
        const matchesResults = await fetchActiveMatches();
        if (!ignore) {
          console.log("matchesResults:  ", matchesResults.data);
          let updatedCurrentMatchesData = matchesResults.data;
          setCurrentMatches(updatedCurrentMatchesData)
        }
      }
      catch(err){
        console.log("ERROR:  ", err)
      }
    }
    let ignore = false;
    updateMatches();
    return () => {
      ignore = true;
    }
  },[])

  useEffect(()=>{
    console.log("CURRENT MATCHES: ", currentMatches)
    if(!podsAreFull){
      console.log("pods are not full:  ", podsAreFull)
      console.log("GENERATING NEW MATCH")
      generateMatchHandler()
    } else{
      console.log("pods are full:  ", podsAreFull)
    }
//     async function updateUsers() {
//       try{
//         const userResults = await fetchElligibleUsers(dateCap);
//         const nextUser=userResults.data[0];
//         console.log("nextUser:  ", nextUser)
//         if(nextUser){
//           increaseMatchCount()
//           await createMatch( nextUser.id, dateCap);
//         if (!ignore) {
//           let updatedUserData = userResults.data;
//           console.log("updatedUserData:  ", updatedUserData.data);
//           setUsers(updatedUserData)
//         }
//     }
//   }
// catch(err){
//   console.log("ERROR:  ", )
// }
//   }
//     let ignore = false;
//     updateUsers();
//     return () => {
//       ignore = true;
//     }
  },[currentMatches])


  useEffect(()=>{
    console.log("COMPLETING MATCHES: ", matchCompletionQueue)
    if(matchCompletionQueue.length){
      // completeMatchInQueue()
    } else{

    }
//     async function updateUsers() {
//       try{
//         const userResults = await fetchElligibleUsers(dateCap);
//         const nextUser=userResults.data[0];
//         console.log("nextUser:  ", nextUser)
//         if(nextUser){
//           increaseMatchCount()
//           await createMatch( nextUser.id, dateCap);
//         if (!ignore) {
//           let updatedUserData = userResults.data;
//           console.log("updatedUserData:  ", updatedUserData.data);
//           setUsers(updatedUserData)
//         }
//     }
//   }
// catch(err){
//   console.log("ERROR:  ", )
// }
//   }
//     let ignore = false;
//     updateUsers();
//     return () => {
//       ignore = true;
//     }
  },[matchCompletionQueue, currentMatches])



  const runSimulation = () => {
    simulationStartHandler()
  };

  const fetchMatches = async ()=> {
    try{
      const activeMatches = await fetchActiveMatches()
      console.log("ACTIVE MATCHES:  ", activeMatches.data)
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
      console.log("nextCompletedMatch:", nextCompletedMatch)
      const updatedCompletionQueue = matchCompletionQueue.filter(completedMatch=>(nextCompletedMatch.id !== completedMatch.id))
      console.log("updatedCompletionQueue:", updatedCompletionQueue)
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
      console.log("nextCompletingMatch:", nextCompletingMatch)
      const updatedCurrentMatches = currentMatches.filter((match)=>(nextCompletingMatch.id!==match.id))
      setCurrentMatches(updatedCurrentMatches)
      let updatedCompletionQueue = [...matchCompletionQueue, nextCompletingMatch];
      setMatchCompletionQueue(updatedCompletionQueue)
      }
    }
  catch(err){
    console.log("ERROR:  ", err)
  }
}

  const dateCompletionHandler = async (matchData)=> {
    try{
      increaseMatchCount()
      addMatchToCompletionQueue(matchData)
    }
    catch(err){
      console.log("ERROR:", err)
    }
  }
  const generateMatchHandler = async ()=>{
    try{
    console.log("CURRENT MATCHES: ", currentMatches.length)
    console.log("arePodsFull: ", podsAreFull)

      if(!podsAreFull){
        const elligibleUserList = await fetchElligibleUsers(dateCap);
        console.log("MATCH HANDLER")
        console.log("elligibleUserList:  ", elligibleUserList)
        const nextUser = elligibleUserList.data[0];
        console.log("NEXT USER:  ", nextUser)
        await createMatch(nextUser.id)
      }
    }
    catch(err){
      console.log("ERROR:  ", err)
    }
  }

  return (
    <div className="matchmaker-tab">
      <MatchToolBox simIsPaused={simIsPaused} pauseSimulation={pauseSimulation} simIsRunning={simIsRunning} runSimulation={runSimulation} waitList={users}  />
      <div className="matches-container">
        <div styles={{display:"flex", flexDirection:"row"}}>
          <Button onClick={()=>generateMatchHandler()} >
          {podsAreFull ? "PODS ARE FULL" :" GENERATE MATCH"}
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
      </div>
      <div>
        {matchCompletionQueue.map((completedMatch, index)=>{
          console.log("COMPLETED MATCH:  ", completedMatch)
          return (<div key={index}>{completedMatch.id}</div>)})}
      </div>
        {
        simIsComplete ?
        <SimulationResults/>:
        <MatchTable
          simIsRunning={simIsRunning}
          simIsPaused={simIsPaused}
          matches={currentMatches}
          dateDuration={dateDuration}
          dateCompletionHandler={dateCompletionHandler}
        />
        }
      </div>
      <div className="demographic-tables-container">

      </div>
    </div>
  );
};

export default Matchmaker;
