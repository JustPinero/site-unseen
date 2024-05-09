/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
import SimulationDurationTracker from "../../../components/SimulationDurationTracker";


const MatchToolBox = ({ simIsPaused, pauseSimulation, roundCount, simIsRunning, runSimulation, addMatch})=>{

    return(
        <div className="matchtools-container">
            <div>
                {!simIsRunning ?
                <Button disabled={simIsRunning} style={{margin:"6px"}} onClick={runSimulation}>
                  START EVENT SIMULATION
                </Button>
                : " SIMULATION IN PROGRESS          "
                }
                {
                    simIsRunning ?
                    <>
                <Button onClick={pauseSimulation }>
                    PAUSE SIMULATION
                </Button>
                </>
                : null
                }
            </div>
                <SimulationDurationTracker simIsRunning={simIsRunning} />
            <div>
            </div>
        </div>
    )
}

export default MatchToolBox;