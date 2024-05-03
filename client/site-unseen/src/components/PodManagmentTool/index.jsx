/* REACT */
import {useState} from "react";
/* STYLES */
import './styles.css';
/* BOOTSTRAP */
import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup"
import Button from 'react-bootstrap/Button';
/** API */
import { addPods, deletePods } from "../../api/pods";
/* FAKER */
const { faker } = require('@faker-js/faker')


const PodManagmentTools = ({pods })=>{
    const [podAdditionCount, setPodAdditionCount] = useState(1);
    const [podRemovalCount, setPodRemovalCount] = useState(1);


    const PodAdditionChangeHandler = (e)=>{
        const update = parseInt(e.target.value);
        if(update<=0){
            setPodAdditionCount(0);
        }else{
            setPodAdditionCount(update);
        }
    }
    const PodAdditionSubmissionHandler = ()=>{
        addPods(podAdditionCount)
    }
    const PodRemovalChangeHandler = (e)=>{
        const update = parseInt(e.target.value);
        if(update<=0){
            setPodRemovalCount(0);
        }else
        if( update > pods.length){
            setPodRemovalCount(pods.length);
        }else {
        setPodRemovalCount(update);
        }
    }
    const PodRemovalSubmissionHandler = ()=>{
        deletePods(podRemovalCount)
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
                    <Button onClick={()=>deletePods(pods.length)}>
                        Remove All Pods
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PodManagmentTools;