import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import SummaryComponent from "./SummaryComponent";

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
    if (!userId || month == null) {
      return;
    }

    const runCalculations = async () => {
      try {
        await axios.post(`${baseUrl}/sum`, null, { params: { month } });

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

        await axios.post(`${baseUrl}/net_salary_after_costs`, null, {
          params: { month },
        });

        const response = await axios.get(`${baseUrl}/monthly_costs_summary`, {
          params: { month },
        });
        if (!response.data) {
          throw new Error("Failed to fetch summary");
        }

        const summaryData = response.data;

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
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    runCalculations();
  }, [userId, month, baseUrl]);

  if (isLoading) {
    return <div className="loader">Loading summary...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!costsSummary || !selectedCosts) {
    return <div>⏳ Waiting for data...</div>;
  }

  return <SummaryComponent costs={selectedCosts} summary={costsSummary} />;
};

export default AnalysisPage;
