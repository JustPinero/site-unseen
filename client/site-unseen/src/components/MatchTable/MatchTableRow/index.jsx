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

// function getRandomInt(min, max) {
//     min = Math.ceil(min)
//     max = Math.floor(max)
//     return Math.floor(Math.random() * (max - min) + min)
//   };

const MatchTableRow = ({ matchData, dateDuration})=>{
    /* DATA */
    const {id, user1_username, user1_age, user1_gender, user1_match_count, pod1_id, user2_username, user2_age, user2_gender, user2_match_count, pod2_id, status, started_at} = matchData;
    /* HELPERS */
    const statusInfo = statusKey[status];
    const {text, styleId} = statusInfo;
    let dataColor = styleId;

    const currentTimestamp = Date.now();
console.log("started_at",started_at)
    // Get the specific timestamp in milliseconds (replace `specificTimestamp` with your timestamp)
    const specificTimestamp = new Date(started_at).getTime(); // example timestamp

    // Calculate the time difference in milliseconds
    const timeDifferenceMs = specificTimestamp - currentTimestamp;

    // Convert the time difference from milliseconds to seconds
    const timeDifferenceSec = Math.floor(timeDifferenceMs / 1000);

    console.log('Time difference in seconds:', timeDifferenceSec+dateDuration+1 );

    let dateTimeLeft = timeDifferenceSec+dateDuration

    return(
        <tr className="match-row" >
            <td id={dataColor}>{user1_username}</td>
            <td id={dataColor}>{user1_age}</td>
            <td id={dataColor}>{user1_gender}</td>
            <td id={dataColor}>{user1_match_count-1}</td>
            <td id={dataColor}>{pod1_id}</td>
            <td id={dataColor}>{user2_username}</td>
            <td id={dataColor}>{user2_age}</td>
            <td id={dataColor}>{user2_gender}</td>
            <td id={dataColor}>{user2_match_count-1}</td>
            <td id={dataColor}>{pod2_id}</td>
            <td id={dataColor}>{status}</td>
            <td id={dataColor}>{dateTimeLeft>0 ? dateTimeLeft : "Date Ending" }</td>
        </tr>
    )
}

export default MatchTableRow;