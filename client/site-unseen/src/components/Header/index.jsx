/* STYLES */
import './styles.css';
/* CUSTOM COMPONENTS */
import InfoBox from '../InfoBox';
import SimSettings from '../SimSettings';


const Header = ({
    simIsPaused,
    simIsRunning,
    simIsComplete,
    matchCount,
    finishedUsersCount,
    dateCap,
    dateCapChangeHandler,
    totalUsersCount,
    availableUsersCount,
    occupiedPodCount,
    totalPodCount,
    userDateCountAverage,
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
            <InfoBox simIsComplete={simIsComplete} simIsPaused={simIsPaused} simIsRunning={simIsRunning} totalUsersCount={totalUsersCount} availableUsersCount={availableUsersCount} occupiedPodCount={occupiedPodCount} totalPodCount={totalPodCount} matchCount={matchCount} finishedUsersCount={finishedUsersCount} userDateCountAverage={userDateCountAverage}/>
            <div>
            {/* <SessionTimer sessionLength={sessionLength}/> */}
            </div>
        </div>
    )
}

export default Header;