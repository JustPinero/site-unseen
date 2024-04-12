/* STYLES */
import './styles.css';

const InfoBox = ({userCount, podCount, matchCount})=>{
    return(
        <div className="infobox-container">
            <p>USER COUNT :{userCount}</p>
            <p> POD COUNT :{podCount}</p>
            <p> MATCH COUNT :{matchCount}</p>
        </div>
    )
}

export default InfoBox;