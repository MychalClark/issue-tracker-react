import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GiExitDoor } from 'react-icons/gi';
import { FaRegistered ,FaRegListAlt, FaUser } from 'react-icons/fa';
import { GrLogin } from 'react-icons/gr';
import { BsFillBugFill } from 'react-icons/bs';
import { GoReport } from 'react-icons/go';
function Navbar({ auth, onLogout }) {
  const [open, setOpen] = useState(false);

  function onNavToggle(evt) {
    setOpen(!open);
  }

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-dark bg-info d-flex justify-content-between">
        <span className="mx-2">BIS {auth && <span className="navbar-text">{auth.email}</span>}</span>
        <button type="button" className=" navbar-toggler mx-2" onClick={(evt) => onNavToggle(evt)}>
          <span className={open ? 'btn-close' : 'navbar-toggler-icon'}></span>
        </button>
      </nav>
      <nav
        className={open ? ' bg-success open-nav d-block w-50 shadow min-vh-100 position-absolute end-0' : 'd-none w-0'}
      >
        <div className="shadow mx-2 border border-5 mt-4 px-2">
          <div className="nav-header"><BsFillBugFill className="me-1"/>Bugs</div>

          <ul className="list-unstyled">
            <li className="nav-item">
              <NavLink className="nav-link" to="/bug/list" onClick={(evt) => onNavToggle(evt)}>
                <FaRegListAlt className="me-1"/> Bug List
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/bug/report" onClick={(evt) => onNavToggle(evt)}>
                <GoReport className="me-1"/>Bug Report
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="shadow mx-2 border border-5 mt-4 px-2">
          <div className="nav-header"><FaUser className="me-1"/>Users</div>
          <ul className="list-unstyled">
            <li className="nav-item" >
              <NavLink
                className="nav-link"
                to="/user/list"
                onClick={(evt) => {
                  onNavToggle(evt);
                }}
              >
               <FaRegListAlt className="me-1"/> User List
              </NavLink>
            </li>

            <li className="nav-item" >
              <NavLink
                className="nav-link"
                to="/user/me"
                onClick={(evt) => {
                  onNavToggle(evt);
                }}
              >
               <FaUser className="me-1"/> My Profile
              </NavLink>
            </li>
          </ul>
        </div>

        {auth && (
          <div className="mt-1 pt-2 text-center">
            <NavLink
              className="nav-link"
              to="/login"
              onClick={(evt) => {
                onLogout(evt);
                onNavToggle(evt);
              }}
            >
              <GiExitDoor className="me-1" />
              Logout
            </NavLink>
          </div>
        )}
        {!auth && (
          <div>
            <div className="mt-1 pt-1 text-center">
              <NavLink
                className="nav-link"
                to="/login"
                onClick={(evt) => {
                  onLogout(evt);
                  onNavToggle(evt);
                }}
              >
                <GrLogin className="me-1" /> Login
              </NavLink>
            </div>

            <div className="mt-1 pt-1 text-center">
              <NavLink
                className="nav-link"
                to="/register"
                onClick={(evt) => {
                  onLogout(evt);
                  onNavToggle(evt);
                }}
              >
                <FaRegistered className="me-1" /> Register
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
