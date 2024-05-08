import {useEffect, useState} from 'react';
import { fetchFinishedUserCount, fetchUnfinishedUserCount } from '../../../api/users';
import "./styles.css"

const SimulationResults = ({dateCount})=>{
    const [totalFinishedUserCount, setTotalFinishedUserCount] =useState(0);
    const [totalUninishedUserCount, setTotalUninishedUserCount] =useState(0);
    const [femaleFinishedUsers, setFemaleFinishedUsers] = useState(0);
    const [maleFinishedUsers, setMaleFinishedUsers] = useState(0);
    const [nbFinishedUsers, setNbFinishedUsers] = useState(0);
    const [femaleUnfinishedUsers, setFemaleUnfinishedUsers] = useState(0);
    const [maleUnfinishedUsers, setMaleUnfinishedUsers] = useState(0);
    const [nbUnfinishedUsers, setNbUnfinishedUsers] = useState(0);


    useEffect(()=>{
        const updateStatsData = async ()=>{
            try{
                const finishedUserResults = await fetchFinishedUserCount(dateCount)
                const unfinishedUserResults = await fetchUnfinishedUserCount(dateCount)
                const finishedUserData = finishedUserResults.data
                const unfinishedUserData = unfinishedUserResults.data
                setTotalFinishedUserCount(finishedUserData.total[0].user_count)
                setFemaleFinishedUsers(finishedUserData.female[0].user_count)
                setMaleFinishedUsers(finishedUserData.male[0].user_count)
                setNbFinishedUsers(finishedUserData.nb[0].user_count)
                setTotalUninishedUserCount(finishedUserData.total[0].user_count)
                setFemaleUnfinishedUsers(unfinishedUserData.female[0].user_count)
                setMaleUnfinishedUsers(unfinishedUserData.male[0].user_count)
                setNbUnfinishedUsers(unfinishedUserData.nb[0].user_count)
            }
            catch(err){
                console.log("ERROR:  ", err)
            }
        }
        updateStatsData()
    },[])

    return(
        <div className="sim-results-container" >
            <h1>
            SIM RESULTS
            </h1>
            <div className="stats-container">
                <div className="completion-count_container">
                        <div>
                            <p>{totalFinishedUserCount} Users finished the game</p>
                        </div>
                        <div>
                            <p>{femaleFinishedUsers} Female Users finished the game</p>
                        </div>
                        <div>
                            <p>{maleFinishedUsers} Male Users finished the game</p>
                        </div>
                        <div>
                            <p>{nbFinishedUsers} Non-Binary Users finshed the game </p>
                        </div>
                    </div>
                    <div className="incompletion-count_container">
                        <div>
                            <p>{totalUninishedUserCount} Users finished the game</p>
                        </div>
                        <div>
                            <p>{femaleUnfinishedUsers} Female Users didn't finish the game</p>
                        </div>
                        <div>
                            <p>{maleUnfinishedUsers} Male Users didn't finish the game</p>
                        </div>
                        <div>
                            <p>{nbUnfinishedUsers} Non-Binary Users didn't finish the game</p>
                        </div>
                    </div>
                </div>
        </div>
    )
}
export default SimulationResults;