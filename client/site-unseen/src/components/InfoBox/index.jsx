/* STYLES */
import './styles.css';

const InfoBox = ({simIsComplete, simIsPaused, simIsRunning, totalUsersCount, availableUsersCount, occupiedPodCount, totalPodCount, matchCount, finishedUsersCount, userDateCountAverage})=>{
    return(
        <div className="infobox-container">
            <h5>Sim Info</h5>
            <p className="infobox-text">SIM STATUS:  {simIsComplete? "COMPLETE" : simIsRunning ?  "SIM IS RUNNING" : simIsPaused ? "SIM IS PAUSED" :"READY"}</p>
            <p className="infobox-text">USER COUNT : {totalUsersCount-availableUsersCount}/{totalUsersCount} (dating/total)</p>
            <p className="infobox-text"> FINISHED USER COUNT : {finishedUsersCount}</p>
            <p className="infobox-text"> POD COUNT : {occupiedPodCount}/{totalPodCount} (occupied/total)</p>
            <p className="infobox-text"> MATCH COUNT : {matchCount}</p>
            <p className="infobox-text"> AVERAGE DATE COUNT : {userDateCountAverage || 0}</p>
        </div>
    )
}

export default InfoBox;