/* REACT */
import {useState, useEffect} from "react";
/* STYLES */
import './styles.css';
/* BOOTSTRAP */
import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup"
import Button from 'react-bootstrap/Button';
/** API */
import { addPods, deletePod, deletePods, deleteAllPods } from "../../api/pods";



const PodManagmentTools = ({pods, podCountUpdateHandler, podCount })=>{
    const [podAdditionCount, setPodAdditionCount] = useState(1);
    const [podRemovalCount, setPodRemovalCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false)

    const PodAdditionChangeHandler = (e)=>{
        const update = parseInt(e.target.value);
        if(update<=1){
            setPodAdditionCount(1);
        }else{
            setPodAdditionCount(update);
        }
    }
    const PodRemovalChangeHandler = (e)=>{
        const update = parseInt(e.target.value);
        if(update<=1){
            setPodRemovalCount(1);
        }else
        if( update > podCount ){
            setPodRemovalCount(pods.length);
        }else {
            setPodRemovalCount(update);
        }
    }

    //SUBMISSION HANDLERS
    const PodRemovalSubmissionHandler = async ()=>{
        await deletePods(podRemovalCount).then(podCountUpdateHandler)
    }

    const PodAdditionSubmissionHandler = async (e)=>{
        await addPods(podAdditionCount)
    }

    const removeAllPodsButtonClickHandler = async (e)=>{
        await deleteAllPods()
    }

    return (
        <div>
            <h3>Pod Management</h3>
            <div className="podman-form-container">
                <div className="podman-form">
                    <Form>
                        <InputGroup className="mb-3">
                            <Form.Control
                            placeholder="Pod Addition Count"
                            aria-label="Add Pods"
                            aria-describedby="basic-addon2"
                            value={podAdditionCount}
                            onChange={PodAdditionChangeHandler}
                            type="number"
                            />
                            <Button variant="outline-secondary" id="button-addon2" onClick={PodAdditionSubmissionHandler}>
                            Add Pods
                            </Button>
                        </InputGroup>
                    </Form>
                </div>
                <div className="podman-form">
                    <Form>
                        <InputGroup className="mb-3">
                            <Form.Control
                            placeholder="Pod Removal Count"
                            aria-label="Remove Pods"
                            aria-describedby="basic-addon2"
                            value={podRemovalCount}
                            onChange={PodRemovalChangeHandler}
                            type="number"
                            />
                            <Button onClick={PodRemovalSubmissionHandler} variant="outline-secondary" id="button-addon2">
                                Remove Pods
                            </Button>
                        </InputGroup>
                    </Form>
                </div>
            </div>
            <div className="podman-buttonbox">
                {/* <div>
                    <Button onClick={()=>removePods(pods.length)}>
                        Empty All Pods
                    </Button>
                </div> */}
                <div>
                    <Button onClick={removeAllPodsButtonClickHandler}>
                        Remove All Pods
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PodManagmentTools;