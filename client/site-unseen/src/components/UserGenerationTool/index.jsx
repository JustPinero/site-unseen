import {useState} from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const UserGenerationTools = ({updateUsers})=>{
    const [userGenerationNumber, setUserGenerationNumber] = useState(1);

    const numberChangeHandler = (e)=>{
        console.log(e.target.value)
        setUserGenerationNumber(e.target.value)
    }
    const generationRequestionSubmissionHandler = ()=>{
         fetch(`http://localhost:3001/api/users/${userGenerationNumber}`).then((res)=>{
            return res.json()
         }).then((data) => {
            const {users} = data;
            const {rows} = users;
            const updatedUserData = rows
            const formattedUpdatedUserData = updatedUserData.map(userData =>{
              const formattedUserData = {...userData, isInDate:false, dateCount:0, hasHadDatesWith:[]}
              return formattedUserData
            })
            updateUsers(formattedUpdatedUserData);
        });
    }
    return (
        <div>
            <Form>
                <Form.Label>Number of Users to Generate        
                </Form.Label>
                <Form.Control
                    value={userGenerationNumber}
                    onChange={numberChangeHandler}
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                    type="number"
                /> 
            <Form.Range value={userGenerationNumber} onChange={numberChangeHandler}/>
                <Button onClick={generationRequestionSubmissionHandler}>
                    Generate Users
                </Button>
            </Form>
        </div>
    )
}

export default UserGenerationTools