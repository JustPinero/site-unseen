import { BASEURL } from ".";
import axios from 'axios';
const PATH = `${BASEURL}/sim`

/* SIM GETS */
/* GET SIM STATUS */
const fetchSimStatus = async (minDateThreshold, maxDateThreshHold, maxDateDuration)=>{
    console.log("fetchSimStatus fired")
    const payload = {minDateThreshold, maxDateThreshHold, maxDateDuration}
    return await axios.post(`${PATH}/status`, payload);
};


export {fetchSimStatus}