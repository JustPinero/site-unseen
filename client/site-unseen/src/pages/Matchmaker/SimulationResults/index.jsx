import SimulationResultsSection from "./SimulationResultsSection"
import "./styles.css"

const SimulationResults = ({simResultsData})=>{
        const simFinishedTotalsResults =simResultsData.data.finished;
        const simUnfinishedTotalsResults =simResultsData.data.unfinished;
        const simDetailsResults =  simResultsData.data.details;
        //MALE DATA
        const maleData = simDetailsResults.male;
        const maleFinishedTotalCount = parseInt(simFinishedTotalsResults.male[0].user_count);
        const maleUnfinishedTotalCount = parseInt(simUnfinishedTotalsResults.male[0].user_count);
        //FEMALE DATA
        const femaleData = simDetailsResults.female
        const femaleFinishedTotalCount = parseInt(simFinishedTotalsResults.female[0].user_count);
        const femaleUnfinishedTotalCount = parseInt(simUnfinishedTotalsResults.female[0].user_count);
        //NB DATA
        const nbData = simDetailsResults.nb
        const nbFinishedTotalCount = parseInt(simFinishedTotalsResults.nb[0].user_count);
        const nbUnfinishedTotalCount = parseInt(simUnfinishedTotalsResults.nb[0].user_count);
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
                {maleData && <SimulationResultsSection sectionData={{title:"Male Users", finishedTotal:maleFinishedTotalCount, unfinishedTotal:maleUnfinishedTotalCount, data:maleData}} />}
                 { femaleData && <SimulationResultsSection sectionData={{title:"Female Users", finishedTotal:femaleFinishedTotalCount, unfinishedTotal:femaleUnfinishedTotalCount, data:femaleData}}/>}
                { nbData && <SimulationResultsSection sectionData={{title:"Non-Binary Users", finishedTotal:nbFinishedTotalCount, unfinishedTotal:nbUnfinishedTotalCount, data:nbData}}/>}
            </div>
            </>
                }
        </div>
    )
}
export default SimulationResults;