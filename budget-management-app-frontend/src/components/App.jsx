import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [headingName, setHeadingName] = useState("");

  function handleClick() {
    setHeadingName(name);
  }

  function handleChange(event) {
    setName(event.target.value);
  }
  return (
    <div className="container">
      <h1>Hello {headingName}</h1>
      <form onSubmit={handleClick}>
        <input
          onChange={handleChange}
          type="text"
          placeholder="What's your name?"
          // value={name}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
