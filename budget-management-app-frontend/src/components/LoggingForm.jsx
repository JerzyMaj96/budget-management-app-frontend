import React, { useState } from "react";

function LoggingForm(props) {
  const [userId, setUserId] = useState("");

  function handleChange(event) {
    setUserId(event.target.value);
  }

  function handleCreate() {
    props.onCreate();
  }

  return (
    <form>
      <input
        onChange={handleChange}
        name="userId"
        placeholder="User ID"
        value={userId}
      />
      <button type="submit" style={{ cursor: "pointer" }}>
        Log in
      </button>
      <p onClick={handleCreate} style={{ cursor: "pointer", color: "white" }}>
        I am not a user yet !
      </p>
    </form>
  );
}

export default LoggingForm;
