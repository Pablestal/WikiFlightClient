import React from "react";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import requireAuth from "./redux/requireAuth";
import noRequireAuth from "./redux/noRequireAuth";
import { PersistGate } from "redux-persist/integration/react";

import Signin from "./components/Signin";
import Register from "./components/Register";
import App from "./components/App";
import Home from "./components/Home";
import Page404 from "./components/Page404";
import AircraftForm from "./entities/Aircraft/AircraftForm";
import AircraftList from "./entities/Aircraft/AircraftList";
import PassRecovery from "./components/ForgotPass";
import ResetPass from "./components/ResetPass";

const AppRoutes = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App>
        <Switch>
          <Route exact path="/register" component={noRequireAuth(Register)} />
          <Route exact path="/login" component={noRequireAuth(Signin)} />
          <Route
            exact
            path="/forgotPassword"
            component={noRequireAuth(PassRecovery)}
          />
          <Route
            path="/resetPassword/:token"
            exact
            component={noRequireAuth(ResetPass)}
          />
          <Route
            exact
            path="/aircrafts"
            component={requireAuth(AircraftList)}
          />
          <Route
            exact
            path="/aircrafts/new"
            component={requireAuth(AircraftForm)}
          />
          <Route path="/aircrafts/edit/:id" exact component={AircraftForm} />
          <Route exact path="/" component={Home} />
          <Route exact component={Page404} />
        </Switch>
      </App>
    </PersistGate>
  </Provider>
);

export default AppRoutes;
