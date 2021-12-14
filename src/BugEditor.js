import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import InputField from './InputField';
import React from 'react';
import { MdDescription } from 'react-icons/md';
import { IoFootstepsSharp } from 'react-icons/io5';
import { FaUser, FaComments, FaLock } from 'react-icons/fa';
import { GiSpyglass } from 'react-icons/gi';

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
  const [comments, setComments] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [assignedUserName, setAssignedToUserName] = useState('');
  const [bugDate, setBugDate] = useState(null);
  const [createComment, setCreateComment] = useState('');

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
        setBug(res.data.bug);
        setTitle(res.data.bug.title);
        setDescription(res.data.bug.description);
        setStepsToReproduce(res.data.bug.stepsToReproduce);
        setClosed(res.data.bug.closed);
        setClassification(res.data.bug.classification);
        setAssignedToUserId(res.data.bug.assignedToUserId);
        setAssignedToUserName(res.data.bug.assignedToUserName);
        setAuthorName(res.data.bug.authorName);
        setBugDate(res.data.bug.dateCreated);
        setPending(false);
      })
      .catch((err) => {
        console.error(err);

        setError(err.message);
        showError(err.message);
        setPending(false);
      });
  }, [auth, showError, bugId]);

  useEffect(() => {
    setPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/comment/${bugId}/list`, {
      method: 'get',
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        setComments(res.data);
        console.log(res.data);
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
        setPending(false);
      });
  }, [auth, showError]);

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
        setUsers(res.data);
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
        setPending(false);
      });
  }, [auth, showError]);

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  function bugAssignSubmit(evt) {
    evt.preventDefault();
    setPending(true);

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
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
        setPending(false);
      });
  }

  function bugUpdateSubmit(evt) {
    evt.preventDefault();
    setPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/bug/${bugId}`, {
      method: 'put',
      data: { title, description, stepsToReproduce },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        showSuccess(res.data.message);
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
        setPending(false);
      });
  }

  function bugClassifySubmit(evt) {
    evt.preventDefault();
    setPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/bug/${bugId}/classify`, {
      method: 'put',
      data: { classification },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        showSuccess(res.data.message);
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
        setPending(false);
      });
  }

  function bugCloseSubmit(evt) {
    evt.preventDefault();
    setPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/bug/${bugId}/close`, {
      method: 'put',
      data: { closed },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        showSuccess(res.data.message);
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
        setPending(false);
      });
  }

  return (
    <div>
      {pending && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      <div className="bugEditor-bugInfo border border-5 p-3 my-3 shadow ">
        <h1 className="text-center">{title}</h1>
        <p className="text-muted text-center" style={{ overflowWrap: 'break-word' }}>
          {bugId}
        </p>
        <p className="text-muted text-center" style={{ overflowWrap: 'break-word' }}>
          Created By: {authorName}
        </p>
        <p className="text-muted text-center" style={{ overflowWrap: 'break-word' }}>
          Creation Date: {bugDate}
        </p>
        <hr></hr>

        <div className="display-6">
          <MdDescription className="mb-1" />
          Description
        </div>
        <p>{description}</p>
        <hr></hr>
        <div className="display-6">
          <IoFootstepsSharp className="mb-1" />
          Steps to Reproduce
        </div>
        <p>{stepsToReproduce}</p>
        <hr></hr>

        <div className="row align-items-start text-center p-4">
          <div className="col">
            <div>
              <FaUser className="mb-1" /> Assignee:
            </div>
            <div>{assignedUserName}</div>
          </div>
          <div className="col">
            <div>
              <GiSpyglass className="mb-1" /> Classification:
            </div>
            <div>{classification}</div>
          </div>
          <div className="col">
            <div>
              <FaLock className="mb-1" /> Closed:
            </div>
            <div>{closed ? 'Closed' : 'Open'}</div>
          </div>
          <div className="col">
            <div>
              <FaComments className="mb-1" /> Comments:
            </div>
            <div>{assignedUserName}</div>
          </div>
        </div>
      </div>


      
      {/* comments */}
      <div className="pt-5">
        <div className="display-6">Comments </div>

       <form className="form-control">
       <label className="form-label" htmlFor="bugEditor-addComment">
        Add Comment
      </label>
          <div class="input-group">
  <span class="input-group-text"><button class="btn btn-primary" type="button">Post</button></span>

  <InputField
            id="bugEditor-addComment"
            type="textarea"
            value={createComment}
            onChange={(evt) => onInputChange(evt, setCreateComment)}
          />

</div>
</form>

        <hr></hr>
        {_.map(comments, (comment) => (
          <div className="card m-3">
            <div className="card-body">
              <div className="card-title">{comment.userId}</div>
              <div className="text-muted">{comment.timeCreated}</div>
              <hr></hr>
              <p className="card-text">{comment.userComment}</p>
            </div>
          </div>
        ))}
        <hr></hr>
      </div>

      {!pending && bug && (
        <form className="form-control text-center">
          <p className="display-6">Update Bug</p>
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

          <button className="btn btn-primary mt-2 mb-5" type="submit" onClick={(evt) => bugUpdateSubmit(evt)}>
            Submit
          </button>

          <div>
            <p className="display-6">Classify Bug</p>
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
            <button className="btn btn-primary mt-2 mb-5" type="submit" onClick={(evt) => bugClassifySubmit(evt)}>
              Submit
            </button>
          </div>

          <div>
            <p className="display-6">Assign Bug</p>

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
              {_.map(users, (user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>
            <button className="btn btn-primary mt-2 mb-5" type="submit" onClick={(evt) => bugAssignSubmit(evt)}>
              Submit
            </button>
          </div>

          <div>
            <p className="display-6">Close Bug</p>
            <label htmlFor="bugEditor-closed" className="mb-2">
              Closed?
            </label>
            <select className="form-select mb-2" onChange={(evt) => onInputChange(evt, setClosed)} value={closed}>
              <option value={false}>Opened</option>
              <option value={true}>Closed</option>
            </select>
            <button className="btn btn-primary mt-2 mb-5" type="submit" onClick={(evt) => bugCloseSubmit(evt)}>
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
export default BugEditor;
