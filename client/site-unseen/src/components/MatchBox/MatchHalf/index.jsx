/* REACT */
import { useState, useEffect } from 'react';
/* BOOTSTRAP */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
/* CUSTOM COMPONENTS */
import MatchUserOption from './MatchUserOption';
import MatchPodOption from './MatchPodOption';
/* STYLES */
import "./styles.css"

const MatchHalf = ({matchData, userOptions, pods, updateHalf, clearHalf, updatePods, updateUsers, isConfirmed})=>{
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
      updateUsers(updatedUserData.id, updatedUserData)
    }
  }, [selectedPod])

  useEffect(()=>{
    if(selectedPod){
      const updatedPodData = {...selectedPod, isOccupied:true}
      updatePods(updatedPodData.id, updatedPodData)
    }
  }, [selectedPod])
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
      <Button disabled={isConfirmed} variant="light" onClick={handleShow}>
        <div>{matchData ? `POD ${matchData.id}` :  "Select User"}</div>
        <div>{matchData ? ` ${matchData.occupantData.username}` :  null}</div>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Match User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
        (selectedUser && selectedPod) ?
        <div>
          <Button  onClick={clearPod}>BACK</Button>
          <div className="matchselection-preview-container">
            <h5>POD {selectedPod.id}</h5>
            <h3>{selectedUser.firstname + " " + selectedUser.lastname }</h3>
          </div>
            
        </div> :
            selectedUser ? 
            <div className="matchoptionsbody-container">
              <Button onClick={clearUser}>BACK</Button>
            <h1>Available Pods</h1>
            <div className="matchpod-list">
            {
              pods ?
              pods.map((podOption)=>{
                if(!podOption.isOccupied){
                  return <MatchPodOption key={podOption.id} podData={podOption} clickFunction={()=>setSelectedPod(podOption)} />
                }
              }): "No users are currently available"
            }
              </div>
            </div>
            :
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