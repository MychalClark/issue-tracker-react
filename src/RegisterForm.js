import { useState } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import InputField from './InputField';

function RegisterForm({ onLogin, showError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [emailMatch, setEmailMatch] = useState('');
  const [pending, setPending] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fullName, setFullName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');

  const emailError = !email ? 'Email is required' : !email.includes('@') ? 'Email must include @ sign.' : '';

  const passwordError = !password
    ? 'Password is required'
    : password.length < 8
    ? 'Password must be at least 8 characters.'
    : '';

  const passwordMatchError = !passwordMatch || password !== passwordMatch ? 'Passwords do not match.' : '';
  const emailMatchError = !emailMatch || email !== emailMatch  ? 'Emails do not match.' : '';
  const givenNameError = !givenName ? 'Given name required.' : '';
  const familyNameError = !familyName ? 'Family name required.' : '';
  const fullNameError = !fullName ? 'Full name required.' : '';

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
    setError('');
  }
  function onClickSubmit(evt) {
    evt.preventDefault();
    setPending(true);
    setError('');
    setSuccess('');

    if (
      emailError ||
      passwordError ||
      givenNameError ||
      familyNameError ||
      fullNameError ||
      passwordMatchError ||
      emailMatchError
    ) {
      setError('Please Fix errors above.');
      showError('Please Fix errors above.');
      setPending(false)
      return;
    }
    axios(`${process.env.REACT_APP_API_URL}/api/user/register`, {
      method: 'post',
      data: { email, password, fullName, givenName, familyName },
    })
      .then((res) => {
        setPending(false);
        console.log(res);
        setSuccess(res.data.message);
        const authPayload = jwt.decode(res.data.token);
        const auth = { email, userId: res.data.userId, token: res.data.token,fullName:res.data.fullName, payload: authPayload };

        console.log(auth);
        onLogin(auth);
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
  return (
    <div className="mx-2 py-3  border-dark border-2 rounded-3 shadow d-block mt-1 mb-5 pb-5">
      <h2 className="text-center">Register</h2>

      <form className="mx-4">
      {pending && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!pending && (<div>
        <InputField
          label="Email"
          id="RegisterForm-email"
          name="emailNew"
          type="email"
          autoComplete="email"
          placeholder="example@example.com"
          onChange={(evt) => onInputChange(evt, setEmail)}
          value={email}
          error={emailError}
        />

        <InputField
          label="Confirm Email"
          id="RegisterForm-emailConfirm"
          type="email"
          name="emailConfirm"
          autoComplete="email"
          placeholder="example@example.com"
          value={emailMatch}
          onChange={(evt) => onInputChange(evt, setEmailMatch)}
          error={emailMatchError}
        />

        <InputField
          label="Password"
          id="RegisterForm-password"
          name="passwordNew"
          autoComplete="new-password"
          type="password"
          value={password}
          onChange={(evt) => onInputChange(evt, setPassword)}
          error={passwordError}
        />

        <InputField
          label="Confirm Password"
          id="RegisterForm-passwordConfirm"
          name="confirmPassword"
          autoComplete="new-password"
          type="password"
          value={passwordMatch}
          onChange={(evt) => onInputChange(evt, setPasswordMatch)}
          error={passwordMatchError}
        />
        <InputField
          label="Given Name"
          id="RegisterForm-givenName"
          type="text"
          value={givenName}
          onChange={(evt) => onInputChange(evt, setGivenName)}
          error={givenNameError}
        />
        <InputField
          label="Family Name"
          id="RegisterForm-familyName"
          type="text"
          value={familyName}
          onChange={(evt) => onInputChange(evt, setFamilyName)}
          error={familyNameError}
        />

        <InputField
          label="Full Name"
          id="RegisterForm-fullName"
          type="text"
          value={fullName}
          onChange={(evt) => onInputChange(evt, setFullName)}
          error={fullNameError}
        />

        <div className="d-flex flex-column justify-content-center pt-3">
          <div class="text-muted">
            No account?
            <Link to="/login">Login Here.</Link>
          </div>
          <input
            class="btn btn-primary shadow"
            type="button"
            value="Register"
            onClick={(evt) => onClickSubmit(evt)}
          ></input>
        </div>
        </div>)}
      </form>
      <div className="mb-3 mt-3 text-danger text-center">{error}</div>
    </div>
  );
}

export default RegisterForm;
