/* REACT */
import { useState, useEffect } from 'react';
/* BOOTSTRAP */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
/* CUSTOM COMPONENTS */
import MatchUserOption from './MatchUserOption';
/* STYLES */
import "./styles.css"

const MatchHalf = ({match1Data, match2Data, userOptions, pods, updateHalf, clearHalf, updatePods, updateUsers, isConfirmed})=>{
  /* LOCAL STATE */
  // MODAL
  const [show, setShow] = useState(false);
  //FORM STATE
  //selectedUser
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPod, setSelectedPod] = useState(null)

  useEffect(()=>{
    if(selectedUser){
      const updatedUserData = {...selectedUser, isInDate:true}
      const closestPodNumber = selectedUser.closestPods[0]
      const closestPod = pods[closestPodNumber]
      updateUsers(updatedUserData.id, updatedUserData)
      setSelectedPod(closestPod)
    }
  }, [selectedUser])

  useEffect(()=>{
    if(selectedUser){
      const updatedPodData = {...selectedPod, isOccupied:true}
      updatePods(updatedPodData.id, updatedPodData)
    }
  }, [selectedUser])

  useEffect(()=>{
    if(selectedPod && selectedUser){
      saveUpdateHandler()
    }
  },[selectedPod])
/* HANDLERS */
// CLEAR HANDLERS
  const clearUser = ()=>{
    const updatedUserData = {...selectedUser, isInDate:false}
    updateUsers(updatedUserData.id, updatedUserData)
    setSelectedUser(null)
  }
  const clearPod = ()=>{
    const updatedPodData = {...selectedPod, isOccupied:false}
    updatePods(updatedPodData.id, updatedPodData)
    setSelectedPod(null)
  }
//MODAL
  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => setShow(true);
  //SUBMISSION
  const saveUpdateHandler = ()=>{
    const updatedUserData = {...selectedUser, isInDate:true}
    const formattedSelection = {...selectedPod, isOccupied:true, occupantID:selectedUser.id, occupantData: updatedUserData }
    updateHalf(formattedSelection)
    handleClose()
  }
  return (
    <>
      <Button disabled={isConfirmed} style={{borderStyle:"none"}} className="matchbutton" variant={match1Data ? "transparent" : "info"} onClick={handleShow}>
        <div style={{color: "white"}}>{match1Data && match2Data ? `POD ${match1Data.id} POD ${match2Data.id}` : "Select User" }</div>
        <div className="matchnames">
          <div>{match1Data ? ` ${match1Data.occupantData.username}` :  null}</div>{(match1Data && match2Data)&& " + "}
          <div>{match2Data ? ` ${match2Data.occupantData.username}` :  null}</div>
        </div>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Match User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
          <div className="matchoptionsbody-container">
            <h1>Available Users</h1>
            <div className="matchuser-list">
            {
              userOptions ?
              userOptions.map(userOption=>{
                return <MatchUserOption key={userOption.id} userData={userOption} clickFunction={()=>setSelectedUser(userOption)} />
              }): "No users are currently available"
            }
            </div>
          </div>
        }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {
            (selectedUser && selectedPod) &&
            <Button variant="primary" onClick={saveUpdateHandler}>
            Save
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MatchHalf;