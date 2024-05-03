import { BASEURL } from ".";
import axios from 'axios';
const PATH = `${BASEURL}/users`

/* USER GETS */
const fetchUsers = async ()=>{
    try{
        return await axios.get(`${PATH}`);
    }
    catch(err){
        console.log("ERROR:  ", err)
    }
};
const fetchUserByID = async (id)=>{
    return await axios.get(`${PATH}/${id}`);
};

const fetchElligibleUsers = async (dateCount)=>{
    return await axios.get(`${PATH}/dates/${dateCount}`);
};

const fetchUsersByGender = async (gender)=>{
    return await axios.get(`${PATH}/gender/${gender}`);
};

/* USER POSTS */
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

export {fetchUsers,fetchUserByID, fetchElligibleUsers, fetchUsersByGender, createUser, generateUser, updateUser, deleteUser}