import {useState, useEffect} from "react"
import heartso from './assets/heartso.png';
import './App.css';
import fetchUsers from "./api";

function App() {
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  useEffect(()=>{
    console.log("broken")
    fetch('localhost:3001/api/browsing/userlists')
      .then((res) => {
      return res.json();
    })
      .then((data) => {
          console.log(data);
          return data
      });

  },[])
  return (
    <div className="App">
      <div className="matchmaker-container">
        <div className="userlist-container">
          {users}
        </div>
      <div>
       <img src={heartso}/>
      </div>
      <div className="matchlist-container">

      </div>
      </div>
    </div>
  );
}

export default App;
