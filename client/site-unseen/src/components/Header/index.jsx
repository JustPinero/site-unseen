/* STYLES */
import './styles.css';
/* CUSTOM COMPONENTS */
import SessionTimer from "../SessionTimer";
import InfoBox from '../InfoBox';


const Header = ({sessionLength, userCount, podCount, matchCount})=>{
    return(
        <div className="header-container">
             <h1 className="header-text">
                Site Unseen
            </h1>
            <InfoBox userCount={userCount} podCount={podCount} matchCount={matchCount} />
            <div>
            {/* <SessionTimer sessionLength={sessionLength}/> */}
            </div>
        </div>
    )
}

export default Header;