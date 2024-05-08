import { BASEURL } from ".";
import axios from 'axios';
const PATH = `${BASEURL}/matches`

/* MATCHES GETS */
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

/* MATCHES POSTS */
const createMatch = async (userID, dateCount)=>{
    const payload = {userID, dateCount}
    return await axios.post(`${PATH}/`, payload);
};

const completeMatch = async (id, matchData)=>{
    return await axios.put(`${PATH}/complete/${id}`, matchData);
};

/* MATCHES UPDATE */
const updateMatch =  async (id, matchUpdate)=>{
    return await axios.put(`${PATH}/${id}`, matchUpdate);
};


/* MATCHES DELETE */
const deleteMatch =  async (id)=>{
    return await axios.delete(`${PATH}/${id}`);
};

/* MATCHES DELETE */
const deleteMatches =  async ()=>{
    return await axios.delete(`${PATH}`);
};


export {fetchMatches, fetchActiveMatches, fetchMatchesByStatus, fetchMatchByID, createMatch, completeMatch, updateMatch, deleteMatch, deleteMatches};