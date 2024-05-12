import SimulationResultsEntry from './SimResultsEntry';
import "./styles.css"

const SimulationResultsSection = ({sectionData})=>{
        const {title, data, finishedTotal, unfinishedTotal} = sectionData;
        const undesiredKeys = ["sexual_pref", "gender"]
        let updatedFormattedEntryData =[]
        if(sectionData){
            updatedFormattedEntryData = data.map((stat)=>{
            const statData = Object.keys(stat).map((key)=>{
                console.log("KEY:  ", key)
                return {
                    label: key,
                    data: stat[key]
                };
            });
            const sexuality =(stat.sexual_pref === "bisexual") ? "Bisexual" : (stat.sexual_pref === title)? "Homosexual" : "Heterosexual";
                const entryData = {
                    statTitle: sexuality,
                    statData:statData
                }
            return entryData
            })
        } 
        const formattedSectionTitle= title;
        const formattedSectionData =updatedFormattedEntryData;
        const finishedTotalCount =finishedTotal;
        const unfinishedTotalCount =unfinishedTotal;
    return(
        <div className="simresults-section_container">
            <div className="simresults-section_header">
                <h5 className="simresults-section_header-text">{formattedSectionTitle}</h5>
                <div className="simresults-section_header_stats">
                    <SimulationResultsEntry entryData={{label: `Total ${formattedSectionTitle} who finished`, data: finishedTotalCount} }/>
                    <SimulationResultsEntry entryData={{label: `Total ${formattedSectionTitle} who did not finish`, data: unfinishedTotalCount} }/>
                </div>
            </div>
            <div className="simresults-subsection">
            {formattedSectionData.length ?
                formattedSectionData?.map(entry=>{
                    const {statTitle, statData} = entry
                   return  (
                   <div className="simresults-subsection_container">
                    <div className="simresults-subsection-header">
                        <h5>{statTitle}</h5>
                    </div>
                    {statData.length ?
                        statData.map((entry)=>
                   ( <SimulationResultsEntry entryData={entry}/>)
                    )
                    :null
                    }
                   </div>)
                }):
                null
            }
            </div>
        </div>
    )
}
export default SimulationResultsSection;