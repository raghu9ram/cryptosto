
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup(props) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://shares111.herokuapp.com/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        cpassword: credentials.cpassword,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      props.showAlert("account created successfully", "success");
      //save the auth token and redirect back to
      localStorage.setItem("token", json.authtoken);
      navigate("/");
    } else {
      props.showAlert("email already exist", "danger");
    }
  };
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
   
  });
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div>
      <div className="mt-2 text-center">
        <h2 className="my-4">Please signup to use our Services</h2></div>
        <form  className="form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              value={credentials.name}
              onChange={onChange}
              id="name"
              name="name"
            />
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
          <div className="mb-3">
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
              minLength={5}
              required
            />
          </div>
          

          <button type="submit" className="btn btn-success ">
            Sign up
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
