import './styles.css';

const UserTile = ({
    userData
})=>{
    const {username} = userData
    return (
    <div className="usertile-container">
        <p className="usertile-text"> {username} </p>
    </div>
)}

export default UserTile;