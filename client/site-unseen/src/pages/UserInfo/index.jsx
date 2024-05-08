/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './styles.css';
/* COMPONENTS */
import UserTile from "../../components/UserTile";
import UserGenerationTools from "../../components/UserGenerationTool";
import PodManagementTools from "../../components/PodManagmentTool"
/* API */
import { fetchUsers, deleteUser } from "../../api/users";
import { fetchPods } from "../../api/pods";

const UserInfo = ({podCount})=>{
  const [users, setUsers] = useState([]);
  const [pods, setPods] = useState([]);
  useEffect(()=>{
    async function startFetching() {
      try{
      const userResults = await fetchUsers();
      const podResults = await fetchPods();
      if (!ignore) {
        const usersUpdate = userResults.data;
        const podsUpdate = podResults.data;
        setUsers(usersUpdate);
        setPods(podsUpdate);
      }
    }
    catch(err){
      console.log("INITIAL LOAD FAILED:  ", err)
    }
  }
    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [])

  const removeUserHandler = async (id) => {
    await deleteUser(id);
    let updatedUsers = users.filter((user)=>(user.id!==id));
    setUsers(updatedUsers)
  }

  return (
    <div className="userinfo-tab">
      <div className="userinfo-column">
        <div className="userinfo-column_header">
          <h5>{users.length ? `${users.length} USERS` : " NO USERS"} </h5>
        </div>
        <div className="userinfo-column-body">
        {users?.length && users.map(user=><UserTile key={user.id} userData={user} removeUser={removeUserHandler}/>)}
        </div>
      </div>
      <div className="userinfo-column">
      <div className="userinfo-column_header">
          <h5>Tools</h5>
        </div>
        <div className="userinfo-column-body">
          <UserGenerationTools users={users} pods={pods} podCount={podCount} />
          <PodManagementTools pods={pods} />
        </div>
      </div>
    </div>
  );
}

export default UserInfo;