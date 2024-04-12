/* STYLES */
import './styles.css';

const MatchUserOption = ({
    userData,
    clickFunction
})=>{
    const { username, firstname, lastname, gender, sexual_pref, dateCount, status} = userData;
    return (
    <div className={`matchuseroption-container ${userData.gender}`}  onClick={clickFunction}>
        <div>
        <p className="matchuseroption-text"> Name: {firstname} {lastname} </p>
            <p className="matchuseroption-text">STATUS: {status.toUpperCase()} </p>
            <p className="matchuseroption-text"> {`Has had ${dateCount ? dateCount : 0} dates tonight`} </p>
        </div>
        <div>
        <p className="matchuseroption-text">Username: {username} </p>
        <p className="matchuseroption-text"> {gender.toUpperCase()}  seeking  {sexual_pref.toUpperCase()} </p>

        </div>
    </div>
)}

export default MatchUserOption;