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
  const [closed, setClosed] = useState('');
  const [classification, setClassification] = useState();
  const [filter, setFilter] = useState(false);

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  useEffect(() => {
    setPending(true);
    setError('');
    setFilter(false)

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
    setFilter(false)
    const auth = localStorage.getItem('authToken');
    const paramAdd = {};

    if (parseInt(minAge)) {
      paramAdd.minAge = parseInt(minAge);
    }
    if (parseInt(maxAge)) {
      paramAdd.maxAge = parseInt(maxAge);
    }
    if (classification) {
      paramAdd.classification = classification;
    }

    if (closed) {
      paramAdd.closed = closed;
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
          <button type="submit" className="btn btn-outline-primary" onClick={(evt) => searchUsers(evt)}>
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
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="title">Sort by Title</option>
            <option value="classification">Sort by Classification</option>
            <option value="assignedTo">Sort by Assignee</option>
            <option value="createdBy">Sort by Author</option>
          </select>

          <button type="submit" className="btn btn-outline-primary" onClick={(evt) => filterToggle(evt)}>
            Filters
          </button>
        </div>

        <div
          className={filter ? 'shadow border border-2 bg-white p- d-flex align-items-center dropdown-menu' : 'd-none'}
        >
          <div className=" row align-items-start">
            <p className="display-6 text-center">Filters</p>
            <div className="col border">
              <p className="lead">Role</p>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="bugStatusRadio"
                  id="bugStatusAny"
                  value=""
                  onChange={(evt) => onInputChange(evt, setClosed)}
                ></input>
                <label className="form-check-label" htmlFor="bugStatusAny">
                  Any
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="bugStatusRadio"
                  id="bugStatusOpen"
                  value={false}
                  onChange={(evt) => onInputChange(evt, setClosed)}
                ></input>
                <label className="form-check-label" htmlFor="bugStatusOpen">
                  Open
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="bugStatusRadio"
                  id="bugStatusClosed"
                  value={true}
                  onChange={(evt) => onInputChange(evt, setClosed)}
                ></input>
                <label className="form-check-label" htmlFor="bugStatusClosed">
                  Closed
                </label>
              </div>
            </div>

            <div className="col border">
              <p className="lead">classification</p>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="classificationRadio"
                  id="bugClassificationAny"
                  value=""
                  onChange={(evt) => onInputChange(evt, setClassification)}
                ></input>
                <label className="form-check-label" htmlFor="bugClassificationAny">
                  Any
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="classificationRadio"
                  id="bugClassificationApproved"
                  value="approved"
                  onChange={(evt) => onInputChange(evt, setClassification)}
                ></input>
                <label className="form-check-label" htmlFor="bugClassificationApproved">
                  Approved
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="classificationRadio"
                  id="flexRadioDefault2"
                  value="bugClassificationUnapproved"
                  onChange={(evt) => onInputChange(evt, setClassification)}
                ></input>
                <label className="form-check-label" htmlFor="bugClassificationUnapproved">
                  Unapproved
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="classificationRadio"
                  id="bugClassificationDuplicate"
                  value="duplicate"
                  onChange={(evt) => onInputChange(evt, setClassification)}
                ></input>
                <label className="form-check-label" htmlFor="bugClassificationDuplicate">
                  Duplicate
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="classificationRadio"
                  id="bugClassificationUnclassified"
                  value="unclassified"
                  onChange={(evt) => onInputChange(evt, setClassification)}
                ></input>
                <label className="form-check-label" htmlFor="bugClassificationUnclassified">
                  Unclassified
                </label>
              </div>
            </div>

            <div className="col border">
              <p className="lead">Bug Age(days)</p>
              <label htmlFor="BugList-minAge">Min Age</label>
              <input
                type="text"
                className="form-control"
                id="BugList-minAge"
                name="minAge"
                aria-label="min Age"
                value={minAge}
                onChange={(evt) => onInputChange(evt, setMinAge)}
              ></input>

              <label htmlFor="BugList-maxAge">Max Age</label>
              <input
                type="text"
                className="form-control"
                id="BugList-maxAge"
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
          {error && <div className="text-danger mb-2">{error}</div>}
          {!pending && !error && _.isEmpty(items) && <div className="mb-2">No Users found.</div>}
          {_.map(items, (item) => (
            <UserListItem key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserList;
