import React, { useState } from "react";
import MonthlyCostsInput from "./MonthlyCostsInput";

function CreateMonthlyCostsForm(props) {
  const [monthlyCostsItem, setMonthlyCostsItem] = useState({
    rent: "",
    foodCosts: "",
    currentElectricityBill: "",
    currentGasBill: "",
    totalCarServiceCosts: "",
    carInsuranceCosts: "",
    carOperatingCosts: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;
    setMonthlyCostsItem((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  async function create(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/budget-management/users/${props.userId}/monthly_costs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(monthlyCostsItem),
        }
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert("Monthly costs created successfully!");
      props.onBackToMonthlyCostsPage(false);
    } catch (error) {
      alert("Error creating monthly costs: " + error.message);
    }
  }
  return (
    <form onSubmit={create}>
      <h1>Monthly Costs</h1>
      {Object.entries(monthlyCostsItem).map(([key, value]) => {
        return (
          <div>
            <MonthlyCostsInput
              onChange={handleChange}
              key={key}
              name={key}
              placeholder={key}
              value={value}
            />
          </div>
        );
      })}
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateMonthlyCostsForm;
