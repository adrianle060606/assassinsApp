import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import {collection, getDocs, getFirestore, updateDoc, doc} from 'firebase/firestore';
import {app, database} from './firebase'
import { deleteDoc, addDoc } from "firebase/firestore";

class App extends Component{

  /*
    structure of user document

    user {
      name:
      email:  
      agentName:
      kills:
      target: 
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

  async submitKill() {
    const db = getFirestore(app);
    var killerAgentName = document.getElementById("killerName").value;
    var victimAgentName = document.getElementById("victimName").value;
    // find ID of victim
    var killerID = ""
    var currentKills = 0
    var victimID = ""
    this.state.users.forEach(user => {
      if (user.agentName == killerAgentName) {
        killerID = user.id;
        currentKills = user.kills;
      }

      if (user.agentName == victimAgentName) {
        victimID = user.id;
      }
    });
    

    var docRef = doc(db, 'users', killerID);
    await updateDoc(docRef, {
      kills: currentKills+1
    });

    var docRef = doc(db, 'users', victimID);
    await updateDoc(docRef, {
      alive: false,
    });
    this.refreshUsers();
  }

  render() {
    
    const {users} = this.state;

    return (
      <div className="App">
        <h1>Assassins App</h1>

        <textarea id = "userRealName"/>
        <br></br>
        <textarea id = "agentName"/>
        <br></br>
        <button onClick={()=>this.addClick()}> Add User</button>

        {users.map(user=>
        <p>
        <b>Name: {user.name}, Agent Name: {user.agentName}, Kills: {user.kills}, alive: {user.alive}</b>
        <button onClick={()=>this.deleteClick(user.id)}> Delete User</button>
        </p>
        )}

        <h2>Submit Kill</h2>
        Your Agent Name: <input id = "killerName"/>
        <br></br>
        Your Victim's Agent Name: <input id = "victimName"/>
        <br></br>
        <button onClick={()=>this.submitKill()}> Submit Kill</button>
      </div>
    );
  }

}

export default App;
