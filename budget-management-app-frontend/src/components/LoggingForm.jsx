import React, { useState } from "react";

function LoggingForm(props) {
  const [userId, setUserId] = useState("");

  function handleChange(event) {
    setUserId(event.target.value);
  }

  function handleLogin(event) {
    event.preventDefault();
    if (userId.trim() !== "") {
      props.onLogin(userId);
    }
  }

  function handleCreate() {
    props.onCreate();
  }

  return (
    <form onSubmit={handleLogin} className="form">
      <input
        onChange={handleChange}
        name="userId"
        placeholder="User ID"
        value={userId}
        className="form-input"
      />
      <button type="submit" className="form-button">
        Log in
      </button>
      <p onClick={handleCreate} className="form-link">
        I am not a user yet!
      </p>
    </form>
  );
}

export default LoggingForm;
