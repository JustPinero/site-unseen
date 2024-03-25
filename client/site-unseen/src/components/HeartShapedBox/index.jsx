import './styles.css';
import heartso from '../../assets/heartso.png';

const HeartShapedBox = ()=>{
    return(
        <div className = "heartshapedbox-container">
            <div className = "heart-container">
                <div className="heartcontent" >
                    
                </div>
                <img className="heart-img" src={heartso} />
            </div>
        </div>
    )
}
export default HeartShapedBox