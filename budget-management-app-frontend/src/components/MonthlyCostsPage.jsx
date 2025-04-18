import React, { useEffect, useState } from "react";
import CreateMonthlyCostsForm from "./MonthlyCostsPage-components/CreateMonthlyCostsForm";

function MonthlyCostsPage({ userId }) {
  const [monthlyCostsList, setMonthlyCostsList] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMonthlyCostsForm, setIsMonthlyCostsForm] = useState(false);

  useEffect(() => {
    fetch(
      `http://localhost:8080/budget-management/users/${userId}/monthly_costs/byUserId`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch Monthly Costs! You haven't set any monthly costs yet !"
          );
        }
        return response.json();
      })
      .then((data) => {
        setMonthlyCostsList(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);

        setLoading(false);
      });
  }, [userId]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function getMonthlyCostsForm(event) {
    event.preventDefault();
    setIsMonthlyCostsForm(true);
  }

  function handleGoBack(isFormVisible) {
    setIsMonthlyCostsForm(isFormVisible);
  }

  return (
    <div>
      {loading && <div className="loader"></div>}
      {!isMonthlyCostsForm && error && (
        <div>
          <h2 style={{ color: "white", fontWeight: "bold", padding: "20px" }}>
            {error}
          </h2>
          <button onClick={getMonthlyCostsForm} style={{ marginTop: "20 px" }}>
            Create Monthly Costs
          </button>
        </div>
      )}

      {isMonthlyCostsForm && (
        <CreateMonthlyCostsForm
          userId={userId}
          onBackToMonthlyCostsPage={handleGoBack}
        />
      )}

      {loading && monthlyCostsList.length === 0 && (
        <p style={{ color: "white" }}>
          You haven't set any monthly costs yet !
        </p>
      )}

      {!loading && monthlyCostsList.length > 0 && (
        <div>
          <h2>Monthly Costs</h2>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Monthly Costs ID</th>
                <th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {monthlyCostsList.map((cost) => (
                <tr
                  key={cost.id}
                  onClick={() => setSelectedCosts(cost)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{cost.id}</td>
                  <td>{formatDate(cost.createDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCosts && (
        <div className="details-box">
          <h3>Details for Monthly Costs with ID: {selectedCosts.id}</h3>
          <ul>
            <li>Rent: {selectedCosts.rent} zł</li>
            <li>Food Costs: {selectedCosts.foodCosts} zł</li>
            <li>Electricity: {selectedCosts.currentElectricityBill} zł</li>
            <li>Gas: {selectedCosts.currentGasBill} zł</li>
            <li>Car Service: {selectedCosts.totalCarServiceCosts} zł</li>
            <li>Car Insurance: {selectedCosts.carInsuranceCosts} zł</li>
            <li>Car Operation: {selectedCosts.carOperatingCosts} zł</li>
            <li>Created At: {formatDate(selectedCosts.createDate)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MonthlyCostsPage;
