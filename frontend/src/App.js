import React, { Component } from 'react';
import Header from './components/Header/Header'
import EmployeeList from './components/Employee/Employee'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="m-3">
            <EmployeeList />
        </div>
      </div>
    );
  }
}

export default App;
