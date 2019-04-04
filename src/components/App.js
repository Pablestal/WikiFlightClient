import React, { Component } from "react";
// import Footer from "./Footer/Footer";
import Navbar from "./Navbar";
import Content from "./Content";
import PropTypes from "prop-types";
//import Header from "./global/Header";
import "../App.css";
import Notifications from "react-notify-toast";

class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    const { children } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <Notifications />
        <Content body={children} />
        {/* <footer>
          <Footer />
        </footer> */}
      </div>
    );
  }
}

export default App;
