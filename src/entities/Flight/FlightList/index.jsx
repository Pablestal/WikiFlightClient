import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { HTTP } from "../../../common/http-common";
import { connect } from "react-redux";
import { notify } from "react-notify-toast";
import "./FlightList.css";
import EditIcon from "../../../icons/Edit";
import DeleteIcon from "../../../icons/Delete";
import DetailIcon from "../../../icons/Detail";
import { initializeFliAction, deleteFliAction } from "../../../redux/actions";
import CsvDownloader from "react-csv-downloader";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone
} from "react-bootstrap-table2-paginator";

class FlightList extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.getRows = this.getRows.bind(this);
  }

  componentDidMount() {
    HTTP.get(`flights/${this.props.login}`)
      .then(res => {
        const flights = res.data;
        this.props.initializeFliAction(flights);
      })
      .catch(function(error) {
        notify.show("Error loading flights", "error");
      });
  }

  handleDelete(flight) {
    HTTP.delete(`flights/${flight.id}`)
      .then(function(response) {
        notify.show("Flight removed", "success");
      })
      .catch(function(error) {
        notify.show("Flight cannot be removed", "error");
      });
    this.props.deleteFliAction(flight);
  }

  getCSVCol() {
    const columns = [
      {
        id: "cell1",
        displayName: "DepartureDate"
      },
      {
        id: "cell2",
        displayName: "DepartureTime"
      },
      {
        id: "cell3",
        displayName: "DepartureAerodrome"
      },
      {
        id: "cell4",
        displayName: "ArrivalDate"
      },
      {
        id: "cell5",
        displayName: "ArrivalTime"
      },
      {
        id: "cell6",
        displayName: "ArrivalAerodrome"
      },
      {
        id: "cell7",
        displayName: "AircraftMAnufacturer"
      },
      {
        id: "cell8",
        displayName: "AircraftModel"
      },
      {
        id: "cell9",
        displayName: "AircraftRegistration"
      },
      {
        id: "cell10",
        displayName: "TotalTime"
      },
      {
        id: "cell11",
        displayName: "SETime"
      },
      {
        id: "cell12",
        displayName: "METime"
      },
      {
        id: "cell13",
        displayName: "MPTime"
      },
      {
        id: "cell14",
        displayName: "NightTime"
      },
      {
        id: "cell15",
        displayName: "IFRTime"
      },
      {
        id: "cell16",
        displayName: "PICTime"
      },
      {
        id: "cell17",
        displayName: "CoopilotTime"
      },
      {
        id: "cell18",
        displayName: "DualTime"
      },
      {
        id: "cell19",
        displayName: "InstructorTime"
      },
      {
        id: "cell20",
        displayName: "DayTakeoffs"
      },
      {
        id: "cell21",
        displayName: "NightTakeoffs"
      },
      {
        id: "cell22",
        displayName: "DayLandings"
      },
      {
        id: "cell23",
        displayName: "NightLandings"
      },
      {
        id: "cell24",
        displayName: "Observations"
      }
    ];

    return columns;
  }

  getCSVData() {
    const data = [];

    this.props.flights.forEach(function(flight) {
      data.push({
        cell1: flight.departureDate,
        cell2: flight.departureTime,
        cell3: flight.takeoffAerodrome.name,
        cell4: flight.arrivalDate,
        cell5: flight.arrivalTime,
        cell6: flight.landingAerodrome.name,
        cell7: flight.aircraft.manufacturer,
        cell8: flight.aircraft.model,
        cell9: flight.aircraftReg,
        cell10: flight.totalTime,
        cell11: flight.seTime,
        cell12: flight.meTime,
        cell13: flight.mpTime,
        cell14: flight.nightTime,
        cell15: flight.ifrTime,
        cell16: flight.picTime,
        cell17: flight.coopilotTime,
        cell18: flight.dualTime,
        cell19: flight.instructorTime,
        cell20: flight.takeoffsDay,
        cell21: flight.takeoffsNight,
        cell22: flight.landingsDay,
        cell23: flight.landingsNight,
        cell24: flight.observations
      });
    });

    return data;
  }

  renderViewRouter(flight) {
    let rend;
    flight.route
      ? (rend = (
          <u>
            <Link
              to={{
                pathname: `routes/${flight.route}`,
                selected: flight
              }}
            >
              {flight.route.name}
            </Link>
          </u>
        ))
      : (rend = "No route");
    return rend;
  }

  getColumns() {
    const columns = [
      {
        dataField: "id",
        text: "ID",
        headerStyle: (colum, colIndex) => {
          return { width: "40px", textAlign: "center" };
        }
      },
      {
        text: "Detail",
        dataField: "detail",
        headerStyle: (colum, colIndex) => {
          return { width: "70px", textAlign: "center" };
        }
      },

      {
        text: "Date",
        dataField: "depDate",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "130px" };
        }
      },
      {
        text: "Departure",
        dataField: "departure",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "100px" };
        }
      },
      {
        text: "Arrival",
        dataField: "arrival",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "100px" };
        }
      },
      {
        text: "Route",
        dataField: "route",
        sort: true
      },
      {
        text: "Actions",
        dataField: "actions",
        headerStyle: (colum, colIndex) => {
          return { width: "150px", textAlign: "center" };
        }
      }
    ];

    return columns;
  }

  getRows() {
    let flights = this.props.flights;
    let data = [];

    flights.map(function(flight) {
      let route;

      flight.route ? (route = flight.route.name) : (route = "No route");

      return data.push({
        id: flight.id,
        detail: (
          <Link
            to={{
              pathname: `flights/${flight.id}`,
              state: { selected: flight }
            }}
          >
            <DetailIcon
              width="25px"
              height="25px"
              className="detailIcon"
            ></DetailIcon>
          </Link>
        ),
        depDate: flight.departureDate,
        departure: flight.takeoffAerodrome.codIATA,
        arrival: flight.landingAerodrome.codIATA,
        route: route,
        actions: (
          <React.Fragment>
            <Link
              title="Edit"
              to={{
                pathname: `/flights/edit/${flight.id}`,
                state: { selected: flight }
              }}
            >
              <EditIcon
                className="editIcon"
                width="25px"
                height="25px"
              ></EditIcon>
            </Link>
            <div title="Delete Flight">
              <DeleteIcon
                className="deleteIcon"
                onClick={() => this.handleDelete(flight)}
                width="25px"
                height="25px"
              ></DeleteIcon>
            </div>{" "}
          </React.Fragment>
        )
      });
    }, this);

    return data;
  }

  getData() {
    const data = { columns: this.getColumns(), rows: this.getRows() };

    return data;
  }

  renderList() {
    const options = {
      custom: true,
      totalSize: this.props.flights.length
    };

    const { SearchBar } = Search;

    let searchRoute = "";

    this.props.location.state
      ? (searchRoute = this.props.location.state.searchRoute)
      : (searchRoute = "");

    return (
      <ToolkitProvider
        keyField="id"
        data={this.getRows()}
        columns={this.getColumns()}
        search={{
          defaultSearch: searchRoute
        }}
      >
        {props => (
          <PaginationProvider pagination={paginationFactory(options)}>
            {({ paginationProps, paginationTableProps }) => (
              <div>
                <SearchBar {...props.searchProps} className="tableSearch" />
                <BootstrapTable
                  {...props.baseProps}
                  {...paginationTableProps}
                />
                <PaginationTotalStandalone {...paginationProps} />
                <PaginationListStandalone {...paginationProps} />
              </div>
            )}
          </PaginationProvider>
        )}
      </ToolkitProvider>
    );
  }

  renderEmpty() {
    let rend;
    this.props.flights.length === 0
      ? (rend = <h3 className="empty">List is empty, add a flight.</h3>)
      : (rend = this.renderList());
    return rend;
  }

  renderCSVButton() {
    if (this.props.flights.length !== 0) {
      return (
        <CsvDownloader
          columns={this.getCSVCol()}
          datas={this.getCSVData()}
          filename="WikiFlightData"
          separator=", "
        >
          <Button
            className="csvButton"
            title="Download a spreadsheet of your flight list."
            variant="new"
          >
            Download List
          </Button>
        </CsvDownloader>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <h2 className="tittle">My logbook</h2>
        <Row>
          <Col>
            <Link
              to={{
                pathname: `/flights/new`,
                state: { selected: "" }
              }}
            >
              <Button variant="new">New Flight</Button>
            </Link>
          </Col>
          <Col>{this.renderCSVButton()}</Col>
        </Row>
        <hr />
        {this.renderEmpty()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    login: state.auth.login,
    authority: state.auth.authority,
    flights: state.flight.flights
  };
}

export default connect(mapStateToProps, {
  initializeFliAction,
  deleteFliAction
})(FlightList);
