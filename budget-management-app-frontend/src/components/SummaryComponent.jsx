import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryComponent = ({ costs, summary }) => {
  const [adviceText, setAdviceText] = useState(null);
  const [adviceError, setAdviceError] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

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

      if (!response.ok) {
        throw new Error("Failed to get an advice.");
      }

      const json = await response.json();
      const advice = json.choices?.[0]?.message?.content;

      if (!advice) {
        throw new Error("Advice content missing in the response.");
      }

      setAdviceText(advice);
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdviceError(error.message);
    } finally {
      setAdviceLoading(false);
    }
  }

  return (
    <div style={{ margin: "40px auto", maxWidth: "900px" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Analysis for Monthly Costs ID: {costs.id}
      </Typography>

      <Card
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "white",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
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

            <Box sx={{ flex: 1, minWidth: 300, height: 300 }}>
              <Pie data={data} options={options} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <button className="monthly-costs-inner-button" onClick={getAdvice}>
              Get a financial advice
            </button>
          </Box>

          {adviceLoading && <div className="loader"></div>}

          {adviceError && (
            <div style={{ color: "red", marginTop: "10px" }}>
              Error: {adviceError}
            </div>
          )}

          {adviceText && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ color: "#FFDF88", fontWeight: "bold" }}>
                Financial Advice:
              </h3>
              <p>{adviceText}</p>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryComponent;
