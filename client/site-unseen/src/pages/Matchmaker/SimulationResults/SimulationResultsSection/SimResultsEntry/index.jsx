import {useEffect, useState} from 'react';
import "./styles.css"

const SimulationResultsEntry = ({entryData})=>{
    const {label, data} =entryData;
    return(
        <div className="simresults-entry_container">

                <p className="simresults-entry_text"> {label} : {data}</p>
            </div>
    )
}
export default SimulationResultsEntry;