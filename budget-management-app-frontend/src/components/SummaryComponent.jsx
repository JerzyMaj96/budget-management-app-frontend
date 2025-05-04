import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryComponent = ({ costs, summary }) => {
  const [adviceText, setAdviceText] = useState(null);
  const [adviceError, setAdviceError] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  const navigate = useNavigate();

  const labels = ["Rent", "Food", "Electricity", "Gas"];
  const dataValues = [
    costs.rent,
    costs.foodCosts,
    costs.currentElectricityBill,
    costs.currentGasBill,
  ];
  const colors = ["#f5ba13", "#66bb6a", "#29b6f6", "#ef5350"];

  if (costs.carInsuranceCosts != null) {
    labels.push("Car Insurance");
    dataValues.push(costs.carInsuranceCosts);
    colors.push("#ab47bc");
  }

  if (costs.carOperatingCosts != null) {
    labels.push("Car Operating");
    dataValues.push(costs.carOperatingCosts);
    colors.push("#ffa726");
  }

  if (costs.totalCarService != null) {
    labels.push("Car Service");
    dataValues.push(costs.totalCarService);
    colors.push("#26c6da");
  }

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          boxWidth: 20,
          padding: 15,
          color: "#fff",
        },
      },
    },
    maintainAspectRatio: false,
  };

  async function getAdvice(event) {
    event.preventDefault();
    setAdviceLoading(true);
    setAdviceError(null);

    if (!costs.userId || !costs.month) {
      setAdviceError("Missing userId or month.");
      setAdviceLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/budget-management/users/${costs.userId}/monthly_costs/advice?month=${costs.month}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to get an advice.");

      const json = await response.json();
      const advice = json.choices?.[0]?.message?.content;

      if (!advice) throw new Error("Advice content missing in the response.");

      setAdviceText(advice);
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdviceError(error.message);
    } finally {
      setAdviceLoading(false);
    }
  }

  return (
    <div className="summary-container">
      <KeyboardBackspaceIcon
        onClick={() => navigate(-1)}
        className="back-icon"
      />
      <Typography variant="h4" className="summary-title">
        Analysis for Monthly Costs ID: {costs.id}
      </Typography>

      <Card className="summary-card">
        <CardContent>
          <Box className="summary-content-box">
            <Box className="summary-info">
              <Typography variant="body1">
                <strong>Total Monthly Costs:</strong> {summary.monthlyCostsSum}{" "}
                zł
              </Typography>
              <Typography variant="body1">
                <strong>Rent % of Salary:</strong> {summary.rentPercentage} %
              </Typography>
              <Typography variant="body1">
                <strong>Food % of Salary:</strong> {summary.foodCostsPercentage}{" "}
                %
              </Typography>
              <Typography variant="body1">
                <strong>Electricity % of Salary:</strong>{" "}
                {summary.electricityPercentage} %
              </Typography>
              <Typography variant="body1">
                <strong>Gas % of Salary:</strong> {summary.gasPercentage} %
              </Typography>
              <Typography variant="body1">
                <strong>Car Service %:</strong> {summary.carServicePercentage} %
              </Typography>
              <Typography variant="body1">
                <strong>Car Insurance %:</strong>{" "}
                {summary.carInsurancePercentage} %
              </Typography>
              <Typography variant="body1">
                <strong>Car Operating %:</strong>{" "}
                {summary.carOperatingPercentage} %
              </Typography>
              <Typography variant="body1">
                <strong>Total Costs % of Salary:</strong>{" "}
                {summary.totalCostsPercentage} %
              </Typography>
              <Typography variant="body1">
                <strong>Net Salary After Costs:</strong>{" "}
                {summary.netSalaryAfterCosts} zł
              </Typography>
            </Box>

            <Box className="summary-chart">
              <Pie data={data} options={options} />
            </Box>
          </Box>

          <Box className="summary-advice-btn">
            <button className="monthly-costs-inner-button" onClick={getAdvice}>
              Get a financial advice from Chat GPT
            </button>
          </Box>

          {adviceLoading && <div className="loader"></div>}

          {adviceError && (
            <div className="summary-error">Error: {adviceError}</div>
          )}

          {adviceText && (
            <Box className="summary-advice-box">
              <h3 className="summary-advice-title">Financial Advice:</h3>
              <p>{adviceText}</p>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryComponent;
