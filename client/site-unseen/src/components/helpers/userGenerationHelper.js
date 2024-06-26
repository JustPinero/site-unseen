const { faker } = require('@faker-js/faker')

const userGenerationHelper = (userGenerationNumber, generatedUserHasGender, generatedUserGender, generatedUserHasSexuality, generatedUserSexuality )=>{
    let generatedUserList =[];
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
    for (let i =0; i<= userGenerationNumber; i++ ){
        let newUserID= i;
        let newUserPassword = "$2b$10$7yu6NkhTEk/uCAsXjlAS2OqpDQ2mSP0WQCNtKK97hCDDC12xB/PPa" ;
        let newUserVerified = "YES";
        let newUserLastConnection = "2024-03-25T13:25:39.853Z";
        let newUserGender = generatedUserHasGender ? generatedUserGender : genderOptions.random();
        let newUserFirstName = newUserGender === "non-binary" ? faker.person.firstName() : faker.person.firstName(newUserGender);
        let newUserLastName = newUserGender === "non-binary" ? faker.person.lastName() : faker.person.lastName(newUserGender);
        let newUserEmail = faker.internet.email({newUserFirstName, newUserLastName})
        let newUserName = faker.internet.userName({newUserFirstName, newUserLastName})
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
    generatedUserList.push(newUser)
}
return generatedUserList;
}
export default userGenerationHelper;