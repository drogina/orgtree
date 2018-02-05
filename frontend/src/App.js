import React, { Component } from 'react';
import Header from './components/Header/Header'
import EmployeeList from './components/Employee/Employee'

class App extends Component {
  render() {
    return (
      <div className="App position-relative h-100">
        <Header />
        <EmployeeList />
      </div>
    );
  }
}

export default App;
