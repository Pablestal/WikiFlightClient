import React from "react";
import { MDBDataTable } from "mdbreact";

const DatatablePage = () => {
  const data = {
    columns: [
      {
        label: "Detail",
        field: "detail",
        sort: "asc",
        width: 150
      },
      {
        label: "Date",
        field: "depDate",
        sort: "asc",
        width: 270
      },
      {
        label: "Departure",
        field: "departure",
        sort: "asc",
        width: 200
      },
      {
        label: "Arrival",
        field: "arrival",
        sort: "asc",
        width: 100
      },
      {
        label: "Route",
        field: "route",
        sort: "asc",
        width: 150
      },
      {
        label: "Actions",
        field: "actions",
        sort: "asc",
        width: 100
      }
    ],
    rows: [this.props.data]
  };

  return (
    <MDBDataTable
      striped
      bordered
      small
      data={(data.columns, this.props.data)}
    />
  );
};

export default DatatablePage;
