import React, { useState } from "react";
import LoggingForm from "./LoggingForm";
import CreateAccountForm from "./CreateAccountForm";

function App() {
  const [userIsCreated, setUserIsCreated] = useState(true);

  function createUser() {
    setUserIsCreated(false);
  }

  return (
    <div className="container">
      <h1>Hello ! </h1>
      {userIsCreated ? (
        <LoggingForm onCreate={createUser} />
      ) : (
        <CreateAccountForm />
      )}
    </div>
  );
}

export default App;
