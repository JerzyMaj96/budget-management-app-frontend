import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryComponent = ({ costs, summary }) => {
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryComponent;
