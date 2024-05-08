/* REACT */
import {useState, useEffect, useRef} from "react";
/* STYLES */
import './styles.css';
/* BOOSTRAP COMPONENTS */
import Button from "react-bootstrap/Button";

const SessionTimer = ({sessionLength})=>{
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

    return(
        <div className="sessiontimer-container">
            <h5>EVENT TIME REMAINING</h5>
        <div>
        <h1>Timer: {seconds} seconds</h1>
        <button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
        </div>

        </div>
    )
}

export default SessionTimer;