/* REACT */
import {useState, useEffect, useRef} from "react"
import { fetchPodsByID } from "../../../api/pods";
import {fetchUserByID} from "../../../api/users";
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

const MatchTableRow = ({ simIsRunning, simIsPaused, matchData, dateDuration, dateCompletionHandler})=>{
    console.log("MATCH DATA:  ", matchData)
    const [timer, setTimer] = useState(`00:00:${dateDuration}`);
    function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)
      };
    const delay = getRandomInt(3, 10)
    const {id, user1_username, user1_age, user1_gender, user1_match_count, pod1_id, user2_username, user2_age, user2_gender, user2_match_count, pod2_id, status} = matchData;
    const statusInfo = statusKey[status];
    const {text, styleId} = statusInfo;
    let dataColor = styleId;
    let statusText = text;
    const Ref = useRef(null);
    // The state for our timer
    const getTimeRemaining = (e) => {
        const total =
            Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 24
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };
    const startTimer = (e) => {
        if(!simIsPaused){
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    }
    };
    const clearTimer = (e) => {
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };
    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds()+ dateDuration + 5+delay );
        return deadline;
    };

    useEffect(() => {
        if(status==="inProgress" && simIsRunning){
        clearTimer(getDeadTime());
        }
    }, [simIsRunning]);

    if(timer==="00:00:05"){
        dataColor= "date-ending"
        statusText= "Date Ending"
    };

    if(timer==="00:00:00"){
        console.log("DATE COMPLETING:  ", matchData)
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
            <td>{timer}</td>
        </tr>
    )
}

export default MatchTableRow;