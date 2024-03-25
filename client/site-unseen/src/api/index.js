const fetchUsers = fetch('localhost:3001/api/browsing/userlists')
.then((res) => {
  return res.json();
})
.then((data) => {
    console.log(data);
    return data
});


export default fetchUsers;