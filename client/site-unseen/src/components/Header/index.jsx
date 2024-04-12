/* STYLES */
import './styles.css';
/* CUSTOM COMPONENTS */
import SessionTimer from "../SessionTimer";
import InfoBox from '../InfoBox';
import SimSettings from '../SimSettings';


const Header = ({
    minimumDateAmount,
    minimumDateAmountChangeHandler,
    sessionLength, userCount, podCount, matchCount, bufferDuration, bufferDurationChangeHandler, dateDuration, dateDurationChangeHandler })=>{
    return(
        <div className="header-container">
             <h1 className="header-text">
                Site Unseen
            </h1>
            <SimSettings minimumDateAmount={minimumDateAmount} minimumDateAmountChangeHandler={minimumDateAmountChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}/>
            <InfoBox userCount={userCount} podCount={podCount} matchCount={matchCount} />
            <div>
            {/* <SessionTimer sessionLength={sessionLength}/> */}
            </div>
        </div>
    )
}

export default Header;