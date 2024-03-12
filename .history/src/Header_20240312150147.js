/*import React, {useEffect, useState} from 'react';

const AddUsers = ({msg}) => {
    return <h1>{msg}</h1>
}

export default AddUsers;*/

const Header = () => {
    return  (
    <div>
        <textarea class = "addUser" id = "userRealName"/>
        <textarea class = "addUser" id = "userEmails"/>
        <br></br>
        <button onClick={()=>this.addUsers()}> Add Users</button>
    </div>
    );
  };
  
  export default Header;