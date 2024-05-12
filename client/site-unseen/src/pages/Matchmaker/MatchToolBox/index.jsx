/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
import SimulationDurationTracker from "../../../components/SimulationDurationTracker";


const MatchToolBox = ({sessionDuration, simulationPauseHandler, simIsRunning, runSimulation})=>{

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
                <Button onClick={simulationPauseHandler }>
                    PAUSE SIMULATION
                </Button>
                </>
                : null
                }
            </div>
                <SimulationDurationTracker sessionDuration={sessionDuration} />
            <div>
            </div>
        </div>
    )
}

export default MatchToolBox;