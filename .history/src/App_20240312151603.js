import logo from './logo.svg';
import './App.css';
//import {agentNameWords} from './agentNamesWords.js'
import { Component } from 'react';
import {collection, getDocs, getFirestore, updateDoc, doc} from 'firebase/firestore';
import {app, database} from './firebase'
import { deleteDoc, addDoc } from "firebase/firestore";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddUsers from "./AddUsers.js"
import Header from './Header.js';
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
      users:[],
      
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
    var killerID = "";
    var currentKills = 0;
    var killerTarget = "";
    var killerAlive;

    var victimID = "";
    var victimName = "";
    this.state.users.forEach(user => {
      if (user.agentName == killerAgentName) {
        // when found killer info
        killerID = user.id;
        currentKills = user.kills;
        killerTarget = user.target;
        killerAlive = user.alive;
      }

      if (user.agentName == victimAgentName) {
        // when found victim info
        victimID = user.id;
        victimName = user.name;
      }
    });

    var errorMSG = ""
    if (victimID === "") {
      errorMSG = "Invalid Agent Name";
    } else if (killerTarget.alive === false) {
      errorMSG = "You are dead. You cannot kill!"
    } else if (killerTarget != victimName) {
      errorMSG = "they're not your target dipshit"
    }
    
    if (errorMSG === "") {
      // no errors
      var docRef = doc(db, 'users', killerID);
      await updateDoc(docRef, {
        kills: currentKills+1
      });

      var docRef = doc(db, 'users', victimID);
      await updateDoc(docRef, {
        alive: false,
      });
      this.refreshUsers();
    } else {
      alert(errorMSG);
    }
    
    
  }

  render() {
    
    const {users} = this.state;

    return (
      <div className="App">
        <Header></Header>
        <Router>
          <Routes>
            <Route path = "/addusers" element = {<AddUsers msg= "heyy"></AddUsers>}/>
          </Routes>
        </Router>



        {users.map(user=>
        <p>
        <b>Name: {user.name}, Email: {user.email}, Agent Name: {user.agentName}, Kills: {user.kills}, Target: {user.target}, alive: {user.alive}</b>
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
