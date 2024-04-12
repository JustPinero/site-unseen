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

const WaitListTableRow = ({userData})=>{
    console.log("WAITLISTER DATA:  ", userData)
    const {id, username, dateCount, status} = userData;
    // const statusInfo = statusKey[status];
    // const {text, styleId} = statusInfo
    return(
        <tr className="waitlsit-row">
            <td >{id}</td>
            <td >{username}</td>
            <td >{username}</td>
            <td >{dateCount}</td>
            <td>{status}</td>
        </tr>
    )
}

export default WaitListTableRow;