import React, { useState } from "react";

function CreateAccountForm(props) {
  const [user, setUser] = useState({
    userName: "",
    netSalary: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;
    setUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  async function handleUser(event) {
    event.preventDefault();

    const newUser = {
      name: user.userName,
      netSalary: parseFloat(user.netSalary),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/budget-management/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );
      if (response.ok) {
        const data = await response.json();
        alert(
          "Your user account has been successfully created ! Your ID is: " +
            data.id
        );
        props.onBackToLogin();
      } else {
        const errorMessage = await response.text();
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  return (
    <form onSubmit={handleUser}>
      <input
        onChange={handleChange}
        name="userName"
        placeholder="type in user name"
        value={user.userName}
      />
      <input
        onChange={handleChange}
        name="netSalary"
        placeholder="type in your net Salary"
        value={user.netSalary}
      />
      <button type="submit">Create User</button>
      <p
        onClick={() => props.onBackToLogin(true)}
        style={{ cursor: "pointer" }}
      >
        Back to Login
      </p>
    </form>
  );
}

export default CreateAccountForm;
