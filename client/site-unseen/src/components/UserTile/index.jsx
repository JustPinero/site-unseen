import './styles.css';

const UserTile = ({
    userData,
    clickFunction
})=>{
    const {username} = userData
    return (
    <div className="usertile-container" onClick={clickFunction}>
        <p className="usertile-text"> {username} </p>
    </div>
)}

export default UserTile;