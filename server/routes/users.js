import {generateDummyUserData} from "../../script/seed_users"
//GET ALL USERS
app.get('/api/users', async (request, response) => {
    try{
        console.log("FETCHING USERS")
        var sql = "SELECT * FROM users INNER JOIN user_info ON users.id = user_info.user_id"
        var users = await pool.query(sql)
        const userLists = {  users }
        response.send(userLists)
    }catch (error) {
        response.send(false)
    }
})


app.post('/api/users/:number', async (request, response) => {
    try{
        console.log("Generating USERS")
        generateDummyUserData(number)
        var sql = "SELECT * FROM users INNER JOIN user_info ON users.id = user_info.user_id"
        var users = await pool.query(sql)
        const userLists = {  users }
        response.send(userLists)
    }catch (error) {
        response.send(false)
    }
})