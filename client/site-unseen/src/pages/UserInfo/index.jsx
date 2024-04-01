/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './styles.css';
/* COMPONENTS */
import UserTile from "../../components/UserTile";


const UserInfo = ({})=>{
 
  return (
    <div>
        USER INFO

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