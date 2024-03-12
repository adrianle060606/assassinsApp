/*import React, {useEffect, useState} from 'react';

const AddUsers = ({msg}) => {
    return <h1>{msg}</h1>
}

export default AddUsers;*/

import { Component } from 'react';
import {collection, getDocs, getFirestore, updateDoc, doc} from 'firebase/firestore';
import {app, database} from './firebase'
import { deleteDoc, addDoc } from "firebase/firestore";


const AddUsers = () => {

    const addUsers = async () => {

        var userRealNames = document.getElementById("userRealName").value.split("\n");
        var userEmails = document.getElementById("userEmails").value.split("\n");
        const db = getFirestore(app);
        const usersCol = collection(db, 'users');
        var agentNames = []
        var tempAgentWords = this.state.agentNameWords;
    
        var errorMSG = "";
        if (userRealNames.length != userEmails.length) {
          alert("they're not equal length dumbass");
        }
    
    
        for (let i=0; i<userRealNames.length; i++) {
          // generate agent names
          
          var tempIndex = Math.floor(Math.random() * tempAgentWords.length);
          agentNames.push(tempAgentWords[tempIndex])
          tempAgentWords.splice(tempIndex, 1)
        }
    
        for (let i=0; i<userRealNames.length; i++) {
          var newUserRealName = userRealNames[i];
          var newUserEmail = userEmails[i];
          var targetIndex = i + 1;
          var agentName = agentNames[i];
          if (i === userRealNames.length - 1) {
            targetIndex = 0
          }
          var targetName = userRealNames[targetIndex]
          var newUserObject = {
            name: newUserRealName,
            email: newUserEmail,
            agentName: agentName,
            target: targetName,
            kills: 0,
            alive: true
          };
          await addDoc(usersCol, newUserObject);
        }
    
        
        
        
        this.refreshUsers()
      }

    return  (
    <div>
        <textarea class = "addUser" id = "userRealName"/>
        <textarea class = "addUser" id = "userEmails"/>
        <br></br>
        <button onClick={()=>this.addUsers()}> Add Users</button>
    </div>
    );
  };
  
  export default AddUsers;