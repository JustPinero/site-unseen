/* REACT */
import {useState, useEffect} from "react"
/* STYLES */
import './styles.css';
/* BOOTSTRAP COMPONENTS */
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
/* COMPONENTS */
import MatchBox from "../../components/MatchBox";


const Matchmaker = ({users, pods, matches, addMatch, removeMatch, updateMatch, updatePods, updateUsers, completeDate, cancelMatch})=>{
  return (
    <div className="matchmaker-tab">
        <Button onClick={addMatch}>
            ADD NEW MATCH
        </Button>
        <div className="matches-container">
       {
        matches.length ?
        matches.map((match)=>{
            return <MatchBox key={match.id} users={users} pods={pods} matchData={match} removeMatch={removeMatch} updateMatch={updateMatch} updatePods={updatePods} updateUsers={updateUsers} completeDate={completeDate} cancelMatch={cancelMatch}/>
        })
        : null
        }
    </div>
    </div>
  );
}

export default Matchmaker;
