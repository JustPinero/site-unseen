/* BOOTSTRAP COMPONENTS */
import Table from 'react-bootstrap/Table';
/* COMPONENTS */
import UserTableRow from "./UserTableRow";

const UsersTable = ({users})=>{
    return(
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>USER ID</th>
                <th>USER NAME</th>
                {/* <th>Date Count</th> */}
                <th>STATUS</th>
            </tr>
        </thead>
        <tbody>
            {users?.map((waitLister)=><UserTableRow key={waitLister.id} userData={waitLister}/>)}
        </tbody>
    </Table>
    )
}

export default UsersTable;