import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://shares111.herokuapp.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      props.showAlert("login successfully", "success");
      //save the auth token and redirect back to
      localStorage.setItem("token", json.authtoken);
      localStorage.setItem("_id",json.user._id);
      navigate("/");
    } else {
      props.showAlert("invalid credentials", "danger");
    }
  };
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="my-2 text-center">
        <h2>Please login to use Our Services</h2>
      </div>
      <div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="container my-3 ">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              value={credentials.email}
              onChange={onChange}
              id="email"
              name="email"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="my-3">
            <label htmlFor="Password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={onChange}
              id="Password"
              name="password"
            />
          </div>

          <button type="submit" className="btn btn-success ">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
