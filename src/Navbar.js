import { useState } from 'react';
import { NavLink } from 'react-router-dom';
function Navbar({ auth, onLogout }) {
  const [open, setOpen] = useState(false);

  function onNavToggle(evt) {
    setOpen(!open);
  }

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-light bg-info d-flex justify-content-between">
        <span className="mx-2">BIS {auth && <span className="navbar-text">{auth.email}</span>}</span>
        <button type="button" className="navbar-toggler mx-2" onClick={(evt) => onNavToggle(evt)}>
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
      <div className={open ? 'd-block w-50 bg-secondary shadow min-vh-100 position-absolute' : 'd-none w-0'}>
        <h2 className="display-1">Bugs</h2>
        <ul>
          <li>
            <NavLink
              className="nav-link"
              to="/bug/list"
              onClick={(evt) => {
                onNavToggle(evt);
              }}
            >
              Bug List
            </NavLink>
          </li>
        </ul>

        <h2 className="display-1">Users</h2>
        <ul>
          <li>
            <NavLink
              className="nav-link"
              to="/user/list"
              onClick={(evt) => {
                onNavToggle(evt);
              }}
            >
              User List
            </NavLink>
          </li>
        </ul>

        {auth && (
          <div className="mt-5 pt-5 text-center">
            <NavLink
              to="/login"
              onClick={(evt) => {
                onLogout(evt);
                onNavToggle(evt);
              }}
            >
              Logout
            </NavLink>
          </div>
        )}
        {!auth && (
          <div>
          <div className="mt-5 pt-5 text-center">
            <NavLink
              to="/login"
              onClick={(evt) => {
                onLogout(evt);
                onNavToggle(evt);
              }}
            >
              Login
            </NavLink>
          </div>
       
          <div className="mt-1 pt-1 text-center">
            <NavLink
              to="/register"
              onClick={(evt) => {
                onLogout(evt);
                onNavToggle(evt);
              }}
            >
              Register
            </NavLink>
          </div>
       </div>
       
       )}
      </div>
    </header>
  );
}

export default Navbar;
