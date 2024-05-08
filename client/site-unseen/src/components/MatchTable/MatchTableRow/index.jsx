/* REACT */
import {useState, useEffect, useRef} from "react"
/* STYLES */
import './styles.css';

const statusKey= {
    inProgress:{
        text: "Date In Progress",
        styleId: "date-inprogress"
    },
    waitingOnPod: {
        text: "Waiting for Pod",
        styleId: "match-row-waitingOnPod"
    },
    complete: {
        text: "available",
        styleId: "available"
    },
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  };

const MatchTableRow = ({ simIsRunning, simIsPaused, matchData, dateDuration, dateCompletionHandler})=>{
    const delay = getRandomInt(3, 10)
    /* DATA */
    const {id, user1_username, user1_age, user1_gender, user1_match_count, pod1_id, user2_username, user2_age, user2_gender, user2_match_count, pod2_id, status} = matchData;
    /* STATE */
    const [seconds, setSeconds] = useState(dateDuration+delay);
    // const [isActive, setIsActive] = useState(false);
    // const [timer, setTimer] = useState(`00:00:${dateDuration}`);
    // const Ref = useRef(null);
    /* HELPERS */
    const statusInfo = statusKey[status];
    const {text, styleId} = statusInfo;
    let dataColor = styleId;
    let statusText = text;



    useEffect(() => {
        let interval;
        if(status==="inProgress" && simIsRunning){
            interval = setInterval(() => {
                setSeconds(seconds => seconds -1);
              }, 1000);
        }else{
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [simIsRunning]);

    if(seconds<5){
        dataColor= "date-ending"
        statusText= "Date Ending"
    };
    if(seconds===0){
        dateCompletionHandler(matchData)
    };

    return(
        <tr className="match-row" onClick={()=>dateCompletionHandler(matchData)}>
            <td id={dataColor}>{user1_username}</td>
            <td id={dataColor}>{user1_age}</td>
            <td id={dataColor}>{user1_gender}</td>
            <td id={dataColor}>{user1_match_count}</td>
            <td id={dataColor}>{pod1_id}</td>
            <td id={dataColor}>{user2_username}</td>
            <td id={dataColor}>{user2_age}</td>
            <td id={dataColor}>{user2_gender}</td>
            <td id={dataColor}>{user2_match_count}</td>
            <td id={dataColor}>{pod2_id}</td>
            <td id={dataColor}>{status}</td>
            <td>{seconds}</td>
        </tr>
    )
}

export default MatchTableRow;