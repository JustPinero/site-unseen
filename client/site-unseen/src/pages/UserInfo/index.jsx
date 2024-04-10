/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './styles.css';
/* COMPONENTS */
import UserTile from "../../components/UserTile";
import UserGenerationTools from "../../components/UserGenerationTool";


const UserInfo = ({users, pods, matches, updateUsers, addUser, addUsers, clearUsers, updateUser, removeUser})=>{
  return (
    <div className="userinfo-tab">
      <div className="userinfo-column">
        <div className="userinfo-column_header">
          <h5>{users.length ? `${users.length} ACTIVE USERS` : " NO USERS"} </h5>
        </div>
        <div className="userinfo-column-body">
        {users?.length && users.map(user=><UserTile key={user.id} userData={user} removeUser={removeUser}/>)}
        </div>
      </div>
      <div className="userinfo-column">
      <div className="userinfo-column_header">
          <h5>Tools</h5>
        </div>
        <div className="userinfo-column-body">
          <UserGenerationTools users={users} updateUsers={updateUsers} addUser={addUser} addUsers={addUsers} clearUsers={clearUsers}/>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;