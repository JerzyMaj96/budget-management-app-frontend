import React, { useState } from "react";

function CreateAccountForm() {
  const [userName, setUserName] = useState("");

  function handleChange(event) {
    setUserName(event.target.value);
  }

  return (
    <form>
      <input
        onChange={handleChange}
        name="userName"
        placeholder="type in user name"
        value={userName}
      />
      <button>Create User</button>
    </form>
  );
}

export default CreateAccountForm;
