/* REACT */
import {useState, useEffect, useRef} from "react";
/* STYLES */
import './styles.css';


const SimulationDurationTracker = ({simIsRunning})=>{
    const [elapsedTime, setElapsedTime] = useState(0)
        const countUp= ()=>{
          if(simIsRunning){
            setElapsedTime(( elapsedTime ) => (  setElapsedTime(elapsedTime + 1) ));
          }
        }
        const startCounting=()=> {
          setInterval(countUp, 1000);
        }
        useEffect(()=>{
            if(simIsRunning){
                startCounting()
            }
        },[simIsRunning])

          return (
            <div>
              <div>SIMULATION DURATION:  {elapsedTime}</div>
            </div>
          );
      }

export default SimulationDurationTracker;