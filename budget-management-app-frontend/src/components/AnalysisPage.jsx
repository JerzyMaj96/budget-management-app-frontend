import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function AnalysisPage() {
  const location = useLocation();
  const selectedCosts = location.state?.selectedCosts;
  const userId = selectedCosts?.userId;
  const month = new Date(selectedCosts?.createDate).getMonth() + 1;

  const [costsSummary, setCostsSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !month) return;

    const calculationEndpoints = [
      "sum",
      "rent-percentage",
      "food_costs-percentage",
      "current_electricity_bill-percentage",
      "current_gas_bill-percentage",
      "total_car_service-percentage",
      "car_insurance_costs-percentage",
      "car_operating_costs-percentage",
      "costs-percentage",
      "net_salary_after_costs",
    ];
    const runCalculations = async () => {
      try {
        await Promise.all(
          calculationEndpoints.map(async (endpoint) => {
            const res = await fetch(
              `http://localhost:8080/budget-management/users/${userId}/monthly_costs/${endpoint}?month=${month}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (!res.ok) {
              throw new Error(`Calculation failed at endpoint: ${endpoint}`);
            }
          })
        );

        const response = await fetch(
          `http://localhost:8080/budget-management/users/${userId}/monthly_costs/monthly_costs_summary?month=${month}`
        );
        console.log("Summary fetch status:", response.status);
        console.log("Summary data:", summaryData);
        if (!response.ok) {
          throw new Error(
            "Failed to accomplish or retrieve monthly costs calculations"
          );
        }
        const summaryData = await response.json();
        const mappedSummary = {
          rentPercentage: summaryData.rentPercentageOfUserSalary,
          foodCostsPercentage: summaryData.foodCostsPercentageOfUserSalary,
          electricityPercentage:
            summaryData.currentElectricityBillPercentageOfUserSalary,
          gasPercentage: summaryData.currentGasBillPercentageOfUserSalary,
          carServicePercentage:
            summaryData.totalCarServicePercentageOfUserSalary,
          carInsurancePercentage:
            summaryData.carInsuranceCostsPercentageOfUserSalary,
          carOperatingPercentage:
            summaryData.carOperatingCostsPercentageOfUserSalary,
          totalCostsPercentage: summaryData.costsPercentageOfUserSalary,
          netSalaryAfterCosts: summaryData.netSalaryAfterCosts,
          monthlyCostsSum: summaryData.monthlyCostsSum,
          financialAdvice: summaryData.financialAdvice,
        };
        setCostsSummary(mappedSummary);
      } catch (error) {
        setError(error.message);
      }
    };
    runCalculations();
    console.log("SelectedCosts:", selectedCosts);
    console.log("User ID:", userId);
    console.log("Month:", month);
  }, [userId, month]);

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!costsSummary) {
    return <div className="loader"></div>;
  }

  return (
    <div>
      <h2>Analysis for Monthly Costs ID: {selectedCosts.id}</h2>
      {!costsSummary ? (
        <p>Calculating summary...</p>
      ) : (
        <div>
          <p>
            <strong>Total Monthly Costs:</strong> {costsSummary.monthlyCostsSum}{" "}
            zł
          </p>
          <p>
            <strong>Rent % of Salary:</strong> {costsSummary.rentPercentage} %
          </p>
          <p>
            <strong>Food % of Salary:</strong>{" "}
            {costsSummary.foodCostsPercentage} %
          </p>
          <p>
            <strong>Electricity % of Salary:</strong>{" "}
            {costsSummary.electricityPercentage} %
          </p>
          <p>
            <strong>Gas % of Salary:</strong> {costsSummary.gasPercentage} %
          </p>
          <p>
            <strong>Car Service %:</strong> {costsSummary.carServicePercentage}{" "}
            %
          </p>
          <p>
            <strong>Car Insurance %:</strong>{" "}
            {costsSummary.carInsurancePercentage} %
          </p>
          <p>
            <strong>Car Operating %:</strong>{" "}
            {costsSummary.carOperatingPercentage} %
          </p>
          <p>
            <strong>Total Costs % of Salary:</strong>{" "}
            {costsSummary.totalCostsPercentage} %
          </p>
          <p>
            <strong>Net Salary After Costs:</strong>{" "}
            {costsSummary.netSalaryAfterCosts} zł
          </p>
        </div>
      )}
    </div>
  );
}

export default AnalysisPage;
