import {useState, useEffect, useRef} from "react"

const MatchTableRow = ({matchData, dateLength})=>{
    console.log("MATCH DATA:  ", matchData)
    const {id, match1, match2,} = matchData;

    const Ref = useRef(null);
    // The state for our timer
    const [timer, setTimer] = useState("00:00:00");
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
        setTimer("00:00:00");
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
        clearTimer(getDeadTime());
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
        <tr>
            <td>{id}</td>
            <td>{match1.user.username}</td>
            <td>{match1.pod.id}</td>
            <td>{match2.user.username}</td>
            <td>{match2.pod.id}</td>
            <td>{timer}</td>
        </tr>
    )
}

export default MatchTableRow;