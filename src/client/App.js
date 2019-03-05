import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Home from "./home";
import Home2 from "./home2";

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route exact path="/home2" component={Home} />
          <Route exact path="/" component={Home2} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
