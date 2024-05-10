/* REACT */
import {useState} from "react";
/* STYLES */
import './styles.css';
/* BOOTSTRAP */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
/* API */
import { generateUser, deleteAllUsers } from "../../api/users";


const UserGenerationTools = ({users, pods, podCount })=>{
    const [userGenerationNumber, setUserGenerationNumber] = useState(1);
    const [showfilters, setShowFilters] = useState(false)
    const [generatedUserHasGender, setGeneratedUserHasGender] = useState(false)
    const [generatedUserGender, setGeneratedUserGender] = useState("")
    const [generatedUserHasSexuality, setGeneratedUserHasSexuality] = useState(false)
    const [generatedUserSexuality, setGeneratedUserSexuality] = useState("")

    const toggleShowFilters = ()=>{
        let updatedShowFilters = !showfilters;
        setShowFilters(updatedShowFilters)
        if(updatedShowFilters ===false){
            setGeneratedUserHasSexuality(false)
            setGeneratedUserHasGender(false);
            setGeneratedUserSexuality("")
            setGeneratedUserGender("")
        }
    }

    const toggleGeneratedUserHasGender = ()=>{
        let updatedHasGender = !generatedUserHasGender;
        setGeneratedUserHasGender(updatedHasGender)
        if(updatedHasGender ===false){
            setGeneratedUserGender("")
        }
    }
    const generatedUserGenderChangeHandler = (e)=>{
        const updatedGender = e.target.value;
        setGeneratedUserGender(updatedGender)
    }
    const toggleGeneratedUserHasSexuality = ()=>{
        let updatedHasSexuality = !generatedUserHasSexuality;
        setGeneratedUserHasSexuality(updatedHasSexuality)
        if(updatedHasSexuality ===false){
            setGeneratedUserSexuality("")
        }
    }
    const generatedUserSexualityChangeHandler = (e)=>{
        const updatedSexuality = e.target.value;
        setGeneratedUserSexuality(updatedSexuality)
    }

    const numberChangeHandler = (e)=>{
        setUserGenerationNumber(e.target.value)
    }

    const generationRequestionSubmissionHandler = async ()=>{
        const generationDetails = {generatedUserHasGender, generatedUserGender, generatedUserHasSexuality, generatedUserSexuality} ;
        await generateUser(userGenerationNumber, generationDetails)
    }
    return (
        <div>
            <h3>User Generation</h3>
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
            <Form.Label>
            Show Filters
            </Form.Label>
            <Form.Check
                type="switch"
                id="custom-switch"
                value={showfilters}
                onChange={toggleShowFilters}
            />
            {showfilters &&
            <div className="usergen-filterbox">
                <div className="usergen-switch">
                    <Form.Label>
                        Gender
                    </Form.Label>
                    <Form.Check
                        type="switch"
                        id="generated-user-gender"
                        value={generatedUserHasGender}
                        onChange={toggleGeneratedUserHasGender}
                    />
                    {generatedUserHasGender &&
                        <Form.Select aria-label="SelectGender" value={generatedUserGender} onChange={generatedUserGenderChangeHandler}>
                        <option value="">Select Generated User Gender</option>
                        <option value="non-binary">Non-Binary</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        </Form.Select>
}               </div>
                <div className="usergen-switch">
                    <Form.Label>
                        Sexuality
                    </Form.Label>
                    <Form.Check
                        type="switch"
                        id="generated-user-sexuality"
                        value={generatedUserHasSexuality}
                        onChange={toggleGeneratedUserHasSexuality}
                    />
                        {generatedUserHasSexuality &&
                            <Form.Select aria-label="SelectGender" value={generatedUserSexuality} onChange={generatedUserSexualityChangeHandler}>
                            <option value="">Select Generated User Sexual Preference</option>
                            <option value="bisexual">Bisexual</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </Form.Select>
                    }
                </div>
            </div>
            }
            <div className="usergen-buttonbox">
                <Button onClick={generationRequestionSubmissionHandler}>
                    Generate Users
                </Button>
                <Button onClick={()=>deleteAllUsers()}>
                    Delete All Users
                </Button>
            </div>
            <div>

            </div>
            </Form>
        </div>
    )
}

export default UserGenerationTools