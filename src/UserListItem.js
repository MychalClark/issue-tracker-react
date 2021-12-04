import { Link } from 'react-router-dom';
import moment from 'moment';
import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

function UserListItem({ item }) {
  return (
    <div className="card border-dark mb-3">
      <div className="card-body">
        <h2 className="card-title ">
          <Link to={`/user/${item._id}`}>{item.fullName}</Link>
        </h2>
        <span className="lead">{item.email}</span>
        <div className="card-text row align-items-start">
          <div className="col pt-2">
            <span className="me-2 pt-2"><span className="text-muted pt-3">Roles</span><div> {_.map(item.role, (role) => (

            <p className={item.role ? "badge bg-primary mx-1" :"badge bg-danger"}>{role}</p>
          ))}</div></span>
          </div>
          <div className="col"></div>
          <div className="col"></div>
        </div>
        <div className="card-footer">
          <div>Account Created On: {moment(item.dateCreated).format()} </div>
        </div>
      </div>
    </div>
  );
}

export default UserListItem;
