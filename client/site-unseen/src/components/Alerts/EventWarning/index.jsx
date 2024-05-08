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


/*
psql --host=ec2-54-157-172-245.compute-1.amazonaws.com  --port=5432 --username= vzzioibnyrjjum --password= f88e8d56757a994985a620e0e200f0588fa77b53841e95e0f4bb2d2e7aefebce --dbname=db0t6jjote93r
 
 
 */