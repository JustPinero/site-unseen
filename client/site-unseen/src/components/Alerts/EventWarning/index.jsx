import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function EventWarning({affectedUsers}) {
  const [show, setShow] = useState(true);

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
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

export default EventWarning;