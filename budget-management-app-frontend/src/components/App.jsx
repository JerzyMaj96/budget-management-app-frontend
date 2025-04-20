import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoggingForm from "./LoggingForm";
import CreateAccountForm from "./CreateAccountForm";
import Header from "./Header";
import MonthlyCostsPage from "./MonthlyCostsPage";
import AnalysisPage from "./AnalysisPage";

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
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              userId ? (
                <MonthlyCostsPage userId={userId} />
              ) : userIsCreated ? (
                <div>
                  <h1>Hello ! </h1>
                  <LoggingForm onLogin={handleLogin} onCreate={createUser} />
                </div>
              ) : (
                <CreateAccountForm
                  onBackToLogin={() => setUserIsCreated(true)}
                />
              )
            }
          />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
