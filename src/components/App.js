import React, { Component } from "react";
import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";
//import Header from "./global/Header";
//import "../App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}

export default App;
