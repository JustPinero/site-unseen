/* STYLES */
import './styles.css';

const MatchUserOption = ({
    userData,
    clickFunction
})=>{
    const { username, firstname, lastname, gender, sexual_pref, dateCount} = userData;
    console.log("GENDER:  ", gender)
    return (
    <div className={`matchuseroption-container ${userData.gender}`}  onClick={clickFunction}>
        <p className="matchuseroption-text">Username: {username} </p>
        <p className="matchuseroption-text"> Name: {firstname} {lastname} </p>
        <p className="matchuseroption-text"> {gender}  seeking  {sexual_pref} </p>
        <p className="matchuseroption-text"> {`Has had ${dateCount ? dateCount : 0} dates tonight`} </p>
    </div>
)}

export default MatchUserOption;