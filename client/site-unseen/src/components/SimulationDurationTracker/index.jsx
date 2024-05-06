/* REACT */
import {useState, useEffect, useRef} from "react";
/* STYLES */
import './styles.css';
/* BOOSTRAP COMPONENTS */
import Button from "react-bootstrap/Button";

const SimulationDurationTracker = ({simIsRunning})=>{
    const [elapsedTime, setElapsedTime] = useState(0)

    const countUp = ()=> {
      setElapsedTime(elapsedTime + 1 );
    }
    const startCounting = ()=> {
      setInterval(countUp, 1000);
    }

    useEffect(()=>{
      if(simIsRunning){
        startCounting()
      }
    },[simIsRunning])
          return (
            <div>
              <div>{elapsedTime}</div>
            </div>
          );
      }

export default SimulationDurationTracker;