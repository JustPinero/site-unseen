/* BOOTSTRAP COMPONENTS */
import Table from 'react-bootstrap/Table';
/* COMPONENTS */
import MatchTableRow from "./MatchTableRow"


const MatchTable = ({
    matches,
    simIsRunning,
    simIsPaused,
    dateCompletionHandler,
    dateDuration,
    bufferDuration,
    })=>{
    return(
    <Table striped bordered hover>
        <thead style={{position: "sticky", top: 0}}>
            <tr>
                <th>USER NAME</th>
                <th>USER AGE</th>
                <th>USER GENDER</th>
                <th>USER POD </th>
                <th>MATCH NAME</th>
                <th>MATCH AGE</th>
                <th>MATCH GENDER</th>
                <th>MATCH POD </th>
                <th>STATUS</th>
                <th>REMAINING TIME</th>
            </tr>
        </thead>
        <tbody>
            {matches?.map((match)=>{
                return match.id && <MatchTableRow key={match.id} simIsRunning={simIsRunning} simIsPaused={simIsPaused} dateDuration={dateDuration} bufferDuration={bufferDuration} matchData={match}  dateCompletionHandler={dateCompletionHandler} />}
            )}
        </tbody>
    </Table>
    )
}

export default MatchTable;