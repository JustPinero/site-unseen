/* BOOTSTRAP COMPONENTS */
import Table from 'react-bootstrap/Table';
/* COMPONENTS */
import MatchTableRow from "./MatchTableRow"


const MatchTable = ({matches,  dateCompletionHandler,
    dateDuration,
    bufferDuration,
    deleteMatch})=>{
    return(
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>MATCH ID</th>
                <th>USER 1 ID</th>
                <th>USER 1 NAME</th>
                <th>POD 1</th>
                <th>USER 2 ID</th>
                <th>USER 2 NAME</th>
                <th>POD 2</th>
                <th>STATUS</th>
                <th>REMAINING TIME</th>
            </tr>
        </thead>
        <tbody>
            {matches?.map((match)=><MatchTableRow key={match.id} dateDuration={dateDuration} bufferDuration={bufferDuration} matchData={match}  dateCompletionHandler={dateCompletionHandler} deleteMatch={deleteMatch}/>)}
        </tbody>
    </Table>
    )
}

export default MatchTable;