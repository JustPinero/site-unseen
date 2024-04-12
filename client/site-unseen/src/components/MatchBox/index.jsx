/* REACT */
import {useState, useEffect, useRef} from "react";
/* STYLES */
import './styles.css';
/* IMAGES */
import heartso from '../../assets/heartso.png';
/* BOOSTRAP COMPONENTS */
import Button from "react-bootstrap/Button"
/* CUSTOM COMPONENTS */
import MatchHalf from './MatchHalf';

const MatchBox = ({dateLength, matchData, updateMatch, removeMatch, users, pods, updatePods, updateUsers, completeDate, cancelMatch})=>{
    const [match1, setMatch1] = useState(null);
    const [match2, setMatch2] = useState(null);

    const [selectedUserMatches, setSelectedUserMatches] = useState([]);

    const [isConfirmed, setIsConfirmed] = useState(false)
    const Ref = useRef(null);
 
    // The state for our timer
    const [timer, setTimer] = useState("00:00:00");
 
    const getTimeRemaining = (e) => {
        const total =
            Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 24
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };
 
    const startTimer = (e) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };
 
    const clearTimer = (e) => {
        setTimer("00:00:15");
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };
 
    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 10);
        return deadline;
    };
    useEffect(() => {
        clearTimer(getDeadTime());
    }, [isConfirmed]);

/* LIFECYCLE */
    
    useEffect(()=>{
 if(match1 && !match2){
            const updatedUserMatches = users.filter((user)=>{
            //USER OPTION
            const userOptionSexualPreference = user.sexual_pref;   
            const userOptionGender = user.gender; 
            //SELECTED USER
            const selectedUserSexualPreference = match1.occupantData.sexual_pref;
            const selectedUserGender = match1.occupantData.gender;
            //Compatiblity
            const userOptionMatchesSelectedUserPreference = (selectedUserSexualPreference == userOptionGender) || selectedUserSexualPreference == "bisexual";
            const selectedUserMatchesUserOptionPreference = (userOptionSexualPreference == selectedUserGender)|| userOptionSexualPreference == "bisexual";
            const haveNotDated = match1.occupantData.hasHadDatesWith.indexOf(user.id)<0
            return userOptionMatchesSelectedUserPreference && selectedUserMatchesUserOptionPreference && haveNotDated;
                })
                let match2UserData = updatedUserMatches[0];
                let match2ClosestPodNumber = match2UserData.closestPods[0]
                let match2PodData = pods[match2ClosestPodNumber]
                const updatedMatch2Data = {...match2PodData, isOccupied:true, occupantID:match2UserData.id, occupantData: match2UserData }
                setMatch2(updatedMatch2Data)
        }else if(!match1 && !match2){
            setSelectedUserMatches([])
        }
        const updatedMatch = {...matchData, pod1:match1, pod2:match2 }
        updateMatch(matchData.id, updatedMatch)
    }, [match1, match2])


    useEffect(()=>{
        const updatedMatch = {...matchData, pod1:match1}
        updateMatch(matchData.id, updatedMatch)
    }, [match1])

    useEffect(()=>{
        const updatedMatch = {...matchData, pod2:match2}
        updateMatch(matchData.id, updatedMatch)
    }, [match2])

    useEffect(()=>{
        if(isConfirmed && match1 && match2){
            const updatedMatchData = {...matchData, pod1:match1 , pod2: match2};
            updateMatch(updatedMatchData.id, updatedMatchData)
        }
    },[isConfirmed])

    useEffect(() => {
        if(timer==="00:00:00" && isConfirmed){
                completeDate(matchData)
                removeMatch(matchData.id)
        }
    }, [timer]);
    /* HANDLERS */
    //UPDATE
    const matchUser1UpdateHandler = (update)=>{
        setMatch1(update)
    }
    const matchUser2UpdateHandler = (update)=>{
        setMatch2(update)
    }
    //CLEAR
    const clearMatchUser1Handler = ()=>{
        setMatch1(null)
    }
    const clearMatchUser2Handler = ()=>{
        setMatch2(null)
    }
    const confirmationHandler = ()=>{
        setIsConfirmed(true)
        startTimer("00:10:00")
    }

    return(
        <div className = "heartshapedbox-container">
            <div className = "heart-container">
                <div className="heartcontent" >
                    <h5 className="matchlabel-text">MATCH {matchData.id}</h5>
                            <MatchHalf match1Data={match1} match2Data={match2} userOptions={match2 ? selectedUserMatches : users} pods={pods} updateHalf={matchUser1UpdateHandler} clearHalf={clearMatchUser1Handler} updatePods={updatePods} updateUsers={updateUsers} isConfirmed={isConfirmed}/>
                        <div>
                        {
                            !isConfirmed ?
                        <div>
                            {
                                match1 && match2 && !isConfirmed ?
                            <Button variant="info" onClick={confirmationHandler}>
                                CONFIRM
                            </Button>
                            :null
                            }
                        <Button onClick={()=>cancelMatch(matchData.id)}>
                            DELETE
                        </Button>
                        </div>
                        :
                        <div> 
                            {timer}
                        </div>
                        }
                        </div>
                </div>
                <img className="heart-img" src={heartso} />
            </div>
        </div>
    )
}
export default MatchBox;