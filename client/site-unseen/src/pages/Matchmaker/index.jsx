/* STYLES */
import "./styles.css";
/* BOOTSTRAP COMPONENTS */
// import Modal from "react-bootstrap/Modal";
/* COMPONENTS */
import MatchTable from "../../components/MatchTable";
import MatchToolBox from "./MatchToolBox";
import SimulationResults from "./SimulationResults"
/* API */
import Button from "react-bootstrap/esm/Button";

const Matchmaker = ({
  matchesInProgress,
  simResultsData,
  sessionDuration,
  simIsPaused,
  simIsComplete,
  simIsRunning,
  dateDuration,
  dateMin,
  dateMax,
  simulationPauseHandler,
  simulationRunHandler,
  simResetHandler
}) => {
  const runSimulation = () => {
    console.log("AM I STARTING")
    simulationRunHandler()
  };


  return (
    <div className="matchmaker-tab">
      <MatchToolBox  sessionDuration={sessionDuration} simulationPauseHandler={simulationPauseHandler} simIsRunning={simIsRunning} runSimulation={runSimulation}  />
      <div className="matchmaker-buttonbox" styles={{display:"flex", flexDirection:"row"}}>
            {/* <Button onClick={()=>generateMatchHandler()} >
            {( totalPodCount===0 ? "CURRENTLY NO PODS EXIST": matchesInProgress.length === Math.floor(totalPodCount/2)) ? "PODS ARE FULL" :" GENERATE MATCH"}
            </Button> */}
            {/* <Button onClick={()=>addMatchToCompletionQueueButtonClickHandler()} >
              ADD MATCH to COMPLETION QUEUE
            </Button> */}
            {/* <Button onClick={showStateAsIs} >
              GET MATCHES FROM BACKEND
            </Button> */}
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
          (simResultsData && <SimulationResults simResultsData={simResultsData} dateMin={dateMin} dateMax={dateMax}/>):
          <MatchTable
            simIsRunning={simIsRunning}
            simIsPaused={simIsPaused}
            matches={matchesInProgress}
            dateDuration={dateDuration}
          />
          }
        </div>
      </div>
    </div>
  );
};

export default Matchmaker;