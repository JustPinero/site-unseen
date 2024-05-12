/* STYLES */
import './styles.css';

const SimulationDurationTracker = ({sessionDuration})=>{
          return (
            <div className="sessiontimer-container">
                <h4>Event Duration</h4>
                <h5>{sessionDuration} seconds</h5>
            </div>
          );
      }

export default SimulationDurationTracker;