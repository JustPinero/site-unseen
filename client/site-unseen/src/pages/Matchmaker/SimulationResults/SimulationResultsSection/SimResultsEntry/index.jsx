/* STYLES */
import "./styles.css"

const SimulationResultsEntry = ({entryData})=>{
    const {label, data} =entryData;
    const labelFormattingKey = {
        male_user_count: "Number of Users: ",
        female_user_count: "Number of Users: ",
        nb_user_count: "Number of Users: ",
        match_count: "Number of Matches:  ",
        max_match_count: "Max Single User Matches :  ",
        min_match_count: "Min Single User Matches :  ",
        avg_match_count: "Average Number of Matches :  "
    }
    const formattedLabel = labelFormattingKey[label];
    return(
        <div className="simresults-entry_container">
                <p className="simresults-entry_text"> {formattedLabel ? formattedLabel: label} {label=== "avg_match_count" ? Math.round(data * 100) / 100 :  data}</p>
        </div>
    )
}
export default SimulationResultsEntry;