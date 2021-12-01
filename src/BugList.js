import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import BugListItem from './BugListItem';
function BugList({auth, showError}) {
  const [pending, setPending] = useState(true);
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setPending(true);
    setError('');

    axios(`${process.env.REACT_APP_API_URL}/api/bug/list`, {
      method: 'get',
      params: { pageSize:1000 },
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

  return (
    <div className="BugList">
        <h1>Bug List</h1>
      <form className="BugList-SearchForm">
        <div class="input-group mb-3">
          <input
            type="text"
            className="form-control"
            id="BugList-Keywords"
            name="keywords"
            aria-label="Keywords"
          ></input>
          <button type="submit" className="btn btn-outline-primary">Search</button>
        </div>
        <div className="input-group mb-3">
        
          <select className="form-select" id="BugList-SortBy" name="sortBy" aria-label="Sort By">
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="title">Sort by Title</option>
            <option value="classification">Sort by Classification</option>
            <option value="assignedTo">Sort by Assignee</option>
            <option value="createdBy">Sort by Author</option>
          </select>

          
        </div>
      </form>
      <div> <div>
      {pending && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {error && <div className="text-danger mb-2">{error}</div>}
      {!pending && !error && _.isEmpty(items) && (
        <div className="mb-2">No Bugs found.</div>
      )}
      {_.map(items, (item) => (
        <BugListItem key={item._id} item={item} />
      ))}
    </div></div>
    </div>
  );
}

export default BugList;
