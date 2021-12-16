import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import InputField from './InputField';
import React from 'react';

function UserEditor({ auth, showError, showSuccess, me }) {
  const { userId } = useParams();

  const [error, setError] = useState('');
  const [pending, setPending] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [fullNameShow, setFullNameShow] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [roleFound, setRoleFound] = useState([]);

  const [user, setUser] = useState();
  const [password, setPassword] = useState();
  const [dateCreated, setCreationDate] = useState();
  const [editUser, setEditUser] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState('');
  const [userFound, setUserFound] = useState(false);
  const [checkDeveloper, setCheckDeveloper] = useState(false);
  const [checkTechnicalManager, setCheckTechnicalManager] = useState(false);
  const [checkBusinessAnalyst, setCheckBusinessAnalyst] = useState(false);
  const [checkProductManager, setCheckProductManager] = useState(false);
  const [checkQualityAnalyst, setCheckQualityAnalyst] = useState(false);
  const [mePage, setMePage] = useState(false);

  const passwordError = !password
  
    ? 'Password must be at least 8 characters.'
    : '';

  const passwordMatchError = !passwordMatch || password !== passwordMatch ? 'Passwords do not match.' : '';

  const givenNameError = !givenName ? 'Given name required.' : '';
  const familyNameError = !familyName ? 'Family name required.' : '';
  const fullNameError = !fullName ? 'Full name required.' : '';

  const canEdit = auth?.payload?.permissions?.canEditUsers;

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
        setEmail(res.data.email);
        setFullName(res.data.fullName);
        setFullNameShow(res.data.fullName);
        setGivenName(res.data.givenName);
        setFamilyName(res.data.familyName);
        setUser(res.data);
        setCreationDate(res.data.dateCreated);
        setRoleFound(res.data.role);
        setUserFound(true);
        console.log(res.data.role);

        if (_.includes(res.data.role, 'Quality Analyst')) {
          setCheckQualityAnalyst(true);
        }
        if (_.includes(res.data.role, 'Business Analyst')) {
          setCheckBusinessAnalyst(true);
        }
        if (_.includes(res.data.role, 'Product Manager')) {
          setCheckProductManager(true);
        }
        if (_.includes(res.data.role, 'Technical Manager')) {
          setCheckTechnicalManager(true);
        }
        if (_.includes(res.data.role, 'Developer')) {
          setCheckDeveloper(true);
        }

        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setUserFound(false);
        setPending(false);
      });
  }, [auth, showError, userId]);
  useEffect(() => {
    setPending(true);
    axios(`${process.env.REACT_APP_API_URL}/api/user/${me}`, {
      method: 'get',
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setEmail(res.data.email);
        setFullName(res.data.fullName);
        setFullNameShow(res.data.fullName);
        setGivenName(res.data.givenName);
        setFamilyName(res.data.familyName);
        setUser(res.data);
        setCreationDate(res.data.dateCreated);
        setRoleFound(res.data.role);
        setUserFound(true);
        console.log(res.data.role);

        if (_.includes(res.data.role, 'Quality Analyst')) {
          setCheckQualityAnalyst(true);
        }
        if (_.includes(res.data.role, 'Business Analyst')) {
          setCheckBusinessAnalyst(true);
        }
        if (_.includes(res.data.role, 'Product Manager')) {
          setCheckProductManager(true);
        }
        if (_.includes(res.data.role, 'Technical Manager')) {
          setCheckTechnicalManager(true);
        }
        if (_.includes(res.data.role, 'Developer')) {
          setCheckDeveloper(true);
        }

        setMePage(true);
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setUserFound(false);
        setPending(false);
      });
  }, [auth, showError, userId]);

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
    console.log(checkDeveloper);
  }

  function userUpdateSubmit(evt) {
    evt.preventDefault();

    setPending(true);
    const role = [];
    if (passwordError || givenNameError || familyNameError || fullNameError || passwordMatchError) {
      setError('Please Fix errors above.');
      showError('Please Fix errors above.');
      setPending(false);
      return;
    } else {
      if (checkDeveloper === true) {
        role.push('Developer');
      }
      if (checkTechnicalManager === true) {
        role.push('Technical Manager');
      }
      if (checkProductManager === true) {
        role.push('Product Manager');
      }
      if (checkBusinessAnalyst === true) {
        role.push('Business Analyst');
      }
      if (checkQualityAnalyst === true) {
        role.push('Quality Analyst');
      }

      console.log('yea', role);
    }

   if(!mePage) {axios(`${process.env.REACT_APP_API_URL}/api/user/${userId}`, {
      method: 'put',
      data: { fullName, password, familyName, givenName, role },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        showSuccess(res.data.message);

        window.location.reload(false);
      })
      .catch((err) => {
        console.error(err);
        showError(err.message);
        setPending(false);
      });}

    if (mePage) {
      axios(`${process.env.REACT_APP_API_URL}/api/user/${me}`, {
        method: 'put',
        data: { fullName, password, familyName, givenName, role },
        headers: {
          authorization: `Bearer ${auth?.token}`,
        },
      })
        .then((res) => {
          console.log(res.data);
          showSuccess(res.data.message);

          window.location.reload(false);
        })
        .catch((err) => {
          console.error(err);
          showError(err.message);
          setPending(false);
        });
    }
  }
  function toggleEdit(evt) {
    evt.preventDefault();
    setEditUser(!editUser);
  }


  return (
    <div>
      <h1>User </h1>

      {pending && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {!pending && auth && userFound && (
        <div>
          <div className="bugEditor-bugInfo border border-5 p-3 my-3 shadow text-center ">
            <h1 className="text-center">{fullNameShow}</h1>
            <span className="lead">{email}</span>
            <p className="text-muted text-center" style={{ overflowWrap: 'break-word' }}>
              {userId}
            </p>
            <p className="text-muted text-center" style={{ overflowWrap: 'break-word' }}>
              Creation Date: {dateCreated}
            </p>
            <hr></hr>
            Roles:
            {_.map(roleFound, (roles) => (
              <p className={roles ? 'badge bg-primary mx-1' : 'badge bg-danger'}>{roles}</p>
            ))}
            {(canEdit || mePage) && (
              <div className="d-grid gap-2 col-6 mx-auto">
                <button className="btn btn-secondary btn-lg mt-2" type="submit" onClick={(evt) => toggleEdit(evt)}>
                  Edit
                </button>
              </div>
            )}
          </div>

          {!pending && user && editUser && (
            <form className="form-control">
              <p className="display-6">Edit User</p>
              <InputField
                label="Given Name"
                id="userEditor-givenName"
                type="text"
                value={givenName}
                error={givenNameError}
                onChange={(evt) => onInputChange(evt, setGivenName)}
                disabled={!canEdit}
              />
              <InputField
                label="Family Name"
                id="userEditor-familyName"
                type="text"
                value={familyName}
                error={familyNameError}
                onChange={(evt) => onInputChange(evt, setFamilyName)}
                disabled={!canEdit}
              />

              <InputField
                label="Full Name"
                id="userEditor-fullName"
                type="text"
                value={fullName}
                error={fullNameError}
                onChange={(evt) => onInputChange(evt, setFullName)}
                disabled={!canEdit}
              />

              <InputField
                label="New Password"
                id="userEditor-newPassword"
                type="password"
                value={password}
                error={passwordError}
                onChange={(evt) => onInputChange(evt, setPassword)}
                disabled={!canEdit}
              />
              <InputField
                label="Confirm Password"
                id="userEditor-passwordConfirm"
                type="password"
                value={passwordMatch}
                error={passwordMatchError}
                onChange={(evt) => onInputChange(evt, setPasswordMatch)}
                disabled={!canEdit}
              />

              {!mePage && (
                <div>
                  <div className="display-6">Select Roles</div>
                  <div className="d-flex">
                    <div class="form-check pe-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkDeveloper"
                        value={true}
                        checked={checkDeveloper === true}
                        onChange={(evt) => setCheckDeveloper(!checkDeveloper)}
                      ></input>
                      <label className="form-check-label" htmlFor="checkDeveloper">
                        Developer
                      </label>
                    </div>

                    <div class="form-check pe-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkTechnicalManager"
                        value={true}
                        checked={checkTechnicalManager === true}
                        onChange={(evt) => setCheckTechnicalManager(!checkTechnicalManager)}
                      ></input>
                      <label className="form-check-label" htmlFor="checkTechnicalManager">
                        Technical Manager
                      </label>
                    </div>
                    <div class="form-check pe-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkProductManager"
                        value={true}
                        checked={checkProductManager === true}
                        onChange={(evt) => setCheckProductManager(!checkProductManager)}
                      ></input>
                      <label className="form-check-label" htmlFor="checkProductManager">
                        Product Manager
                      </label>
                    </div>
                    <div class="form-check pe-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkBusinessAnalyst"
                        value={true}
                        checked={checkBusinessAnalyst === true}
                        onChange={(evt) => setCheckBusinessAnalyst(!checkBusinessAnalyst)}
                      ></input>
                      <label className="form-check-label" htmlFor="checkBusinessAnalyst">
                        Business Analyst
                      </label>
                    </div>
                    <div class="form-check pe-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkQualityAnalyst"
                        value={true}
                        checked={checkQualityAnalyst === true}
                        onChange={(evt) => setCheckQualityAnalyst(!checkQualityAnalyst)}
                      ></input>
                      <label className="form-check-label" htmlFor="checkQualityAnalyst">
                        Quality Analyst
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="btn btn-primary mt-2 mb-5"
                type="submit"
                onClick={(evt) => userUpdateSubmit(evt)}
                disabled={!canEdit}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      )}

      {!userFound && !pending && <div className="text-danger">No Users Founds.</div>}
    </div>
  );
}
export default UserEditor;
