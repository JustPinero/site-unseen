import SimulationResultsSection from "./SimulationResultsSection"
import "./styles.css"

const SimulationResults = ({simResultsData})=>{
        const simFinishedTotalsResults =simResultsData.data.finished;
        const simUnfinishedTotalsResults =simResultsData.data.unfinished;
        const simDetailsResults =  simResultsData.data.details;
        //MALE DATA
        const maleData = simDetailsResults.male;
        const maleSubdemographicFinishedCounts = simResultsData.data.finished.male.subDemographicCounts
        const maleSubdemographicUnfinishedCounts = simResultsData.data.unfinished.male.subDemographicCounts
        const maleFinishedTotalCount = parseInt(simFinishedTotalsResults.male.total[0].user_count);
        const maleUnfinishedTotalCount = parseInt(simUnfinishedTotalsResults.male.total[0].user_count);
        //FEMALE DATA
        const femaleData = simDetailsResults.female
        const femaleSubdemographicFinishedCounts = simResultsData.data.finished.female.subDemographicCounts
        const femaleSubdemographicUnfinishedCounts = simResultsData.data.unfinished.female.subDemographicCounts
        const femaleFinishedTotalCount = parseInt(simFinishedTotalsResults.female.total[0].user_count);
        const femaleUnfinishedTotalCount = parseInt(simUnfinishedTotalsResults.female.total[0].user_count);
        //NB DATA
        const nbData = simDetailsResults.nb
        const nbSubdemographicFinishedCounts = simResultsData.data.finished.nb.subDemographicCounts
        const nbSubdemographicUnfinishedCounts = simResultsData.data.unfinished.nb.subDemographicCounts
        const nbFinishedTotalCount = parseInt(simFinishedTotalsResults.nb.total[0].user_count);
        const nbUnfinishedTotalCount = parseInt(simUnfinishedTotalsResults.nb.total[0].user_count);
    return(
        <div className="sim-results-container" >
            <h1>
            SIM RESULTS
            </h1>
            {simResultsData &&
            <>
            <div className="sim-results-totals_container" >
                <h5>TOTAL OF USERS THAT FINISHED:  {maleFinishedTotalCount+ femaleFinishedTotalCount+ nbFinishedTotalCount}</h5>
                <h5>TOTAL OF USERS THAT DID NOT FINISH:  {maleUnfinishedTotalCount+ femaleUnfinishedTotalCount+ nbUnfinishedTotalCount}</h5>
            </div>
            <div className="stats-container">
                {maleData && <SimulationResultsSection sectionData={{title:"Male Users", finishedTotal:maleFinishedTotalCount, unfinishedTotal:maleUnfinishedTotalCount, data:maleData, subdemographicFinishedCounts: maleSubdemographicFinishedCounts, subdemographicUnfinishedCounts: maleSubdemographicUnfinishedCounts}} />}
                 { femaleData && <SimulationResultsSection sectionData={{title:"Female Users", finishedTotal:femaleFinishedTotalCount, unfinishedTotal:femaleUnfinishedTotalCount, data:femaleData, subdemographicFinishedCounts: femaleSubdemographicFinishedCounts, subdemographicUnfinishedCounts:femaleSubdemographicUnfinishedCounts}}/>}
                { nbData && <SimulationResultsSection sectionData={{title:"Non-Binary Users", finishedTotal:nbFinishedTotalCount, unfinishedTotal:nbUnfinishedTotalCount, data:nbData, subdemographicFinishedCounts: nbSubdemographicFinishedCounts, subdemographicUnfinishedCounts: nbSubdemographicUnfinishedCounts}}/>}
            </div>
            </>
                }
        </div>
    )
}
export default SimulationResults;