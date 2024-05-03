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
import {fetchMatchesByStatus, createMatch, completeMatch } from "../../api/matches";

const Matchmaker = ({
  increaseMatchCount,
  simIsPaused,
  pauseSimulation,
  simIsComplete,
  simIsRunning,
  simulationStartHandler,
  dateDuration,
  bufferDuration,
  users,
  podCount,
  dateCap
}) => {
  /* LOCAL STATE */
  /* MATCHLIST */
  const [currentMatches, setCurrentMatches] = useState([])


  useEffect(()=>{
    async function makeMatch() {
      if(users){
      const nextUser=users[0];
      if(nextUser){
        if(currentMatches.length<(podCount/2)){
          const newMatch = await createMatch( nextUser.id, dateCap);
        }
      const matchesResults = await fetchMatchesByStatus("inProgress");
      if (!ignore) {
        console.log(matchesResults.data);
        let updatedCurrentMatchesData = matchesResults.data;
        setCurrentMatches(updatedCurrentMatchesData)
      }
    }
  }
  }
    let ignore = false;
    makeMatch();
    return () => {
      ignore = true;
    }
  },[users])

  useEffect(()=>{
    async function makeMatch() {
      if(currentMatches.length<(podCount/2) && simIsRunning){
        const userResults = fetchElligibleUsers(dateCap)
      const nextUser=userResults.data[0];
      if(nextUser){
        increaseMatchCount()
        await createMatch( nextUser.id, dateCap);
      const matchesResults = await fetchMatchesByStatus("inProgress");
      if (!ignore) {
        console.log(matchesResults.data);
        let updatedCurrentMatchesData = matchesResults.data;
        setCurrentMatches(updatedCurrentMatchesData)
      }
    }
  }
  }
    let ignore = false;
    makeMatch();
    return () => {
      ignore = true;
    }
  },[])






  const runSimulation = () => {
    simulationStartHandler()
  };
  const dateCompletionHandler = async (id, matchData)=> {
    try{
      console.log("id: ", id, "matchData:  ", matchData)
      await completeMatch(id, matchData);
      const updatedCurrentMatches = currentMatches.filter((match)=>(id!==match.id))
      setCurrentMatches(updatedCurrentMatches)
      increaseMatchCount()
    }
    catch(err){
      console.log("ERROR:", err)
    }
  }
  return (
    <div className="matchmaker-tab">
      <MatchToolBox pauseSimulation={pauseSimulation} simIsRunning={simIsRunning} runSimulation={runSimulation} waitList={users}  />
      <div className="matches-container">
        {
        simIsComplete ?
        <SimulationResults/>:
        <MatchTable
          simIsRunning={simIsRunning}
          simIsPaused={simIsPaused}
          matches={currentMatches}
          dateDuration={dateDuration}
          bufferDuration={bufferDuration}
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
