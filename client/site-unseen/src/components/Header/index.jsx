/* STYLES */
import './styles.css';
/* CUSTOM COMPONENTS */
import SessionTimer from "../SessionTimer";
import InfoBox from '../InfoBox';
import SimSettings from '../SimSettings';


const Header = ({
    simIsRunning,
    matchCount,
    dateCap,
    dateCapChangeHandler,
    userCount,
    podCount,
    bufferDuration,
    bufferDurationChangeHandler,
    dateDuration,
    dateDurationChangeHandler
})=>{
    return(
        <div className="header-container">
             <h1 className="header-text">
                Site Unseen
            </h1>
            <SimSettings simIsRunning={simIsRunning} dateCap={dateCap} dateCapChangeHandler={dateCapChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}/>
            <InfoBox simIsRunning={simIsRunning} userCount={userCount} podCount={podCount} matchCount={matchCount} />
            <div>
            {/* <SessionTimer sessionLength={sessionLength}/> */}
            </div>
        </div>
    )
}

export default Header;