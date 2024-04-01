/* STYLES */
import './styles.css';

const PodTile = ({
    podData,
    clickFunction
})=>{

    return (
    <div className={`podtile-container ${podData.isOccupied ? "occupied" : ""}`} onClick={clickFunction}>
        <h5 className="podtile-text"> POD {podData.id}</h5>
    </div>
)}

export default PodTile;