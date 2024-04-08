/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './styles.css';
/* COMPONENTS */
import UserTile from "../../components/UserTile";
import MatchPodOption from "../../components/MatchBox/MatchHalf/MatchPodOption";
import UserGenerationTools from "../../components/UserGenerationTool";


const UserInfo = ({users, pods, matches, updateUsers, addUser, addUsers})=>{
  return (
    <div className="userinfo-tab">
      <div className="userinfo-column">
        <div className="userinfo-column_header">
          <h5>USERS</h5>
        </div>
        <div className="userinfo-column-body">
        {users?.length && users.map(user=><UserTile key={user.id} userData={user}/>)}
        </div>
      </div>
      <div className="userinfo-column">
      <div className="userinfo-column_header">
          <h5>Tools</h5>
        </div>
        <div className="userinfo-column-body">
          <UserGenerationTools users={users} updateUsers={updateUsers} addUser={addUser} addUsers={addUsers}/>
        </div>
      </div>
      <div className="userinfo-column">
        <div className="userinfo-column_header">
          <h5>PODS</h5>
        </div>
        <div className="userinfo-column-body userinfo-pod-map ">
        {pods?.length && pods.map(pod=><MatchPodOption key={pod.id} podData={pod}/>)}
      </div>
      </div>
    </div>
  );
}

export default UserInfo;