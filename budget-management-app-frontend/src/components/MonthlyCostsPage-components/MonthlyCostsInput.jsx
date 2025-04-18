import React from "react";

function MonthlyCostsInput(props) {
  function formatLabel(camelCase) {
    return camelCase.replace(/([A-Z])/g, " $1").toLowerCase();
  }

  return (
    <div>
      <input
        onChange={props.onChange}
        name={props.name}
        placeholder={formatLabel(props.placeholder)}
        value={props.value}
      />
      <p>{formatLabel(props.name)}</p>
    </div>
  );
}

export default MonthlyCostsInput;
