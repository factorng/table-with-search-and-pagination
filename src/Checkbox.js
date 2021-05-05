import React from "react";
import styled from "styled-components";

const Ul = styled.ul`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  max-width: 80%;
  border: 1px solid ${(props) => props.borderColor || "lightgrey"};
  color: ${(props) => props.color || "black"};
  background-color: ${(props) => props.backgroundColor || "white"};
  padding: 1rem;
  margin-top: 2rem;
  margin-left: 1rem;
  &:after {
    position: absolute;
    content: "Hide columns";
    top: -0.7rem;
    left: 1rem;
    background-color: white;
  }
`;

const Li = styled.li`
  display: flex;
`;

export default function Checkboxes({ data, onCheckboxChange }) {
  const [checkboxes, setCheckboxes] = React.useState({});

  const handleCheck = (e) => {
    setCheckboxes({
      ...checkboxes,
      [e.target.value]: !checkboxes[e.target.value],
    });
  };

  React.useEffect(() => {
    onCheckboxChange(checkboxes);
  }, [checkboxes]);

  React.useEffect(() => {
    const initialCheckboxesState = {};
    data.forEach((elem) => {
      initialCheckboxesState[elem] = false;
    });
    setCheckboxes(initialCheckboxesState);
  }, [data]);

  return (
    <Ul>
      {data.map((elem, i) => (
        <Li key={elem + "checkbox" + i}>
          <input
            onChange={handleCheck}
            type="checkbox"
            checked={checkboxes[elem] || false}
            value={elem}
          />{" "}
          {elem}
        </Li>
      ))}
    </Ul>
  );
}
