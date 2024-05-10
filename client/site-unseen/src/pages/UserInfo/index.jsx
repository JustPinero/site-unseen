/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './styles.css';
/* COMPONENTS */
import UserTile from "../../components/UserTile";
import UserGenerationTools from "../../components/UserGenerationTool";
import PodManagementTools from "../../components/PodManagmentTool"
import { fetchPods } from "../../api/pods";

const UserInfo = ({ users, podCount, userDeleteHandler, userUpdateHandler, podCountUpdateHandler})=>{
  const pods = []

  const removeUserHandler = async (id) => {
    try{
    await userDeleteHandler(id);
    await userUpdateHandler()
    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div className="userinfo-tab">
      <div className="userinfo-column">
        <div className="userinfo-column_header">
          <h5>{users.length ? `${users.length} USERS` : " NO USERS"} </h5>
        </div>
        <div className="userinfo-column-body">
        {users?.length ? users.map(user=><UserTile key={user.id} userData={user} removeUserHandler={removeUserHandler}/>): null}
        </div>
      </div>
      <div className="userinfo-column">
      <div className="userinfo-column_header">
          <h5>Tools</h5>
        </div>
        <div className="userinfo-column-body">
          <UserGenerationTools users={users} pods={pods} podCount={podCount} />
          <PodManagementTools podCountUpdateHandler={podCountUpdateHandler} pods={pods} podCount={podCount} />
        </div>
      </div>
    </div>
  );
}

export default UserInfo;