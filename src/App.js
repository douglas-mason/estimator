import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { WrappedEstimatorForm } from "./estimator-form/estimator-form.component";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Project Estimator</h1>
        </header>
        <WrappedEstimatorForm />
      </div>
    );
  }
}

export default App;
