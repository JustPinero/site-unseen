/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
import WaitListTable from '../../../components/WaitListTable';


const MatchToolBox = ({waitlist, matchMakingHandler, addMatch})=>{
    return(
        <div className="matchtools-container">
            <div>
                <Button style={{margin:"6px"}} onClick={matchMakingHandler}>
                    START MATCHING ROUND
                </Button>
                <Button onClick={addMatch }>
                    ADD NEW MATCH
                </Button>
            </div>
            <div>
                <WaitListTable waitlist={waitlist}/>
            </div>
        </div>
    )
}

export default MatchToolBox;