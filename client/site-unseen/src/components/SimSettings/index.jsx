/* REACT */
import {useState} from "react";
/* STYLES */
import './styles.css';
/* BOOTSTRAP */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SimSettings = ({ 
    simIsRunning,
    dateCap,
    dateCapChangeHandler, 
    bufferDuration, 
    bufferDurationChangeHandler,
     dateDuration,
      dateDurationChangeHandler
    })=>{
   
    return (
        <div className="simsettings-container">
            <h5 className="simsettings-header_text">Simulation Settings</h5>
            <div className="simsettings-body">
            <div className="simsettings-box">
                <Form >
                    <Form.Label className={"simsettings-form_label"}>
                         Date Length (secs)
                    </Form.Label>
                    <Form.Control
                        id="datebuffer-form"
                        value={bufferDuration}
                        onChange={bufferDurationChangeHandler}
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        type="number"
                        disabled={simIsRunning}
                    /> 
                    <Form.Label className={"simsettings-form_label"}>
                        Date Grace Period (secs)
                    </Form.Label>
                    <Form.Control
                        id="dateduration-form"
                        value={dateDuration}
                        onChange={dateDurationChangeHandler}
                        type="number"
                        disabled={simIsRunning}
                    />
                </Form>
            </div>
            <div className="simsettings-box">
                <Form style={{marginLeft:"6px"}}>
                    <Form.Label className={"simsettings-form_label"}>
                        Minimum Number of Dates
                    </Form.Label>
                    <Form.Control
                        id="minimumdate-form"
                        value={dateCap}
                        onChange={dateCapChangeHandler}
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        type="number"
                        disabled={simIsRunning}
                    /> 
                </Form>
                <Form style={{marginLeft:"6px"}}>
                    <Form.Label className={"simsettings-form_label"}>
                        Maximum Number of Dates
                    </Form.Label>
                    <Form.Control
                        id="minimumdate-form"
                        value={dateCap}
                        onChange={dateCapChangeHandler}
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        type="number"
                        disabled={simIsRunning}
                    /> 
                </Form>
            </div>
            </div>
        </div>
    )
}

export default SimSettings