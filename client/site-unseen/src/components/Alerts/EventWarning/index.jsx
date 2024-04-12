import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

function EventWarning({affectedUsers}) {
  const [show, setShow] = useState(false);
  useEffect(()=>{
    if(affectedUsers.length){
      setShow(true);
    }
  }, [affectedUsers])

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Warning Event Requirement Unment</Alert.Heading>
        <p>
          {`The following users have under the minimum number of matches:  `}
          {affectedUsers && affectedUsers.map((userData)=>(<span key={userData.id}>{userData.userName}</span>))}
        </p>
      </Alert>
    );
  }
  return null;
}

export default EventWarning;