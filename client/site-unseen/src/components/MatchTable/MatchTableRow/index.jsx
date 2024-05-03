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

const MatchTableRow = ({ simIsRunning, simIsPaused, matchData, dateDuration,bufferDuration, dateCompletionHandler})=>{
    const [rowData, setRowData] = useState(null)
    function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)
      };
    const delay = getRandomInt(3, 10)
    console.log("MATCH DATA:  ", matchData)
    const {id, user1_id, pod1_id, user2_id, pod2_id, status} = matchData;
    const statusInfo = statusKey[status];
    const {text, styleId} = statusInfo;
    let dataColor = styleId;
    let statusText = text;
    const Ref = useRef(null);
    // The state for our timer
    const [timer, setTimer] = useState("00:00:20");
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
        if (total >= 0 || !simIsPaused) {
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
        deadline.setSeconds(deadline.getSeconds() + 5+delay );
        return deadline;
    };
    useEffect(() => {
        async function startFetching() {
            try{
                const pod1Results = await fetchPodsByID(pod1_id)
                const pod2Results = await fetchPodsByID(pod2_id)
                const user1Results = await fetchUserByID(user1_id)
                const user2Results = await fetchUserByID(user2_id)
                if (!ignore) {
                   
                    const user1Data =user1Results.data[0];
                    const user2Data =user2Results.data[0];
                    const pod1Data =pod1Results.data[0];
                    const pod2Data = pod2Results.data[0];
                    const updatedRowData = {user1Data, user2Data ,pod1Data, pod2Data};
                    console.log("UDPATED ROW DATA:  ",updatedRowData )
                    setRowData(updatedRowData);
                }
            }catch(err){
                console.log("MATCH TABLE ROW ERROR:  ", err)
            }
        }
        let ignore = false;
        if(matchData){
        startFetching();
        return () => {
          ignore = true;
        }
        }
    }, [matchData]);

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
        dateCompletionHandler(id, matchData)
    };
    if(rowData){
    const {user1Data, user2Data , pod1Data, pod2Data} = rowData;
    return(
        <tr className="match-row">
            <td id={dataColor}>{user1Data.username}</td>
            <td id={dataColor}>{user1Data.age}</td>
            <td id={dataColor}>{user1Data.gender}</td>
            <td id={dataColor}>{pod1Data.id}</td>
            <td id={dataColor}>{user2Data.username}</td>
            <td id={dataColor}>{user2Data.age}</td>
            <td id={dataColor}>{user2Data.gender}</td>
            <td id={dataColor}>{pod2Data.id}</td>
            <td id={dataColor}>{matchData.status}</td>
            <td>{timer}</td>
        </tr>
    )
    }
}

export default MatchTableRow;