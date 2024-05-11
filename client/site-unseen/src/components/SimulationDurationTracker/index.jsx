/* REACT */
import {useState, useEffect} from "react";
/* STYLES */
import './styles.css';

const SimulationDurationTracker = ({simIsRunning, sessionDuration, sessionDurationChangeHandler, simIsPaused})=>{
  // const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log(" SIM IS RUNNING:  ", simIsRunning)
    let interval;
    if (simIsRunning) {
      interval = setInterval(() => {
        sessionDurationChangeHandler(seconds => seconds + 1);
      }, 1000);
    } else if(simIsPaused) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [simIsRunning]);

  // const toggleTimer = () => {
  //   setIsActive(!isActive);
  // };

  // const resetTimer = () => {
  //   setIsActive(false);
  //   sessionDurationChangeHandler(0);
  // };


          return (
        <div className="sessiontimer-container">
          <div>
            <h4>Event Duration</h4>
            <h5>{sessionDuration} seconds</h5>
            {/* <button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</button>
            <button onClick={resetTimer}>Reset</button> */}
          </div>
        </div>
          );
      }

export default SimulationDurationTracker;