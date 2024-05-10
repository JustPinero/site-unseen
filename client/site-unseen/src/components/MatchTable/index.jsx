/* BOOTSTRAP COMPONENTS */
import Table from 'react-bootstrap/Table';
/* COMPONENTS */
import MatchTableRow from "./MatchTableRow"


const MatchTable = ({
    matches,
    simIsRunning,
    simIsPaused,
    dateDuration
    })=>{
    return(
    <Table striped bordered hover>
        <thead style={{position: "sticky", top: 0}}>
            <tr>
                <th>USER NAME</th>
                <th>USER AGE</th>
                <th>USER GENDER</th>
                <th>USER DATE COUNT</th>
                <th>USER POD </th>
                <th>MATCH NAME</th>
                <th>MATCH AGE</th>
                <th>MATCH GENDER</th>
                <th>MATCH DATE COUNT</th>
                <th>MATCH POD </th>
                <th>STATUS</th>
                <th>TIME LEFT</th>
            </tr>
        </thead>
        <tbody>
            {matches?.map((match)=>{
                return match && <MatchTableRow key={match.id} simIsRunning={simIsRunning} simIsPaused={simIsPaused} matchData={match} dateDuration={dateDuration} />}
            )}
        </tbody>
    </Table>
    )
}

export default MatchTable;