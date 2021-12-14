import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import UserListItem from './UserListItem';
function UserList({ auth, showError }) {
  const [pending, setPending] = useState(true);
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [keywords, setKeywords] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [role, setRole] = useState('');
  const [filter, setFilter] = useState(false);

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  useEffect(() => {
    setPending(true);
    setError('');
    setFilter(false);

    axios(`${process.env.REACT_APP_API_URL}/api/user/list`, {
      method: 'get',
      params: { pageSize: 1000 },
      headers: {
        authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setPending(false);
        if (_.isArray(res.data)) {
          setItems(res.data);
        } else {
          setError('Expected an array.');
          showError('Expected an array.');
        }
      })
      .catch((err) => {
        console.error(err);
        setPending(false);
        setError(err.message);
        showError(err.message);
      });
  }, [auth, showError]);

  function searchUsers(evt) {
    evt.preventDefault();
    setPending(true);
    setError('');
    setFilter(false);
    const auth = localStorage.getItem('authToken');
    const paramAdd = {};

    if (parseInt(minAge)) {
      paramAdd.minAge = parseInt(minAge);
    }
    if (parseInt(maxAge)) {
      paramAdd.maxAge = parseInt(maxAge);
    }
    if (role) {
      paramAdd.role = role;
    }


    console.log(paramAdd);
    axios(`${process.env.REACT_APP_API_URL}/api/user/list`, {
      method: 'get',
      params: {
        pageSize: 1000,
        sortBy: sortBy,
        keywords: keywords,
        ...paramAdd,
      },
      headers: {
        authorization: `Bearer ${auth}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setPending(false);
        if (_.isArray(res.data)) {
          setItems(res.data);
        } else {
          setError('Expected an array.');
          showError('Expected an array.');
        }
      })
      .catch((err) => {
        console.error(err);
        setPending(false);
        setError(err.message);
        showError(err.message);
      });
  }

  function filterToggle(evt) {
    evt.preventDefault();

    setFilter(!filter);
  }

  return (
    <div className="UserList">
      <h1>User List</h1>
      <form className="BugList-SearchForm">
        <div class="input-group mb-3">
          <input
            type="text"
            className="form-control"
            id="UserList-Keywords"
            name="keywords"
            aria-label="Keywords"
            value={keywords}
            onChange={(evt) => onInputChange(evt, setKeywords)}
          ></input>
          <button type="submit" className="btn btn-primary" onClick={(evt) => searchUsers(evt)}>
            Search
          </button>
        </div>
        <div className="input-group mb-3">
          <select
            className="form-select"
            id="BugList-SortBy"
            name="sortBy"
            aria-label="Sort By"
            value={sortBy}
            onChange={(evt) => onInputChange(evt, setSortBy)}
          >
            <option value="givenName">Sort by Given Name</option>
            <option value="familyName">Sort by family Name</option>
            <option value="role">Sort by Role</option>
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>

          <button type="submit" className="btn btn-primary" onClick={(evt) => filterToggle(evt)}>
            Filters
          </button>
        </div>

        <div className={filter ? 'filter-color shadow border border-4 d-block dropdown-menu p-3' : 'd-none'}>
          <div className=" row align-items-start">
            <p className="display-6 text-center">Filters</p>
            <div className="col border">
              <p className="lead">Role</p>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="UserRoleRadio"
                  id="RadioAny"
                  value={''}
                  checked={role === ''}
                  onChange={(evt) => onInputChange(evt, setRole)}
                ></input>
                <label className="form-check-label" htmlFor="RadioAny">
                  Any
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="UserRoleRadio"
                  id="RadioQualityAnalyst"
                  value={'Quality Analyst'}
                  checked={role === 'Quality Analyst'}
                  onChange={(evt) => onInputChange(evt, setRole)}
                ></input>
                <label className="form-check-label" htmlFor="RadioQualityAnalyst">
                  Quality Analyst
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="UserRoleRadio"
                  id="RadioDeveloper"
                  value={'Developer'}
                  checked={role === 'Developer'}
                  onChange={(evt) => onInputChange(evt, setRole)}
                ></input>
                <label className="form-check-label" htmlFor="RadioDeveloper">
                  Developer
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="UserRoleRadio"
                  id="RadioTechnicalManager"
                  value={'Technical Manager'}
                  checked={role === 'Technical Manager'}
                  onChange={(evt) => onInputChange(evt, setRole)}
                ></input>
                <label className="form-check-label" htmlFor="RadioTechnicalManager">
                  Technical Manager
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="UserRoleRadio"
                  id="RadioBusinessAnalyst"
                  value={'Business Analyst'}
                  checked={role === 'Business Analyst'}
                  onChange={(evt) => onInputChange(evt, setRole)}
                ></input>
                <label className="form-check-label" htmlFor="RadioBusinessAnalyst">
                Business Analyst
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="UserRoleRadio"
                  id="RadioProductManager"
                  value={'Product Manager'}
                  checked={role === 'Product Manager'}
                  onChange={(evt) => onInputChange(evt, setRole)}
                ></input>
                <label className="form-check-label" htmlFor="RadioProductManager">
                Product Manager
                </label>
              </div>
            </div>

            <div className="col border">
              <p className="lead">User Age(days)</p>
              <label htmlFor="BugList-minAge">Min Age</label>
              <input
                type="text"
                className="form-control"
                id="UserList-minAge"
                name="minAge"
                aria-label="min Age"
                value={minAge}
                onChange={(evt) => onInputChange(evt, setMinAge)}
              ></input>

              <label htmlFor="BugList-maxAge">Max Age</label>
              <input
                type="text"
                className="form-control"
                id="UserList-maxAge"
                name="maxAge"
                aria-label="max age"
                value={maxAge}
                onChange={(evt) => onInputChange(evt, setMaxAge)}
              ></input>
            </div>
            <button type="submit" className="btn btn-primary mt-2" onClick={(evt) => searchUsers(evt)}>
              Search
            </button>
          </div>
        </div>
      </form>
      <div>
        <div>
          {pending && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {!auth && <div className="text-danger mb-2">You need to be logged in to Access Bug List.</div>}
          {error && <div className="text-danger mb-2">{error}</div>}
          {!pending && !error && auth && _.isEmpty(items) && <div className="mb-2">No Users found.</div>}
          {_.map(items, (item) => (
            <UserListItem key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserList;
