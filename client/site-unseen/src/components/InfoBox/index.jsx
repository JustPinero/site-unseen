/* STYLES */
import './styles.css';

const InfoBox = ({simIsRunning, userCount, podCount, matchCount})=>{
    return(
        <div className="infobox-container">
            <h5>Sim Info</h5>
            <p className="infobox-text">SIM STATUS:  {simIsRunning ?  "SIM IS RUNNING" : "READY"}</p>
            <p className="infobox-text">USER COUNT :{userCount}</p>
            <p className="infobox-text"> POD COUNT :{podCount}</p>
            <p className="infobox-text"> MATCH COUNT :{matchCount}</p>
        </div>
    )
}

export default InfoBox;