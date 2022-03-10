import React from "react";
import { Loader } from "semantic-ui-react";

const Spinner = ({ children }) => (
  <Loader active inline="centered" size="big" className="spinner">
    {children}
  </Loader>
);

export default Spinner;
