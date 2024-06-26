import { BASEURL } from ".";
import axios from 'axios';
const PATH = `${BASEURL}/users`

/* USER GETS */
/* GETS ALL USERS */
const fetchUsers = async ()=>{
    return await axios.get(`${PATH}`);
};
/* GETS ALL USER BY ID */
const fetchUserByID = async (id)=>{
    return await axios.get(`${PATH}/${id}`);
};
/* GETS ALL ELLIGIBLE USERS */
const fetchElligibleUsers = async (dateCount)=>{
    return await axios.get(`${PATH}/dates/${dateCount}`);
};

/*GETS AVG USER DATE COUNT */
const fetchUserDateCountAverage = async ()=>{
    return await axios.get(`${PATH}/dates/avg`);
};

/* GETS ALL FINISHED USERS */

const fetchFinishedUsers = async (dateCount)=>{
    return await axios.get(`${PATH}/finished/${dateCount}`);
};
/* STAT COUNTS */
//TOTAL
const fetchUserCount = async ()=>{
    return await axios.get(`${PATH}/counts/all`);
};
//FINISHED
const fetchFinishedUserCount = async (dateCount)=>{
    return await axios.get(`${PATH}/finished/${dateCount}/count`);
};
//UNFINISHED
const fetchUnfinishedUserCount = async (dateCount)=>{
    console.log("fetchUnfinishedUserCount dateCount:  ", dateCount)
    return await axios.get(`${PATH}/unfinished/${dateCount}/count`);
};

/* GETS USERS BY GENDER */
const fetchUsersByGender = async (gender)=>{
    return await axios.get(`${PATH}/gender/${gender}`);
};

/* USER POSTS */
/* REQUEST USER SIMRESULTS USING SIM SPECS */
const fetchUserSimResults = async (dateMin, dateMax)=>{
    const payload = {
        dateMin: dateMin,
        dateMax: dateMax
    }
    console.log("fetchUserSimResults :  ", payload)
    return await axios.post(`${PATH}/simresults`, payload);
};

const createUser = async (newUser)=>{
    return await axios.post(`${PATH}/`, newUser);
};

const generateUser = async (userCount, generatedUserDetails)=>{
    try{
        for(let i= 0; i<userCount; i++){
            await axios.post(`${PATH}/generate`, generatedUserDetails);
        }
    }catch(err){
        console.log("ERROR:  ", err)
    }
}

/* USER UPDATE */
const updateUser =  async (id, userUpdate)=>{
    return await axios.put(`${PATH}/${id}`, userUpdate);
};

/* USER DELETE */
const deleteUser =  async (id)=>{
    return await axios.delete(`${PATH}/${id}`);
};


const deleteAllUsers =  async ()=>{
    return await axios.delete(`${PATH}/removeall`);
};

export {fetchUsers,fetchUserByID, fetchElligibleUsers, fetchFinishedUsers,fetchUserCount, fetchFinishedUserCount, fetchUnfinishedUserCount, fetchUserDateCountAverage, fetchUsersByGender, fetchUserSimResults, createUser, generateUser, updateUser, deleteUser, deleteAllUsers}