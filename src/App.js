import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import { WrappedEstimatorForm } from './estimator-form/estimator-form.component';
import { Logo } from './_shared/components/logo';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Logo />
        </header>
        <WrappedEstimatorForm />
      </div>
    );
  }
}

export default App;
