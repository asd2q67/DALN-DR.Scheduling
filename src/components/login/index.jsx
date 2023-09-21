import React from "react";
import "./style.css";
import logo from "../../assets/icons/logo.svg"

export const Login = () => {
  return (
    <div className="login">
      <div className="div">
        <img className="logo" alt="Logo" src={logo} />
        <div className="container">
          <div className="text">
            <div className="text-wrapper">Welcome</div>
            <p className="p">Log in to your account</p>
          </div>
          <div className="box">
            <div className="input">
              <div className="div-2">
                <div className="text-wrapper-2">User Name</div>
                <input className="input-bar" type="text" placeholder="Enter email">
                </input>
              </div>
              <div className="div-2">
                <div className="text-wrapper-2">Password</div>
                <input className="input-bar" type="text" placeholder="Enter password">
                </input>
              </div>
            </div>
            <div className="text-wrapper-4">Forget Password ?</div>
            <button className="button">
              <div className="text-wrapper-5">Log in</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
