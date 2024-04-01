/* REACT */
import {useState} from "react";
/* STYLES */
import './styles.css';
/* ICONS */
import { FaEdit, FaTrashAlt } from "react-icons/fa";


const UserTile = ({
    userData,
    clickFunction
})=>{
    const [showMore, setShowMore] = useState(false)
    const {username, firstname, lastname, sexual_pref, gender, biography, age, dateCount} = userData
    const toggleShowMoreHandler = ()=>{
        const updatedShowMoreStatus = !showMore;
        setShowMore(updatedShowMoreStatus)
    }
    return (
    <div className="usertile-container" onClick={clickFunction}>
        <div className="usertile-header ">
        <FaEdit />
        <FaTrashAlt color="red" />
        </div>
        <p className="usertile-text">Username:  {username} </p>
        <p className="usertile-text">Name:  {firstname + " "+lastname } </p>
        <p className="usertile-text">Gender:  { gender } </p>
        <p className="usertile-text">Age:  { age } </p>
        {showMore &&
        <div className="usertile-hidden-content">
              <p className="usertile-text">Has had  { dateCount } dates</p>
            <p className="usertile-text">BIO:  {biography} </p>
        </div>
        }
        <div className="showmore-container">
            <p className="showmore-text" onClick={toggleShowMoreHandler}>{showMore ?"Show Less" : "Show More" }</p>
        </div>
    </div>
)}

export default UserTile;