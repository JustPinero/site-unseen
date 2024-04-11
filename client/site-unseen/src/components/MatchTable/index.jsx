/* BOOTSTRAP COMPONENTS */
import Table from 'react-bootstrap/Table';
/* COMPONENTS */
import MatchTableRow from "./MatchTableRow"


const MatchTable = ({matches})=>{
    return(
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>MATCH ID</th>
                <th>USER 1</th>
                <th>POD 1</th>
                <th>USER 2</th>
                <th>POD 2</th>
                <th>Remaining Time</th>
            </tr>
        </thead>
        <tbody>
            {matches.length ? matches.maps((match)=><MatchTableRow key={match.id}/>) : null}
        </tbody>
    </Table>
    )
}

export default MatchTable;