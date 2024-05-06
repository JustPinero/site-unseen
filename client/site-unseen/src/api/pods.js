import { BASEURL } from ".";
import axios from 'axios';
const PATH = `${BASEURL}/pods`

/* PODS GETS */
const fetchPods = async ()=>{
    return await axios.get(`${PATH}`);
};

const fetchPodsByStatus = async (podStatus)=>{
    return await axios.get(`${PATH}/status/${podStatus}`);
};

const fetchPodsByID = async (id)=>{
    return await axios.get(`${PATH}/${id}`);
};

/* PODS POSTS */
const addPod = async ()=>{
    return await axios.post(`${PATH}`);
};

const addPods = async (podCount)=>{
    try{
        console.log("POD COUNT:  ", podCount)
        for(let i= 0; i<podCount; i++){
            console.log("MAKING POD", i)
            await axios.post(`${PATH}`);
        }
    }
    catch(err){
        console.log("ERROR:  ", err)
    }
};

/* PODS UPDATE */
const updatePod =  async (id, podUpdate)=>{
    return await axios.put(`${PATH}/${id}`, podUpdate);
};

const emptyPod =  async (id)=>{
    const podUpdate = {status:"vacant", occupant_id:null};
    return await axios.put(`${PATH}/${id}`, podUpdate);
};


/* PODS DELETE */
const deletePod =  async (id)=>{
    return await axios.delete(`${PATH}/${id}`);
};

const deletePods =  async (podcount)=>{
    return await axios.delete(`${PATH}/remove/${podcount}`);
};

export {fetchPods, fetchPodsByStatus, fetchPodsByID, addPod, addPods, updatePod, emptyPod, deletePod, deletePods};