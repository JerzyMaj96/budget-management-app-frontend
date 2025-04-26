import React, { useEffect, useState } from "react";
import CreateMonthlyCostsForm from "./MonthlyCostsPage-components/CreateMonthlyCostsForm";
import { useNavigate } from "react-router-dom";

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
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getMonthlyCostsForm(event) {
    event.preventDefault();
    setIsMonthlyCostsForm(true);
  }

  function handleGoBack(isFormVisible) {
    setIsMonthlyCostsForm(isFormVisible);
  }

  const navigate = useNavigate();

  function showAnalysis(event) {
    event.preventDefault();
    const date = new Date(selectedCosts.createDate);
    const month = date.getMonth() + 1;
    navigate("/analysis", { state: { selectedCosts, userId, month } });
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
            <li>
              Car Service:{" "}
              {selectedCosts.totalCarServiceCosts === null
                ? 0
                : selectedCosts.totalCarServiceCosts}{" "}
              zł
            </li>
            <li>
              Car Insurance:{" "}
              {selectedCosts.carInsuranceCosts === null
                ? 0
                : selectedCosts.carInsuranceCosts}{" "}
              zł
            </li>
            <li>
              Car Operation:{" "}
              {selectedCosts.carOperatingCosts === null
                ? 0
                : selectedCosts.carOperatingCosts}{" "}
              zł
            </li>
            <li>Created On : {formatDate(selectedCosts.createDate)}</li>
          </ul>
          <button className="monthly-costs-inner-button" onClick={showAnalysis}>
            Show analysis
          </button>
        </div>
      )}
    </div>
  );
}

export default MonthlyCostsPage;
