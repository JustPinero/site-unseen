/* STYLES */
import './styles.css';

const MatchPodOption = ({
    podData,
    clickFunction
})=>{

    return (
    <div className="podoption-container" onClick={clickFunction}>
        <h5 className="podoption"> POD {podData.id}</h5>
    </div>
)}

export default MatchPodOption;