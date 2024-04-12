/* REACT */
import {useState, useEffect, useRef} from "react"
/* STYLES */
import './styles.css';

const statusKey= {
    inProgress:{
        text: "Date In Progress",
        styleId: "match-row-inprogress"
    }
}

const MatchTableRow = ({matchData, dateLength})=>{
    console.log("MATCH DATA:  ", matchData)
    const {id, match1, match2, status} = matchData;
    const statusInfo = statusKey[status];
    const {text, styleId} = statusInfo
    const Ref = useRef(null);
    // The state for our timer
    const [timer, setTimer] = useState("00:12:00");
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
        deadline.setSeconds(deadline.getSeconds() + dateLength);
        return deadline;
    };
    useEffect(() => {
        if(status==="inProgress"){
        clearTimer(getDeadTime());
        }
    }, []);

    useEffect(() => {
        if(timer==="00:00:00"){
                // console.log("matchData:  ", matchData)
                // completeDate(matchData)
                // removeMatch(matchData.id)
        }
    }, [timer]);



    console.log("MATCH TABLE ROW:  ", matchData)
    return(
        <tr className="match-row">
            <td id={styleId}>{id}</td>
            <td id={styleId}>{match1.user.id}</td>
            <td id={styleId}>{match1.user.username}</td>
            <td id={styleId}>{match1.pod.id}</td>
            <td id={styleId}>{match2.user.id}</td>
            <td id={styleId}>{match2.user.username}</td>
            <td id={styleId}>{match2.pod.id}</td>
            <td id={styleId}>{text}</td>
            <td>{timer}</td>
        </tr>
    )
}

export default MatchTableRow;