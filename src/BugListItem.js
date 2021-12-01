import { Link } from 'react-router-dom';
import moment from 'moment';
import { useState } from 'react';
import axios from 'axios';


function BugListItem({ item,fullName }) {

  return (
    <div className="card border-dark mb-3">
      <div className="card-body">
        <h2 className="card-title ">
          <Link to={`/bug/${item._id}`}>{item.title}</Link>
        </h2>
        <div className="card-text row align-items-start">
          <div className="col">
            <span className="badge bg-primary me-2">Assignee: {item.assignedToUserName}</span>
          </div>
          <div className="col">
            <span
              className={
                item.classification === 'approved'
                  ? 'badge bg-success me-2'
                  : item.classification === 'unapproved' || item.classification === 'duplicate'
                  ? 'badge bg-danger me-2'
                  : item.classification === 'unclassified'
                  ? 'badge bg-warning me-2'
                  : 'invisible'
              }
            >
              Classification: {item.classification}
            </span>
          </div>
          <div className="col">
            <span
              className={
                item.closed === false ? 'badge bg-success me-2' : item.closed === true ? 'badge bg-danger me-2' : ''
              }
            >
              {item.closed === true ? 'Closed' : item.closed === false ? 'Open' : 'Open'}
            </span>
          </div>
        </div>
        <div className="card-footer">
          <div>Created By: {fullName}</div>
          <div>Created On: {moment(item.createdOn).format()} </div>
        </div>
      </div>
    </div>
  );
}

export default BugListItem;
