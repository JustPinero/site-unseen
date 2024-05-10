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
    users,
    totalUsersCount,
    availableUsersCount,
    occupiedPodCount,
    totalPodCount,
    userDateCountAverage,
    bufferDuration,
    bufferDurationChangeHandler,
    dateDuration,
    dateDurationChangeHandler,
    totalMatchCount,
     activeMatchCount,
})=>{
    return(
        <div className="header-container">
             <h1 className="header-text">
                Site Unseen
            </h1>
            <SimSettings simIsRunning={simIsRunning} dateCap={dateCap} dateCapChangeHandler={dateCapChangeHandler} bufferDuration={bufferDuration} bufferDurationChangeHandler={bufferDurationChangeHandler} dateDuration={dateDuration} dateDurationChangeHandler={dateDurationChangeHandler}/>
            <InfoBox users={users} simIsComplete={simIsComplete} simIsPaused={simIsPaused} simIsRunning={simIsRunning} totalUsersCount={totalUsersCount} availableUsersCount={availableUsersCount} occupiedPodCount={occupiedPodCount} totalPodCount={totalPodCount} matchCount={matchCount} finishedUsersCount={finishedUsersCount} userDateCountAverage={userDateCountAverage} activeMatchCount={activeMatchCount} totalMatchCount={totalMatchCount}/>
            <div>
            {/* <SessionTimer sessionLength={sessionLength}/> */}
            </div>
        </div>
    )
}

export default Header;