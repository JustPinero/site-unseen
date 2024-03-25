const fetchUsers = fetch('http://localhost:3001/api/browsing/userlists')
.then((res) => {
  return res.json();
})
.then((data) => {
    console.log("USER DATA:  ", data);
    const {users} = data;
    const {rows} = users;
    return rows;
});


export default fetchUsers;