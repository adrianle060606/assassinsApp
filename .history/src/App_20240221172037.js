import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {app, database} from './firebase'
import {doc, deleteDoc, addDoc } from "firebase/firestore";

class App extends Component{

  /*
    structure of user document

    user {
      name: 
      agentName:
      kills:
      alive: 
    }
  */

  constructor(props) {
    super(props);
    this.state = {
      users:[]
    }
  }

  async refreshUsers() {
    var usersList = []
    const db = getFirestore(app);
    
    const usersCol = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCol);

    usersSnapshot.forEach(doc=> {
      let user=doc.data();
      user.id = doc.id;
      usersList.push(user);
    });

    this.setState({users:usersList});

    
  }

  componentDidMount() { 
    this.refreshUsers();
  }

  async addClick() {
    var newUserRealName = document.getElementById("userRealName").value;
    var newUserAgentName = document.getElementById("agentName").value;
    var newUserObject = {
      name: newUserRealName,
      agentName: newUserAgentName,
      kills: 0,
      alive: true
    };
    const db = getFirestore(app);
    const usersCol = collection(db, 'users');
    
    await addDoc(usersCol, newUserObject);
    this.refreshUsers()
  }

  async deleteClick(id) {
    const db = getFirestore(app);
    const usersRef = doc(db, 'users/'+id);
    console.log(id)
    await deleteDoc(usersRef);
    this.refreshUsers()
  }

  render() {
    
    const {users} = this.state;

    return (
      <div className="App">
        <h1>Assassins App</h1>

        <input id = "userRealName"/>
        <br></br>
        <input id = "agentName"/>
        <br></br>
        <button onClick={()=>this.addClick()}> Add User</button>

        {users.map(user=>
        
        <p>
        <b>Name: {user.name}, Agent Name: {user.agentName}, Kills: {user.kills}, alive: {user.alive}</b>
        <button onClick={()=>this.deleteClick(user.id)}> Delete User</button>
        </p>
        )}
      </div>
    );
  }

}

export default App;
