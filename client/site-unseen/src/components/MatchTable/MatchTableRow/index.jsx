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
    available: {
        text: "available",
        styleId: "available"
    },
}

const MatchTableRow = ({matchData,dateDuration,bufferDuration, dateCompletionHandler, deleteMatch})=>{
    // console.log("MATCH DATA:  ", matchData)
    const {id, match1, match2, status} = matchData;
    const statusInfo = statusKey[status];
    const {text, styleId} = statusInfo;
    let dataColor = styleId;
    let statusText = text;
    const Ref = useRef(null);
    // The state for our timer
    const [timer, setTimer] = useState("00:00:10");
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
        deadline.setSeconds(deadline.getSeconds() + 5);
        return deadline;
    };
    useEffect(() => {
        if(status==="inProgress"){
        clearTimer(getDeadTime());
        }
    }, []);


    if(timer==="00:00:00"){
        dataColor= "date-ending"
        statusText= "Date Ending"
        dateCompletionHandler(matchData)
        deleteMatch(id)
    };
    return(
        <tr className="match-row">
            <td id={dataColor}>{id}</td>
            <td id={dataColor}>{match1.user.id}</td>
            <td id={dataColor}>{match1.user.username}</td>
            <td id={dataColor}>{match1.user.dateCount}</td>
            <td id={dataColor}>{match1.pod.id}</td>
            <td id={dataColor}>{match2.user.id}</td>
            <td id={dataColor}>{match2.user.username}</td>
            <td id={dataColor}>{match2.user.dateCount}</td>
            <td id={dataColor}>{match2.pod.id}</td>
            <td id={dataColor}>{statusText}</td>
            <td>{timer}</td>
        </tr>
    )
}

export default MatchTableRow;