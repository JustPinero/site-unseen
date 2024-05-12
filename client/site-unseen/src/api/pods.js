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

/* COUNTS */
/* PODS COUNT */
const fetchPodsCount = async ()=>{
    return await axios.get(`${PATH}/count`);
};


const addPods = async (podCount)=>{
    try{
        console.log("ADD PODS:  ", podCount)
        await axios.post(`${PATH}/generate/${podCount}`);
    }
    catch(err){
        console.log("ERROR:  ", err)
    }
};

/* PODS POSTS */
const addPod = async ()=>{
    await axios.post(`${PATH}/`);
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

const deleteAllPods =  async ()=>{
    return await axios.delete(`${PATH}/removeall`);
};


export {fetchPods, fetchPodsByStatus, fetchPodsByID, fetchPodsCount, addPod, addPods, updatePod, emptyPod, deletePod, deletePods, deleteAllPods};