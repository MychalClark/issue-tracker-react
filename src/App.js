import { useState, userEffect, useEffect } from 'react';
import LoginForm from './LoginForm';
import Navbar from './Navbar';
import BugList from './BugList';
import RegisterForm from './RegisterForm';
import UserList from './UserList';
import BugEditor from './BugEditor';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt from 'jsonwebtoken';
import UserEditor from './UserEditor';

function App() {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage) {
      const storedAuthToken = localStorage.getItem('authToken');
      if (storedAuthToken) {
        const authPayload = jwt.decode(storedAuthToken);
        console.log(authPayload);
        if (authPayload) {
          const auth = {
            token: storedAuthToken,
            payload: authPayload,
            email: authPayload.email,
            userId: authPayload._id,
          };
          setAuth(auth);
        }
      }
    }
  }, []);

  function showError(message) {
    toast(message, { type: 'error', position: 'bottom-right' });
  }
  function showSuccess(message) {
    toast(message, { type: 'success', position: 'bottom-right' });
  }

  function onLogin(auth) {
    setAuth(auth);
    navigate('/bug/list');
    showSuccess('Logged in!');
    if (localStorage) {
      localStorage.setItem('authToken', auth.token);
    }
  }
  function onLogout() {
    setAuth(null);
    navigate('/login');
    showSuccess('Logged out!');
    if (localStorage) {
      localStorage.removeItem('authToken');
    }
  }

  return (
    <div className="App">
      <ToastContainer />
      <Navbar auth={auth} onLogout={onLogout} />

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm onLogin={onLogin} showError={showError} />} />
          <Route path="/register" element={<RegisterForm onLogin={onLogin} showError={showError} />} />
          <Route path="/bug/list" element={<BugList showError={showError} auth={auth} />} />
          <Route
            path="/bug/:bugId"
            element={<BugEditor auth={auth} showError={showError} showSuccess={showSuccess} />}
          />
          <Route path="/user/list" element={<UserList showError={showError} auth={auth}/>} />
          <Route
            path="/user/:userId"
            element={<UserEditor auth={auth} showError={showError} showSuccess={showSuccess} />}
          />
          {/* <Route path="/user/:userId" element={<UserEditor />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>

      <footer class="footer mt-auto py-1 bg-dark fixed-bottom">
        <div class="container">
          <div class="text-muted text-center">Mychal Clark</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
