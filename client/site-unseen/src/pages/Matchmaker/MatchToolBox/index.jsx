/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
import SimulationDurationTracker from "../../../components/SimulationDurationTracker";


const MatchToolBox = ({ pauseSimulation, roundCount, simIsRunning, runSimulation, addMatch})=>{

    return(
        <div className="matchtools-container">
            <div>
                <Button disabled={simIsRunning} style={{margin:"6px"}} onClick={runSimulation}>
                    {simIsRunning ? "SIMULATION IN PROGRESS" :  "START EVENT SIMULATION"}
                </Button>
                {
                    simIsRunning ?
                    <>
                <Button onClick={pauseSimulation }>
                    PAUSE SIMULATION
                </Button>
                <Button onClick={()=>{} }>
                    CANCEL SIMULATION
                </Button>
                </>
                : null
                }
            </div>
                <p>{roundCount} ROUNDS</p>
                <SimulationDurationTracker simIsRunning={simIsRunning} />
            <div>
            </div>
        </div>
    )
}

export default MatchToolBox;