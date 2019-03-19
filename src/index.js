import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
//import App from "./components/App";
import "bootstrap/dist/css/bootstrap.css";
import AppRoutes from "./routes";

render(
  <Router>
    <AppRoutes />
  </Router>,
  document.getElementById("root")
);
