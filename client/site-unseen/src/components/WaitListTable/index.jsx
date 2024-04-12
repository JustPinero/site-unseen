/* BOOTSTRAP COMPONENTS */
import Table from 'react-bootstrap/Table';
/* COMPONENTS */
import WaitlistTableRow from "./WaitListTableRow";

const WaitListTable = ({waitList})=>{
    console.log("WAIT LIST TABLE RENDERING WITH THIS DATA:  ", waitList)
    return(
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>USER ID</th>
                <th>USER NAME</th>
                <th>Date Count</th>
                <th>STATUS</th>
            </tr>
        </thead>
        <tbody>
            {waitList?.map((waitLister)=><WaitlistTableRow key={waitLister.id} userData={waitLister}/>)}
        </tbody>
    </Table>
    )
}

export default WaitListTable;