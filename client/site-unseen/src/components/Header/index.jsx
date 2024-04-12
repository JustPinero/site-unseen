import SessionTimer from "../SessionTimer"

const Header = ({sessionLength})=>{
    return(
        <div>
            <SessionTimer sessionLength={sessionDuration}/>
        </div>
    )
}

export default Header;