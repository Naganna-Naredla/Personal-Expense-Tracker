import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ token, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {token ? (
        <>
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/reports" className="nav-link">Reports</Link>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;