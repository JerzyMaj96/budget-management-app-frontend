import React, { useEffect, useState } from "react";
import CreateMonthlyCostsForm from "./MonthlyCostsPage-components/CreateMonthlyCostsForm";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { monthlyCostFields } from "./MonthlyCostsPage-components/fieldMappings";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";

function MonthlyCostsPage({ userId }) {
  const [monthlyCostsList, setMonthlyCostsList] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMonthlyCostsForm, setIsMonthlyCostsForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `http://localhost:8080/budget-management/users/${userId}/monthly_costs/byUserId`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch Monthly Costs!");
        return response.json();
      })
      .then((data) => {
        setMonthlyCostsList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const formatDate = (dateString) => format(new Date(dateString), "yyyy-MM-dd");

  const createNewMonthlyCosts = (event) => {
    event.preventDefault();
    setIsMonthlyCostsForm(true);
  };

  const updateSingleCostField = (field, newValue) => {
    const updatedCosts = { ...selectedCosts, [field]: parseFloat(newValue) };

    fetch(
      `http://localhost:8080/budget-management/users/${userId}/monthly_costs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCosts),
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update monthly cost.");
        return response.json();
      })
      .then((data) => {
        const updatedList = monthlyCostsList.map((cost) =>
          cost.id === data.id ? data : cost
        );
        setMonthlyCostsList(updatedList);
        setSelectedCosts(data);
        alert("Cost updated!");
      })
      .catch(() => alert("Failed to update cost!"));
  };

  const showAnalysis = (event) => {
    event.preventDefault();
    const date = new Date(selectedCosts.createDate);
    const month = date.getMonth() + 1;
    navigate("/analysis", { state: { selectedCosts, userId, month } });
  };

  return (
    <div>
      {loading && <div className="loader" />}

      {!isMonthlyCostsForm && error && (
        <div className="error-message">
          <h2>{error}</h2>
          <button onClick={() => setIsMonthlyCostsForm(true)}>
            Create Monthly Costs
          </button>
        </div>
      )}

      {isMonthlyCostsForm && (
        <CreateMonthlyCostsForm
          userId={userId}
          onBackToMonthlyCostsPage={setIsMonthlyCostsForm}
        />
      )}

      {!isMonthlyCostsForm && !loading && monthlyCostsList.length > 0 && (
        <div className="table-container">
          <div className="table-header">
            <h2>Monthly Costs</h2>
            {(() => {
              const last = monthlyCostsList.at(-1);
              const now = new Date();
              const isSameMonth =
                new Date(last.createDate).getMonth() === now.getMonth() &&
                new Date(last.createDate).getFullYear() === now.getFullYear();
              return !isSameMonth ? (
                <AddBoxIcon
                  className="add-box-icon"
                  onClick={createNewMonthlyCosts}
                />
              ) : null;
            })()}
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {monthlyCostsList.map((cost) => (
                <tr
                  key={cost.id}
                  className="cost-row"
                  onClick={() =>
                    setSelectedCosts(
                      selectedCosts && selectedCosts.id === cost.id
                        ? null
                        : cost
                    )
                  }
                >
                  <td>{cost.id}</td>
                  <td>{formatDate(cost.createDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isMonthlyCostsForm && selectedCosts && (
        <div className="details-box">
          <h3>Details for Monthly Costs with ID: {selectedCosts.id}</h3>
          <div className="cost-fields">
            {monthlyCostFields.map(({ key, label, defaultValue }, i) => {
              const value = selectedCosts[key] ?? defaultValue ?? 0;
              return (
                <div key={i} className="cost-field">
                  <span>
                    {label}: {value} zł
                  </span>
                  <AddIcon
                    titleAccess={`Add something to "${label}"`}
                    className="add-icon"
                    onClick={() => {
                      const newValue = prompt(
                        `Enter new value for ${label}:`,
                        value
                      );
                      if (newValue !== null && !isNaN(newValue)) {
                        updateSingleCostField(key, newValue);
                      }
                    }}
                  />
                </div>
              );
            })}
            <div className="cost-field">
              <span>Created On: {formatDate(selectedCosts.createDate)}</span>
            </div>
          </div>
          <button className="monthly-costs-inner-button" onClick={showAnalysis}>
            Show analysis
          </button>
        </div>
      )}
    </div>
  );
}

export default MonthlyCostsPage;
