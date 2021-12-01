import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import InputField from './InputField';
import React from 'react';

function BugEditor({ auth, showError, showSuccess }) {
  const { bugId } = useParams();
  const [bug, setBug] = useState(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [closed, setClosed] = useState(true);
  const [classification, setClassification] = useState('');
  const [assignedToUserId, setAssignedToUserId] = useState('');
  const [users, setUsers] = useState(null);

  useEffect(() => {
    setPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/bug/${bugId}`, {
      method: 'get',
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setPending(false);
        setBug(res.data.bug);
        setTitle(res.data.bug.title);
        setDescription(res.data.bug.description);
        setStepsToReproduce(res.data.bug.stepsToReproduce);
        setClosed(res.data.bug.closed);
        setClassification(res.data.bug.classification);
        setAssignedToUserId(res.data.bug.assignedToUserId);
      })
      .catch((err) => {
        console.error(err);
        setPending(false);
        setError(err.message);
        showError(err.message);
      });
  }, [auth, showError, bugId]);

  useEffect(() => {
    axios(`${process.env.REACT_APP_API_URL}/api/user/list`, {
      method: 'get',
      params: { pageSize: 1000 },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
      });
  }, [auth, showError]);

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  function bugEditorSubmit(evt) {
    evt.preventDefault();
    // axios(`${process.env.REACT_APP_API_URL}/api/bug/${bugId}`, {
    //   method: 'put',
    //   data: { title, description, stepsToReproduce },
    //   headers: {
    //     authorization: `Bearer ${auth?.token}`,
    //   },
    // })
    //   .then((res) => {
    //     console.log(res.data);
    //     showSuccess(res.data.message);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     showError(err.message);
    //   });

    // axios(`${process.env.REACT_APP_API_URL}/api/bug/${bugId}/classify`, {
    //   method: 'put',
    //   data: { classification },
    //   headers: {
    //     authorization: `Bearer ${auth?.token}`,
    //   },
    // })
    //   .then((res) => {
    //     console.log(res.data);
    //     showSuccess(res.data.message);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     showError(err.message);
    //   });

    // axios(`${process.env.REACT_APP_API_URL}/api/bug/${bugId}/close`, {
    //   method: 'put',
    //   data: { closed },
    //   headers: {
    //     authorization: `Bearer ${auth?.token}`,
    //   },
    // })
    //   .then((res) => {
    //     console.log(res.data);
    //     showSuccess(res.data.message);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     showError(err.message);
    //   });

    axios(`${process.env.REACT_APP_API_URL}/api/bug/${bugId}/assign`, {
      method: 'put',
      data: { assignedToUserId },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        showSuccess(res.data.message);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
      });
  }

  return (
    <div>
      <h1>Bug Editor</h1>
      <div>{bugId}</div>
      {pending && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {!pending && bug && (
        <form>
          <InputField
            label="Title"
            id="bugEditor-title"
            type="text"
            value={title}
            onChange={(evt) => onInputChange(evt, setTitle)}
          />
          <InputField
            label="Description"
            id="bugEditor-description"
            type="text"
            value={description}
            onChange={(evt) => onInputChange(evt, setDescription)}
          />
          <InputField
            label="Steps To Reproduce"
            id="bugEditor-stepsToReproduce"
            type="text"
            value={stepsToReproduce}
            onChange={(evt) => onInputChange(evt, setStepsToReproduce)}
          />

          <div>
            <label htmlFor="bugEditor-classification" className="mb-2">
              Classification
            </label>
            <select
              className="form-select mb-2"
              value={classification}
              onChange={(evt) => onInputChange(evt, setClassification)}
            >
              <option value="unapproved">Unapproved</option>
              <option value="approved">Approved</option>
              <option value="unclassified">Unclassified</option>
              <option value="duplicate">Duplicate</option>
            </select>
          </div>

          <div>
            <label htmlFor="bugEditor-AssignTo" className="mb-2">
              Assign To
            </label>
            <select
              id="bugEditor-AssignTo"
              name="assignedToUserId"
              className="form-select mb-2"
              onChange={(evt) => onInputChange(evt, setAssignedToUserId)}
              value={assignedToUserId}
            >
              {/* <option value="613bb42da1c4976b55b78d24">jimjones@yahoo.com</option>
              <option value="613bc5beee16e1827ad40878">bigmych25@yahoo.com</option> */}
              {_.map(users, (user) => (
                <option key={user._id} value={user._id}>{user.fullName} ({user.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bugEditor-closed" className="mb-2">
              Closed?
            </label>
            <select className="form-select mb-2" onChange={(evt) => onInputChange(evt, setClosed)} value={closed}>
              <option value={false}>Opened</option>
              <option value={true}>Closed</option>
            </select>
          </div>

          <button className="btn btn-primary mt-5" type="submit" onClick={(evt) => bugEditorSubmit(evt)}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
export default BugEditor;
