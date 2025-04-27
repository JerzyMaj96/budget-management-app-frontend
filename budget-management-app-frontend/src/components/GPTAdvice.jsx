import React, { useEffect, useState } from "react";

function GPTAdvice({ userId, month }) {
  const [gptAdvice, setGptAdvice] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!userId || month == null) {
      return;
    }

    fetch(
      `http://localhost:8080/budget-management/users/${userId}/monthly_costs/advice?month=${month}`,
      { method: "POST" }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to get an advice.");
        }
        return response.json();
      })
      .then((data) => {
        setGptAdvice(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId, month]);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!gptAdvice) {
    return <div>No advice available</div>;
  }

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: "8px",
      }}
    >
      <h3>Financial Advice:</h3>
      <p>{gptAdvice.advice}</p>
    </div>
  );
}

export default GPTAdvice;
