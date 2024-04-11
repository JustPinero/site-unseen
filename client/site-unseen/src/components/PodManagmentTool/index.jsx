/* REACT */
import {useState} from "react";
/* BOOTSTRAP */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
/* FAKER */
const { faker } = require('@faker-js/faker')


const UserGenerationTools = ({pods, addPods, removePods})=>{
    const [podRemovalCount, setPodRemovalCount] = useState(1);

    return (
        <div>
            <div>
                <div>
                    <Form>
                        <InputGroup className="mb-3">
                            <Form.Control
                            placeholder="Recipient's username"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            />
                            <Button variant="outline-secondary" id="button-addon2">
                            Add Pods
                            </Button>
                        </InputGroup>
                    </Form>
                </div>
                <div>
                    <Form>
                        <InputGroup className="mb-3">
                            <Form.Control
                            placeholder="Recipient's username"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            />
                            <Button variant="outline-secondary" id="button-addon2">
                            Remove Pods
                            </Button>
                        </InputGroup>
                    </Form>
                </div>
            </div>
            <div>
                <div>
                    <Button onClick={()=>removedPods(pods.length)}>
                        Empty All Pods
                    </Button>
                </div>
                <div>
                    <Button onClick={()=>removedPods(pods.length)}>
                        Remove All Pods
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UserGenerationTools