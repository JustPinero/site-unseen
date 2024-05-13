import SimulationResultsEntry from './SimResultsEntry';
import "./styles.css"

const SimulationResultsSection = ({sectionData})=>{
        const {title, data, finishedTotal, unfinishedTotal, subdemographicFinishedCounts, subdemographicUnfinishedCounts} = sectionData;
        console.log("title:  ", title)
        console.log("data:  ", data)
        console.log("subdemographicFinishedCounts:  ", subdemographicFinishedCounts)
        console.log("subdemographicUnfinishedCounts:  ", subdemographicUnfinishedCounts)
        const undesiredKeys = ["sexual_pref", "gender"];
        let updatedFormattedEntryData =[];
        if(sectionData){
            updatedFormattedEntryData = data.map((stat)=>{
                console.log("STAT:  ", stat)
            let statData = Object.keys(stat).map((key)=>{
                if(undesiredKeys.indexOf(key)<0){
                    return {
                        label: key,
                        data: stat[key]
                    };
                };
            }).filter((entry)=>entry!==undefined);
            const fetchAndFormatSexualityDemographicCountData = (demographicDataArr, label)=>{
                for(let i=0 ; i< demographicDataArr.length; i++){
                    const currentSubdemographicCountData = demographicDataArr[i];
                    console.log("currentSubdemographicCountData:  ", currentSubdemographicCountData.sexual_pref)
                    console.log("stat.sexual_pref:  ", stat.sexual_pref)
                    if(currentSubdemographicCountData.sexual_pref === stat.sexual_pref){
                        return {
                            label: label,
                            data: currentSubdemographicCountData.user_count ? currentSubdemographicCountData.user_count : 0
                        }
                    }
                }
            }
            const formattedSubdemographicFinishedUserCount = fetchAndFormatSexualityDemographicCountData(subdemographicFinishedCounts, "Users who finished:  ")
            const formattedSubdemographicUnfinishedUserCount = fetchAndFormatSexualityDemographicCountData(subdemographicUnfinishedCounts, "Users who did not finished:  ")
            console.log("STAT DATA:  ", [...statData, formattedSubdemographicFinishedUserCount, formattedSubdemographicUnfinishedUserCount ])
            const formattedStatData = [...statData, formattedSubdemographicFinishedUserCount, formattedSubdemographicUnfinishedUserCount ].filter(stat=>(stat!==undefined))
            const sexuality =stat.gender === "non-binary" ?  (stat.sexual_pref === "bisexual") ? "Bisexual" : (stat.sexual_pref === "female") ? "Seeking Female Matches" : "Seeking Male Matches"   : (stat.sexual_pref === "bisexual") ? "Bisexual" : (stat.sexual_pref === stat.gender) ? "Homosexual" : "Heterosexual";
                const entryData = {
                    statTitle: sexuality,
                    statData: formattedStatData
                }
            return entryData;
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
                formattedSectionData?.map((entry, index)=>{
                    const {statTitle, statData} = entry
                   return  (
                   <div key={index} className="simresults-subsection_container">
                    <div className="simresults-subsection-header">
                        <h5>{statTitle}</h5>
                    </div>
                    <div className="simresults-subsection_body">
                    {
                        statData.length ?
                        statData.map((entry)=>{
                            return ( <SimulationResultsEntry key={entry.label} entryData={entry}/>)
                        })
                        :null
                    }
                    </div>
                   </div>)
                }):
                null
            }
            </div>
        </div>
    )
}
export default SimulationResultsSection;