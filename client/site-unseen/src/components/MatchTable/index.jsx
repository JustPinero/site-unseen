/* BOOTSTRAP COMPONENTS */
import Table from 'react-bootstrap/Table';
/* COMPONENTS */
import MatchTableRow from "./MatchTableRow"


const MatchTable = ({matches, dateLength})=>{
    console.log("MATCH TABLE MATCHES:  ", matches)
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
            {matches?.map((match)=><MatchTableRow key={match.id} matchData={match} dateLength={dateLength}/>)}
        </tbody>
    </Table>
    )
}

export default MatchTable;