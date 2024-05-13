import { BASEURL } from ".";
import axios from 'axios';
const PATH = `${BASEURL}/matches`;

/* MATCHES GETS */
const fetchMatchesData = async (dateDuration)=>{
    console.log("fetchMatchesData fired")
    const payload = {maxDateDuration:dateDuration}
    console.log("payload:  ", payload)
    return await axios.post(`${PATH}/data`, payload);
};

const fetchMatches = async ()=>{
    return await axios.get(`${PATH}/`);
};

const fetchActiveMatches = async ()=>{
    return await axios.get(`${PATH}/inprogress`);
};

const fetchMatchesByStatus = async (matchStatus)=>{
    return await axios.get(`${PATH}/status/${matchStatus}`);
};

const fetchMatchByID= async (id)=>{
    return await axios.get(`${PATH}/${id}`);
};

/* MATCHES GETS */
const fetchMatchCount= async ()=>{
    return await axios.get(`${PATH}/count`);
};


/* MATCHES POSTS */
const createMatch = async ( dateCount)=>{
    console.log("CREATE MATCH FIRED")
    try{
    const payload = { dateCount}
    return await axios.post(`${PATH}/`, payload);
    }
    catch(error){
        console.log("CREATE MATCH ERROR:  ", )
    }
};

const completeMatch = async (id, matchData)=>{
    console.log("completeMatch:  ", `${PATH}/complete/${id}`, "matchData:  ", matchData)
    return await axios.put(`${PATH}/complete/${id}`, matchData);
};

const completeMatches = async (matchesData)=>{
    const payload ={matches: matchesData}
    return await axios.post(`${PATH}/complete`, payload);
};


/* MATCHES UPDATE */
const updateMatch =  async (id, matchUpdate)=>{
    return await axios.put(`${PATH}/${id}`, matchUpdate);
};


/* MATCHES DELETE */
const deleteMatch =  async (id)=>{
    return await axios.delete(`${PATH}/remove/${id}`);
};

/* MATCHES DELETE */
const deleteMatches =  async ()=>{
    return await axios.delete(`${PATH}/reset`);
};


export {fetchMatchesData, fetchMatches, fetchActiveMatches, fetchMatchesByStatus, fetchMatchByID, fetchMatchCount, createMatch, completeMatch, completeMatches, updateMatch, deleteMatch, deleteMatches};