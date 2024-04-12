/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
import WaitListTable from '../../../components/WaitListTable';
import SimulationDurationTracker from "../../../components/SimulationDurationTracker";


const MatchToolBox = ({ waitList, simIsRunning, runSimulation, addMatch, addUserButtonClickHandler})=>{

    return(
        <div className="matchtools-container">
            <div>
                <Button disabled={simIsRunning} style={{margin:"6px"}} onClick={runSimulation}>
                    {simIsRunning ? "SIMULATION IN PROGRESS" :  "START EVENT SIMULATION"}
                </Button>
                {
                    simIsRunning ?
                <Button onClick={addUserButtonClickHandler }>
                    CANCEL SIMULATION
                </Button>
                : null
                }
            </div>
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