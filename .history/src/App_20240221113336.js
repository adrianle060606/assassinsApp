import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import {getFirestore} from 'firebase/firestore/lite';


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

    componentDidMount() {
      this.refreshNotes();
    }
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
