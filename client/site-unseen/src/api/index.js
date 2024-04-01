const fetchUsers = fetch('http://localhost:3001/api/browsing/userlists')
.then((res) => {
  return res.json();
})
.then((data) => {
    const {users} = data;
    const {rows} = users;
    return rows;
});


export default fetchUsers;