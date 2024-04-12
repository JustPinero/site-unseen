/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
import WaitListTable from '../../../components/WaitListTable';


const MatchToolBox = ({ waitList, matchMakingHandler, addMatch, addUserButtonClickHandler})=>{
    console.log("TOOL BOX RENDERING WITH THIS DATA:  ", waitList)
    return(
        <div className="matchtools-container">
            <div>
                <Button style={{margin:"6px"}} onClick={matchMakingHandler}>
                    START MATCHING ROUND
                </Button>
                <Button onClick={addUserButtonClickHandler }>
                    ADD NEW MATCH
                </Button>
            </div>
            <div className="waitlist-table-container">
                {waitList.length && <WaitListTable waitList={waitList}/>}
            </div>
        </div>
    )
}

export default MatchToolBox;