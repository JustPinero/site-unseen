/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
import WaitListTable from '../../../components/WaitListTable';
import SimulationDurationTracker from "../../../components/SimulationDurationTracker";


const MatchToolBox = ({ roundCount, waitList, simIsRunning, runSimulation, addMatch})=>{

    return(
        <div className="matchtools-container">
            <div>
                <Button disabled={simIsRunning} style={{margin:"6px"}} onClick={runSimulation}>
                    {simIsRunning ? "SIMULATION IN PROGRESS" :  "START EVENT SIMULATION"}
                </Button>
                {
                    simIsRunning ?
                <Button onClick={()=>{} }>
                    CANCEL SIMULATION
                </Button>
                : null
                }
            </div>
                <p>{roundCount} ROUNDS</p>
                <SimulationDurationTracker simIsRunning={simIsRunning} />
            <div>
            </div>
            {/* <div className="waitlist-table-container">
                {waitList.length && <WaitListTable waitList={waitList}/>}
            </div> */}
        </div>
    )
}

export default MatchToolBox;