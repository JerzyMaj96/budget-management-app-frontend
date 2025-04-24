import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const AnalysisPage = () => {
  const location = useLocation();
  const selectedCosts = location.state?.selectedCosts;
  const userId = location.state?.userId;
  const month = location.state?.month;

  const [costsSummary, setCostsSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = `http://localhost:8080/budget-management/users/${userId}/monthly_costs`;

  useEffect(() => {
    console.log("Location state in AnalysisPage:", location.state);
    console.log("userId in AnalysisPage:", userId);
    console.log("month in AnalysisPage:", month);

    if (!userId || month == null) {
      console.warn("Missing userId or month. Exiting useEffect.");
      return;
    }

    const runCalculations = async () => {
      try {
        console.log("Step 1: Sum up all monthly costs");
        await axios.post(`${baseUrl}/sum`, null, { params: { month } });

        console.log("Step 2: Calculate individual percentages");
        await Promise.all([
          axios.post(`${baseUrl}/rent-percentage`, null, { params: { month } }),
          axios.post(`${baseUrl}/food_costs-percentage`, null, {
            params: { month },
          }),
          axios.post(`${baseUrl}/current_electricity_bill-percentage`, null, {
            params: { month },
          }),
          axios.post(`${baseUrl}/current_gas_bill-percentage`, null, {
            params: { month },
          }),
          axios.post(`${baseUrl}/total_car_service-percentage`, null, {
            params: { month },
          }),
          axios.post(`${baseUrl}/car_insurance_costs-percentage`, null, {
            params: { month },
          }),
          axios.post(`${baseUrl}/car_operating_costs-percentage`, null, {
            params: { month },
          }),
          axios.post(`${baseUrl}/costs-percentage`, null, {
            params: { month },
          }),
        ]);

        console.log("Step 3: Calculate net salary after costs");
        await axios.post(`${baseUrl}/net_salary_after_costs`, null, {
          params: { month },
        });

        console.log("✅ All calculations completed successfully.");

        // Fetch summary after calculations
        const response = await axios.get(`${baseUrl}/monthly_costs_summary`, {
          params: { month },
        });
        if (!response.data) {
          throw new Error("Failed to fetch summary");
        }

        const summaryData = response.data;
        console.log("🔍 Summary data from API:", summaryData);
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
        };

        setCostsSummary(mappedSummary);
      } catch (error) {
        console.error("Error during calculations:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    runCalculations();
  }, [userId, month, baseUrl]);

  if (isLoading) {
    return <div>Loading summary...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!costsSummary || !selectedCosts) {
    return <div>⏳ Waiting for data...</div>;
  }

  return (
    <div>
      <h2>Analysis for Monthly Costs ID: {selectedCosts.id}</h2>
      <div>
        <p>
          <strong>Total Monthly Costs:</strong> {costsSummary.monthlyCostsSum}{" "}
          zł
        </p>
        <p>
          <strong>Rent % of Salary:</strong> {costsSummary.rentPercentage} %
        </p>
        <p>
          <strong>Food % of Salary:</strong> {costsSummary.foodCostsPercentage}{" "}
          %
        </p>
        <p>
          <strong>Electricity % of Salary:</strong>{" "}
          {costsSummary.electricityPercentage} %
        </p>
        <p>
          <strong>Gas % of Salary:</strong> {costsSummary.gasPercentage} %
        </p>
        <p>
          <strong>Car Service %:</strong> {costsSummary.carServicePercentage} %
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
    </div>
  );
};

export default AnalysisPage;
