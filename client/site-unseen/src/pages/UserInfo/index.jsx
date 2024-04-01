/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './styles.css';
/* COMPONENTS */
import UserTile from "../../components/UserTile";
import MatchPodOption from "../../components/MatchBox/MatchHalf/MatchPodOption";
import UserGenerationTools from "../../components/UserGenerationTool";


const UserInfo = ({users, pods, matches, updateUsers})=>{
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
          <UserGenerationTools updateUsers={updateUsers}/>
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
//     <div className="matchmaker-tab">
//         <div className="matchmaker-container">
// <div className="userlist-container">
//   {users.map((user)=>{
//   return <UserTile key={user.id} userData={user} clickFunction={()=>userSelectionHandler(user)} />
//   })
//   }
// </div>
// <div className="userlist-container">
//   {selectedUser ?
//     matches.length ?
//     matches.map(match=>(
//       <UserTile key={match.id} userData={match} clickFunction={()=>matchSelectionHandler(match)} />
//     ))
//     :
//     <p>NO MATCHES FOUND</p>
//     :
//     null
// }
// </div>
// </div>
//     </div>
  );
}

export default UserInfo;