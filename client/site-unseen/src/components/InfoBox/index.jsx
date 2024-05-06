/* STYLES */
import './styles.css';

const InfoBox = ({simIsRunning, userCount, podCount, matchCount, finishedUsersCount, userDateCountAverage})=>{
    return(
        <div className="infobox-container">
            <h5>Sim Info</h5>
            <p className="infobox-text">SIM STATUS:  {simIsRunning ?  "SIM IS RUNNING" : "READY"}</p>
            <p className="infobox-text">USER COUNT :{userCount}</p>
            <p className="infobox-text"> FINISHED USER COUNT :{finishedUsersCount}</p>
            <p className="infobox-text"> POD COUNT :{podCount}</p>
            <p className="infobox-text"> MATCH COUNT :{matchCount}</p>
            <p className="infobox-text"> AVERAGE DATE COUNT :{userDateCountAverage}</p>
        </div>
    )
}

export default InfoBox;