import React, { useState } from "react";
import LoggingForm from "./LoggingForm";
import CreateAccountForm from "./CreateAccountForm";
import Header from "./Header";
import MonthlyCostsPage from "./MonthlyCostsPage";

function App() {
  const [userIsCreated, setUserIsCreated] = useState(true);
  const [userId, setUserId] = useState(null);

  function createUser() {
    setUserIsCreated(false);
  }

  async function handleLogin(userIdFromLogin) {
    setUserId(userIdFromLogin);
  }

  return (
    <div>
      <Header />
      <div className="container">
        {userId ? (
          <MonthlyCostsPage userId={userId} />
        ) : userIsCreated ? (
          <div>
            <h1>Hello ! </h1>
            <LoggingForm onLogin={handleLogin} onCreate={createUser} />
          </div>
        ) : (
          <CreateAccountForm onBackToLogin={() => setUserIsCreated(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
