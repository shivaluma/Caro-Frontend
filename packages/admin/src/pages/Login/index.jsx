import React from 'react';
import './login.css';
export default function Login() {
  return (
    <div className="wrapper">
      <div className="container">
        <h1>Welcome</h1>

        <form className="form">
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit" id="login-button" onClick={() => {}}>
            Login
          </button>
        </form>
      </div>

      <ul className="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}
