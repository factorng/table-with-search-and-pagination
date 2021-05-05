import React from "react";
import styled from "styled-components";

const SearchForm = styled.form`
  max-width: 30%;
  border: 1px solid ${(props) => props.borderColor || "lightgrey"};
  color: ${(props) => props.color || "black"};
  background-color: ${(props) => props.backgroundColor || "white"};
  padding: 1rem;
  margin: 2rem 0 2rem 1rem;
  position: relative;
  &:after {
    position: absolute;
    content: "Search";
    top: -0.7rem;
    left: 1rem;
    background-color: white;
  }
  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
`;

const ResetButton = styled.button`
  color: red;
  border: 0;
  backgroung-color: light-grey;
  position: absolute;
  border-radius: 20px;
  right: 1.2rem;
  top: 36%;
  cursor: pointer;
  width: 1rem;
  height: 1rem;
`;

export default function Search({ handleSearch }) {
  const [input, setInput] = React.useState("");
  const timer = React.useRef(null);

  return (
    <SearchForm onSubmit={(e) => e.preventDefault()}>
      <Input
        name="search"
        onChange={(e) => {
          setInput(e.target.value);
          if (timer.current) {
            clearTimeout(timer.current);
          }

          timer.current = setTimeout(() => {
            handleSearch(e.target.value);
          }, 500);
        }}
        value={input || ""}
        // onBlur={(e) => {
        //   setInput("");
        // }}
      />
      <ResetButton
        onClick={(e) => {
          setInput("");
          handleSearch("");
        }}
      >
        X
      </ResetButton>
    </SearchForm>
  );
}
