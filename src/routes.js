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
import AerodromeList from "./entities/Aerodrome/AerodromeList";
import AerodromeForm from "./entities/Aerodrome/AerodromeForm";
import PassRecovery from "./components/ForgotPass";
import ResetPass from "./components/ResetPass";
import Profile from "./components/Profile";
import FlightList from "./entities/Flight/FlightList";
import FlightEdit from "./entities/Flight/FlightEdit";
import FlightNew from "./entities/Flight/FlightNew";
import FlightDetail from "./entities/Flight/FlightDetail";
import RouteList from "./entities/Route/RouteList";
import RouteNew from "./entities/Route/RouteNew";
import RouteEdit from "./entities/Route/RouteEdit";
import RouteDetail from "./entities/Route/RouteDetail";

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
          <Route path="/profile/:login" exact component={Profile} />
          <Route
            path="/aircrafts/edit/:id"
            exact
            component={requireAuth(AircraftForm)}
          />
          <Route
            exact
            path="/aerodromes"
            component={requireAuth(AerodromeList)}
          />
          <Route
            exact
            path="/aerodromes/new"
            component={requireAuth(AerodromeForm)}
          />
          <Route
            path="/aerodromes/edit/:id"
            exact
            component={requireAuth(AerodromeForm)}
          />
          <Route exact path="/myLogbook" component={requireAuth(FlightList)} />
          <Route
            path="/flights/edit/:id"
            exact
            component={requireAuth(FlightEdit)}
          />
          <Route path="/flights/new" exact component={requireAuth(FlightNew)} />
          <Route
            path="/flights/:id"
            exact
            component={requireAuth(FlightDetail)}
          />
          <Route exact path="/routes" component={RouteList} />
          <Route path="/routes/detail/:id" exact component={RouteDetail} />
          <Route path="/routes/new" exact component={requireAuth(RouteNew)} />
          <Route
            path="/routes/edit/:id"
            exact
            component={requireAuth(RouteEdit)}
          />
          <Route exact path="/" component={Home} />
          <Route exact component={Page404} />
        </Switch>
      </App>
    </PersistGate>
  </Provider>
);

export default AppRoutes;
