import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import InputField from './InputField';
import React from 'react';

function UserEditor({ auth, showError, showSuccess }) {
  const { userId } = useParams();
  
  const [error, setError] = useState('');
  const [pending, setPending] = useState(true);
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [role, setRole] = useState();
  const [user, setUser]= useState();
  const [password, setPassword] = useState();
  const [dateCreated, setCreationDate] = useState();

  useEffect(() => {
    setPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/user/${userId}`, {
      method: 'get',
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setEmail(res.data.email)
       setFullName(res.data.fullName)
       setGivenName(res.data.givenName)
       setFamilyName(res.data.familyName)
       setUser(res.data)
       setCreationDate(res.data.dateCreated)
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        
        setError(err.message);
        showError(err.message);
        setPending(false);
      });
  }, [auth, showError, userId]);

  useEffect(() => {
    setPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/user/list`, {
      method: 'get',
      params: { pageSize: 1000 },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);setPending(false)
      });
  }, [auth, showError]);

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  function userUpdateSubmit(evt) {
    evt.preventDefault();
    setPending(true);

    axios(`${process.env.REACT_APP_API_URL}/api/user/${userId}`, {
      method: 'put',
      data: {fullName, password, familyName, givenName  },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        showSuccess(res.data.message);setPending(false)
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);setPending(false)
      });
  }

 

  

  



  return (
    <div>
      <h1>User </h1>
      






      {pending && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}


<div className="bugEditor-bugInfo border border-5 p-3 my-3 shadow text-center ">
        <h1 className="text-center">{fullName}</h1>
        <span className="lead">{email}</span>
        <p className="text-muted text-center" style={{ overflowWrap: 'break-word' }}>
          {userId}
        </p>
        <p className="text-muted text-center" style={{ overflowWrap: 'break-word' }}>
          Creation Date: {dateCreated}
        </p>
        <hr></hr>
        </div>


      {!pending && user && (
        <form className="form-control text-center">
          <p className = "display-6">Edit User</p>
          <InputField
            label="Given Name"
            id="userEditor-givenName"
            type="text"
            value={givenName}
            onChange={(evt) => onInputChange(evt, setGivenName)}
          />
          <InputField
            label="Family Name"
            id="userEditor-familyName"
            type="text"
            value={familyName}
            onChange={(evt) => onInputChange(evt, setFamilyName)}
          />

<InputField
            label="Full Name"
            id="userEditor-fullName"
            type="text"
            value={fullName}
            onChange={(evt) => onInputChange(evt, setFullName)}
          />
          
          <InputField
            label="Password"
            id="userEditor-givenName"
            type="text"
            value={password}
            onChange={(evt) => onInputChange(evt, setPassword)}
          />

<button className="btn btn-primary mt-2 mb-5" type="submit" onClick={(evt) => userUpdateSubmit(evt)}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
export default UserEditor;
