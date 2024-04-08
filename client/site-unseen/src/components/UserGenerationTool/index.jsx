/* REACT */
import {useState} from "react";
/* BOOTSTRAP */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
/* FAKER */
const { faker } = require('@faker-js/faker')

/* STATIC VALUES */
const genderOptions = ["male", "female", "non-binary"]
const sexualPreferenceOptions = ["bisexual", "male", "female"]
const softDefinerOptions = ["work", "dogs", "music", "travel", "outdoors", "books",
	"adventure", "food", "hiking", "sports", "gaming", "movies", "tv", "art",
	"nature", "animals", "cars", "tech", "fashion", "beauty", "fitness",
	"health", "science", "history", "politics", "religion", "philosophy",
	"psychology", "education", "family", "friends", "cats"]
/* HELPERS */
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function randomLimitedSelection(numberOfSelections, choices){
    let updatedChoices = choices;
    let selection = [];
    for(let i=0 ; i<numberOfSelections; i++){
        if(updatedChoices.length){
            let selectedOption = choices.random();
            updatedChoices = updatedChoices.filter((option)=> option!==selectedOption);
            selection.push(selectedOption);
        };
    };
    return selection;
}


const UserGenerationTools = ({updateUsers, addUsers, users})=>{
    const [userGenerationNumber, setUserGenerationNumber] = useState(1);
    const [showfilters, setShowFilters] = useState(false)
    const [generatedUserHasGender, setGeneratedUserHasGender] = useState(false)
    const [generatedUserGender, setGeneratedUserGender] = useState("")
    const [generatedUserHasSexuality, setGeneratedUserHasSexuality] = useState(false)
    const [generatedUserSexuality, setGeneratedUserSexuality] = useState("")

    const toggleShowFilters = ()=>{
        let updatedShowFilters = !showfilters;
        setShowFilters(updatedShowFilters)
    }

    const toggleGeneratedUserHasGender = ()=>{
        let updatedHasGender = !generatedUserHasGender;
        setGeneratedUserHasGender(updatedHasGender)
    }
    const generatedUserGenderChangeHandler = (e)=>{
        const updatedGender = e.target.value;
        console.log("UPDATED GENDER CHANGE:  ", updatedGender);
        setGeneratedUserGender(updatedGender)
    }
    const toggleGeneratedUserHasSexuality = ()=>{
        let updatedHasSexuality = !generatedUserHasSexuality;
        setGeneratedUserHasSexuality(updatedHasSexuality)
    }
    const generatedUserSexualityChangeHandler = (e)=>{
        const updatedSexuality = e.target.value;
        console.log("UPDATED GENDER CHANGE:  ", updatedSexuality);
        setGeneratedUserSexuality(updatedSexuality)
    }

    const numberChangeHandler = (e)=>{
        console.log(e.target.value)
        setUserGenerationNumber(e.target.value)
    }
    const generationRequestionSubmissionHandler = ()=>{
        const newUsers =[];
        for (let i =0; i<= userGenerationNumber; i++ ){
            let newUserID= users.length + i;
            let newUserPassword = "$2b$10$7yu6NkhTEk/uCAsXjlAS2OqpDQ2mSP0WQCNtKK97hCDDC12xB/PPa" ;
            let newUserVerified = "YES";
            let newUserLastConnection = "2024-03-25T13:25:39.853Z";
            let newUserGender = generatedUserHasGender ? generatedUserGender : genderOptions.random();
            let newUserFirstName = newUserGender === "non-binary" ? faker.name.firstName() : faker.name.firstName(newUserGender);
            let newUserLastName = newUserGender === "non-binary" ? faker.name.lastName() : faker.name.lastName(newUserGender);
            let newUserEmail = faker.internet.email(newUserFirstName, newUserLastName)
            let newUserName = faker.internet.userName(newUserFirstName, newUserLastName)
            let newUserAge = getRandomInt(18, 80);
            let newUserSexualPreference = generatedUserHasSexuality ? generatedUserSexuality : sexualPreferenceOptions.random();
            let newUserBiography = faker.lorem.paragraph();
            let newUserFameRating = 0;
            let newUserLocation = "unknown";
            let newUserInterests = randomLimitedSelection(5 , softDefinerOptions)
        let newUser = {
            id: newUserID,
            username: newUserName,
            firstname: newUserFirstName,
            lastname: newUserLastName,
            email: newUserEmail,
            password: newUserPassword,
            verified: newUserVerified,
            last_connection: newUserLastConnection,
            running_id: 1,
            user_id: newUserID,
            gender: newUserGender,
            age: newUserAge,
            sexual_pref: newUserSexualPreference,
            biography: newUserBiography,
            fame_rating: newUserFameRating,
            user_location: newUserLocation,
            ip_location: {
                x: 54.6177170307566,
                y: 59.63865767365587
            },
            interests: newUserInterests,
            isInDate: false,
            dateCount: 0,
            hasHadDatesWith: []
        }
        newUsers.push(newUser)
    }
    console.log("NEW USERS:  ", newUsers);
    addUsers(newUsers);
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
            <div>
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
}

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
            }

                <Button onClick={generationRequestionSubmissionHandler}>
                    Generate Users
                </Button>
            </Form>
        </div>
    )
}

export default UserGenerationTools