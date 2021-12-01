import { useState } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import InputField from './InputField';

function LoginForm({ onLogin, showError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);

  const emailError = !email ? 'Email is required' : !email.includes('@') ? 'Email must include @ sign.' : '';

  const passwordError = !password
    ? 'Password is required'
    : password.length < 8
    ? 'Password must be at least 8 characters.'
    : '';

  function onClickSubmit(evt) {
    evt.preventDefault();
    setPending(true);
    setError('');
    setSuccess('');

    if (emailError || passwordError) {
      setError('Please Fix errors above.');
      showError('Please Fix errors above.');
    }
    axios(`${process.env.REACT_APP_API_URL}/api/user/login`, {
      method: 'post',
      data: { email, password  },
    })
      .then((res) => {
        setPending(false);
        console.log(res);
        setSuccess(res.data.message);
        const authPayload = jwt.decode(res.data.authToken);
        
        const auth = { email, userId: res.data.user, token: res.data.authToken, payload: authPayload };

        console.log(auth);
        onLogin(auth);
      })

      .catch((err) => {
        setPending(false);
        console.error(err);
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError); showError(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x) => <div>{x.message}</div>));
          } else {
            setError('Unknown');
          }
        }
      });



  }
  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  return (
    <div className="mx-2 py-3  border-dark border-2 rounded-3 shadow d-block mt-5">

      
      <h2 className="text-center">Login</h2>
{pending && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
{!pending && 
(
  <div>
      <form className="mx-4">
        <InputField
          label="Email"
          id="LoginForm-email"
          type="email"
          autoComplete="email"
          placeholder="example@example.com"
          value={email}
          onChange={(evt) => onInputChange(evt, setEmail)}
          error={emailError}
        />

         <InputField
          label="Password"
          id="LoginForm-password"
          type="password"
          autoComplete="current-password"
          placeholder=""
          value={password}
          onChange={(evt) => onInputChange(evt, setPassword)}
          error={passwordError}
        />
        

        <div className="d-flex flex-column justify-content-center pt-3">
          <div class="text-muted text-center mb-3">
            No account?
            <Link to="/register">
              Register Here.
            </Link>
          </div>
          <input class="btn btn-primary shadow" type="button" value="Login" onClick={(evt)=> onClickSubmit(evt)}></input>
        </div>
      </form>
      </div>
      )}
      <div className="mb-3 mt-3 text-danger text-center">{error}</div>
    </div>

  );
}

export default LoginForm;
