import {useState, useEffect} from "react"
import './App.css';
import fetchUsers from "./api";
/* COMPONENTS */
import HeartShapedBox from "./components/HeartShapedBox";
import UserTile from "./components/UserTile";

function App() {
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:3001/api/browsing/userlists')
.then((res) => {
  return res.json();
})
.then((data) => {
    console.log("USER DATA:  ", data);
    const {users} = data;
    const {rows} = users;
    const updatedUserData = rows
    console.log("USER DATA FORMATTED:  ", updatedUserData)
    setUsers(updatedUserData)
});
  },[])
  return (
    <div className="App">
      <div className="matchmaker-container">
        <div className="userlist-container">
          {users.map((user)=>{
          return <UserTile userData={user} />
          })
          }
        </div>
        <HeartShapedBox/>
      <div className="matchlist-container">

      </div>
      </div>
    </div>
  );
}

export default App;
