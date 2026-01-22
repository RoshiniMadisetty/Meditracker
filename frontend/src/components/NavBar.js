import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // ✅ import logo

export default function NavBar(){
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const token = localStorage.getItem('token');

  return (
    <nav className="nav">
      <div className="nav-left">
        <img src={logo} alt="logo" className="logo" />   {/* ✅ logo added */}
        <Link to="/" className="brand-title">MediTracker</Link>
      </div>
      <div>
        <Link to="/about">About</Link>
        {token ? <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/medicines">Medicines</Link>
          <Link to="/reminders">Reminders</Link>
          <Link to="/history">History</Link>
          <button onClick={logout} className="link-btn">Logout</button>
        </> : <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>}
      </div>
    </nav>
  );
}
