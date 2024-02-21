import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      notes:[]
    }
  }

  async refreshNotes() {
    var notesList = []
  }

  render() {
    return (
      <div className="App">
        <h1>Assassins App</h1>
      </div>
    );
  }

}

export default App;
