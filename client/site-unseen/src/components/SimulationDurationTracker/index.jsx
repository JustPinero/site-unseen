/* REACT */
import {useState, useEffect} from "react";
/* STYLES */
import './styles.css';

const SimulationDurationTracker = ({simIsRunning})=>{
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (simIsRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [simIsRunning]);


          return (
            <div>
              <div>{seconds}</div>
            </div>
          );
      }

export default SimulationDurationTracker;