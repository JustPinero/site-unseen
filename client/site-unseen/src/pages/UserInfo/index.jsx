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

const UserInfo = ({ users, podCount, userDeleteHandler})=>{
  const [pods, setPods] = useState([]);
  const [userList, setuserList] =useState([])
  useEffect(()=>{
    async function startFetching() {
      try{
      const podResults = await fetchPods();
      const usersResults = await fetchUsers();
      if (!ignore) {
        const podsUpdate = podResults.data;
        const usersUpdate= usersResults.data
        setPods(podsUpdate);
        setuserList(usersUpdate)
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
  }, [users])

  const removeUserHandler = async (id) => {
    await userDeleteHandler(id);
  }
console.log("USERS:  ", userList)
  return (
    <div className="userinfo-tab">
      <div className="userinfo-column">
        <div className="userinfo-column_header">
          <h5>{users.length ? `${users.length} USERS` : " NO USERS"} </h5>
        </div>
        <div className="userinfo-column-body">
        {userList.length ? userList.map(user=><UserTile key={user.id} userData={user} removeUser={removeUserHandler}/>): null}
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