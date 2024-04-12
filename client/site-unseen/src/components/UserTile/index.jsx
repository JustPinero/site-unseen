/* REACT */
import {useState} from "react";
/* STYLES */
import './styles.css';
/* ICONS */
import { FaEdit, FaTrashAlt } from "react-icons/fa";


const UserTile = ({
    userData,
    tileClickFunction,
    removeUser
})=>{
    const [showMore, setShowMore] = useState(false)
    const {id, username, firstname, lastname, sexual_pref, gender, biography, age, dateCount, hasHadDatesWith} = userData
    const toggleShowMoreHandler = ()=>{
        const updatedShowMoreStatus = !showMore;
        setShowMore(updatedShowMoreStatus)
    }
    return (
    <div className="usertile-container" onClick={tileClickFunction}>
        <div className="usertile-header ">
        <FaEdit />
        <FaTrashAlt onClick={()=>removeUser(id)} color="red" />
        </div>
        <div>
            <div>
                <p className="usertile-text">Username:  {username} </p>
                <p className="usertile-text">Name:  {firstname + " "+lastname } </p>
                <p className="usertile-text">Gender:  { gender } </p>
                <p className="usertile-text">Age:  { age } </p>
            </div>
            <div>
                <p className="usertile-text">Has had {dateCount+" "}dates  </p>
                <p className="usertile-text"> {hasHadDatesWith.length ? `Has Dated: ${hasHadDatesWith.map(previousMatch=>(<span key={previousMatch.id}>{previousMatch.firstname + " "+previousMatch.lastname}</span>))}`: "Has not had any dates yes"}
                </p>
            </div>
        </div>
        {showMore &&
        <div className="usertile-hidden-content">
            <p className="usertile-text">BIO:  {biography} </p>
        </div>
        }
        <div className="showmore-container">
            <p className="showmore-text" onClick={toggleShowMoreHandler}>{showMore ?"Show Less" : "Show More" }</p>
        </div>
    </div>
)}

export default UserTile;