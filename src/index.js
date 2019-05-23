import React from "react";
import { render } from "react-dom";
import { Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AppRoutes from "./routes";
import history from "./history";

render(
  <Router history={history}>
    <AppRoutes />
  </Router>,
  document.getElementById("root")
);
