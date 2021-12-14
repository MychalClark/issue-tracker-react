import { useState } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import InputField from './InputField';

import { MdMail, RiLockPasswordFill } from 'react-icons/fa';

function ReportBug({ auth, showError, showSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);

  console.log(auth);

  const titleError = !title ? 'Please Enter Title For Bug.' : '';

  const descriptionError = !description ? 'Please Enter Description.' : '';

  const stepsToReproduceError = !stepsToReproduce ? 'Please Enter StepsToReproduce.' : '';

  function onClickSubmit(evt) {
    evt.preventDefault();
    setPending(true);
    setError('');
    setSuccess('');

    if (!description || !title || !stepsToReproduce) {
  
      showError('Please Fix Errors Above.');
      setPending(false);
    } else {
      axios(`${process.env.REACT_APP_API_URL}/api/bug/new`, {
        method: 'put',
        data: { title, description, stepsToReproduce },
        headers: {
          authorization: `Bearer ${auth?.token}`,
        },
      })
        .then((res) => {
          setPending(false);
          console.log(res);
          setSuccess(res.data.message);
          
          showSuccess(res.data.message);
        })

        .catch((err) => {
          setPending(false);
          console.error(err);
          const resError = err?.response?.data?.error;
          if (resError) {
            if (typeof resError === 'string') {
              setError(resError);
              showError(resError);
            } else if (resError.details) {
              setError(_.map(resError.details, (x) => <div>{x.message}</div>));
            } else {
              setError('Unknown');
            }
          }
        });
    }
  }
  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  return (
    <div className="text-center">

{!pending && !auth && (<div>
  
  <p className="text-danger">You need to be logged in to report a bug.</p>
  <Link to="/login">Login Here!</Link>



</div>)}


      {pending && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!pending && auth && (
        <form className="form-control">
          <h1>Report A Bug</h1>
          <InputField
            label="Title"
            id="bugEditor-title"
            type="text"
            value={title}
            onChange={(evt) => onInputChange(evt, setTitle)}
            error={titleError}
          />
          <InputField
            label="Description"
            id="bugEditor-description"
            type="text"
            value={description}
            onChange={(evt) => onInputChange(evt, setDescription)}
            error={descriptionError}
          />
          <InputField
            label="Steps To Reproduce"
            id="bugEditor-stepsToReproduce"
            type="text"
            value={stepsToReproduce}
            onChange={(evt) => onInputChange(evt, setStepsToReproduce)}
            error={stepsToReproduceError}
          />

          <button className="btn btn-primary mt-2 mb-5" type="submit" onClick={(evt) => onClickSubmit(evt)}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default ReportBug;
