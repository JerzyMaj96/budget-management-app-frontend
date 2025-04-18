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
    <form onSubmit={handleLogin}>
      <input
        onChange={handleChange}
        name="userId"
        placeholder="User ID"
        value={userId}
      />
      <button type="submit">Log in</button>
      <p onClick={handleCreate} style={{ cursor: "pointer" }}>
        I am not a user yet !
      </p>
    </form>
  );
}

export default LoggingForm;
