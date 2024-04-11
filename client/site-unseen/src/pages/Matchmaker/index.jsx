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
import MatchTable from "../../components/MatchTable"


const Matchmaker = ({dateLength, users, pods, matches, addMatch, removeMatch, updateMatch, updatePods, updateUsers, completeDate, cancelMatch})=>{
  const matchAll = ()=>{

  }
  return (
    <div className="matchmaker-tab">
      <div classname="matchmaker=buttonbox">
        <Button onClick={addMatch}>
            START MATCHING ROUND
        </Button>
        <Button onClick={addMatch}>
            ADD NEW MATCH
        </Button>
      </div>
      <div className="matches-container">
          <MatchTable matches={matches} />
      </div>
    </div>
  );
}

export default Matchmaker;
