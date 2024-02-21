import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import {collection, getDocs, getFirestore} from 'firebase/firestore/lite';
import {app} from './firebase'

class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      notes:[]
    }
  }

  async refreshNotes() {
    var notesList = []
    const db = getFirestore(app);
    const notesCol = collection(db, 'notes');
    const notesSnapshot = await getDocs(notesCol);

    notesSnapshot.forEach(doc=> {
      let note=doc.data();
      note.id = doc.id;
      notesList.push(note);
    });

    this.setState({notes:notesList});

    
  }

  componentDidMount() {
    this.refreshNotes();
  }

  render() {
    const {notes} = this.state;

    return (
      <div className="App">
        <h1>Assassins App</h1>

        {notes.map(note=>
        <b>* {note.description}</b>
        )}
      </div>
    );
  }

}

export default App;
