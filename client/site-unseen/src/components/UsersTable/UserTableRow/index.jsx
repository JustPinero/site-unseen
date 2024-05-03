/* REACT */
import {useState, useEffect, useRef} from "react"
/* STYLES */
import './styles.css';

const statusKey= {
    inProgress:{
        text: "Date In Progress",
        styleId: "match-row-inprogress"
    }
}

const UserTableRow = ({userData})=>{
    const {id, username, dateCount, status} = userData;
    return(
        <tr className="waitlsit-row">
            <td >{id}</td>
            <td >{username}</td>
            <td>{status}</td>
        </tr>
    )
}

export default UserTableRow;