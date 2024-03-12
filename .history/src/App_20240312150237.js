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
      agentNameWords: [
        "Africa", "Agent", "Air", "Alien", "Alp", "Amazon", "Ambulance", "America", "Angel", "Ant",
        "Apple", "Arm", "Atlant", "Australia", "Aztec", "Back", "Ball", "Band", "Bank", "Bar",
        "Bark", "Bat", "Battery", "Beach", "Bear", "Beat", "Bed", "Bee", "Bell", "Belt",
        "Berlin", "Bermuda", "Berry", "Bill", "Block", "Board", "Bolt", "Bomb", "Bond", "Boom",
        "Boot", "Bottle", "Bow", "Box", "Break", "Bride", "Bridge", "Brush", "Buck", "Buffalo",
        "Bug", "Bugle", "Button", "Cable", "Calf", "Canada", "Capital", "Car", "Card", "Care",
        "Case", "Cash", "Cast", "Cat", "Cell", "Centaur", "Center", "Chair", "Change", "Charge",
        "Check", "Chest", "Chick", "China", "Chocolate", "Church", "Circle", "City", "Clamp", "Class",
        "Claw", "Click", "Cliff", "Clock", "Club", "Code", "Cold", "Comic", "Compound", "Concert",
        "Cone", "Contract", "Cook", "Copper", "Cotton", "Court", "Cover", "Crane", "Crash", "Cricket",
        "Cross", "Crown", "Cycle", "Czech", "Dance", "Date", "Day", "Deck", "Degree", "Diamond",
        "Dice", "Dinosaur", "Disease", "Dish", "Disney", "Doctor", "Dog", "Draft", "Dragon", "Dress",
        "Drill", "Drop", "Duck", "Dwar", "Eagle", "Egypt", "Elephant", "Em", "Engineer", "England",
        "Europe", "Eye", "Face", "Fair", "Fall", "Fan", "Farm", "Fast", "Fence", "Field",
        "Fight", "File", "Film", "Fire", "Fish", "Flame", "Flash", "Fleece", "Flight", "Flip",
        "Floor", "Flower", "Fly", "Foam", "Force", "Forest", "Fork", "France", "Frank", "Freeze",
        "French", "Frost", "Fruit", "Fuel", "Gallop", "Game", "Garden", "Gas", "Genie", "Germany",
        "Ghost", "Giant", "Ginger", "Glacier", "Glass", "Globe", "Goat", "Gold", "Golf", "Government",
        "Grace", "Graduate", "Greece", "Green", "Grind", "Guard", "Guess", "Guitar", "Gum", "Hail",
        "Hair", "Hamburg", "Hammer", "Hand", "Hawk", "Head", "Heart", "Helicopter", "Hell", "Helmet",
        "Help", "Hide", "Highway", "Hill", "Himalayas", "Hippy", "Hole", "Hollywood", "Honey", "Hood",
        "Hook", "Horn", "Horse", "Hospital", "Hotel", "House", "Ice", "Ice Cream", "India", "Ink",
        "Insect", "Internet", "Ireland", "Iron", "Island", "Jack", "Jam", "Japan", "Jet", "Jewelry",
        "Joint", "Joke", "Jordan", "Judo", "Jump", "Jungle", "Jupiter", "Kangaroo", "Karate", "Key",
        "Kid", "King", "Kitchen", "Kiwi", "Knife", "Knight", "Knock", "Knot", "Koala", "Korea",
        "Lab", "Lace", "Lady", "Lamp", "Law", "Lead", "Leak", "Leap", "Leather", "Lemon",
        "Lemonade", "Leprechaun", "Letter", "License", "Life", "Light", "Limousine", "Line", "Link", "Lion",
        "List", "Log", "London", "Loop", "Love", "Luck", "Lumber", "Mag", "Magic", "Mammoth",
        "Maple", "Marble", "March", "Mars", "Mask", "Mass", "Mast", "Match", "Mate", "May",
        "Maze", "Medal", "Memory", "Mercury", "Mexico", "Microscope", "Milk", "Mine", "Mint", "Miss",
        "Model", "Moon", "Mosquito", "Mount", "Mouse", "Mouth", "Mug", "Museum", "Mushroom", "Music",
        "Nail", "Needle", "Net", "New York", "Night", "Nile", "Ninja", "Norway", "Nose", "Note",
        "Novel", "Nurse", "Nut", "Octopus", "Oil", "Olive", "Olympics", "Opera", "Orange", "Orbit",
        "Oregon", "Organ", "Owl", "Oz", "Pacific", "Paddle", "Page", "Paint", "Pal", "Palace",
        "Palm", "Panda", "Pan", "Pants", "Paper", "Park", "Part", "Pass", "Paste", "Path",
        "Paw", "Peace", "Peach", "Peanut", "Pearl", "Pegasus", "Penguin", "Penny", "Pepper", "Peru",
        "Pet", "Phone", "Piano", "Pick", "Picture", "Pie", "Pilot", "Pin", "Pine", "Pipe",
        "Pirate", "Pitch", "Plane", "Planet", "Plaster", "Plate", "Platypus", "Play", "Plot", "Plow",
        "Plug", "Plum", "Plumber", "Pocket", "Poem", "Point", "Poison", "Poland", "Pole", "Police",
        "Pool", "Pop", "Porch", "Port", "Post", "Pound", "Press", "Princess", "Pumpkin", "Punch",
        "Punk", "Pupil", "Pyramid", "Queen", "Question", "Rabbit", "Race", "Radio", "Rail", "Rain",
        "Rainbow", "Rat", "Ray", "Razor", "Red", "Renaissance", "Revolve", "Rhine", "Rib", "Rice",
        "Rich", "Ring", "River", "Roach", "Road", "Robin", "Rock", "Rome", "Roof", "Room",
        "Rose", "Roulette", "Round", "Row", "Rubber", "Russia", "Rust", "Saddle", "Safe", "Sail",
        "Salad", "Salmon", "Salt", "Sand", "Sandwich", "Satellite", "Saturn", "Sauce", "Saw", "Scale",
        "School", "Science", "Scorpion", "Scotland", "Scrub", "Sea", "Seal", "Seat", "Seed", "Septic",
        "Septum", "Series", "Servant", "Sew", "Shaft", "Shakespeare", "Shamrock", "Shark", "Sheep", "Sheet",
        "Shell", "Sherwood", "Ship", "Shirt", "Shock", "Shoe", "Shoot", "Shop", "Shore", "Short",
        "Show", "Shrink", "Sick", "Side", "Signal", "Silk", "Silver", "Sink", "Siphon", "Sister",
        "Skate", "Ski", "Skyscraper", "Slam", "Sled", "Sleep", "Sleigh", "Slice", "Slide", "Slime",
        "Slingshot", "Slip", "Sloth", "Slug", "Slush", "Smoke", "Smooth", "Snail", "Snake", "Sneak",
        "Snow", "Snowman", "Soap", "Soccer", "Social", "Sock", "Solar", "Soldier", "Solid", "Solo",
        "Song", "Sound", "Soup", "South", "Space", "Spain", "Spark", "Speak", "Speed", "Spell",
        "Spider", "Spike", "Spin", "Spine", "Spiral", "Spirit", "Sponge", "Spoon", "Spring", "Square",
        "Stadium", "Staff", "Stage", "Stain", "Stamp", "Star", "State", "Steak", "Steam",
        "Steel", "Stem", "Step", "Stick", "Sting", "Stitch", "Stock", "Stone", "Stop", "Storm",
        "Story", "Straw", "Stream", "Street", "Strike", "String", "Stripe", "Strong", "Stump", "Sugar",
        "Suit", "Summer", "Sun", "Superhero", "Surf", "Surgeon", "Surprise", "Swallow", "Swan", "Sweat",
        "Sweden", "Sweet", "Swing", "Swiss", "Sword", "Syrup", "Table", "Tail", "Tale", "Talk",
        "Tank", "Tap", "Tape", "Target", "Task", "Taste", "Tea", "Teacher", "Team", "Tear",
        "Teddy", "Telescope", "Temple", "Tennis", "Tent", "Term", "Test", "Texas", "Theatre", "Thermometer",
        "Thief", "Thigh", "Thin", "Thing", "Thumb", "Ticket", "Tie", "Tiger", "Time", "Tin",
        "Tip", "Tire", "Toast", "Toe", "Tomato", "Tomb", "Tongue", "Tooth", "Top", "Torch",
        "Tornado", "Tortoise", "Tower", "Track", "Train", "Triangle", "Trick", "Trip", "Troll", "Trousers",
        "Truck", "Trumpet", "Trunk", "Tube", "Tug", "Turkey", "Turn", "Turtle", "Tutu", "Twig",
        "Twin", "Twist", "Tyrant", "Ufo", "Ugly", "Unicorn", "Uniform", "Union", "Unit", "Uranus",
        "Usa", "Vacuum", "Valentine", "Valley", "Van", "Vampire", "Vanish", "Vase", "Vegetable", "Velvet",
        "Venus", "Vest", "Vet", "Viking", "Village", "Vine", "Violet", "Violin", "Virus", "Vision",
        "Vitamin", "Voice", "Volleyball", "Wagon", "Waist", "Wait", "Walk", "Wall", "War", "Wash",
        "Waste", "Watch", "Water", "Wave", "Wax", "Web", "Wedding", "Week", "Well", "Whale",
        "Wheat", "Wheel", "Whip", "Whistle", "White", "Wig", "Will", "Wind", "Window", "Wine",
        "Wing", "Winter", "Wire", "Witch", "Wizard", "Wolf", "Wood", "Wool", "Word", "Work",
        "Worm", "Wrench", "Wrinkle", "X-ray", "Yard", "Yawn", "Year", "Yellow", "Yeti", "Yoga",
        "Yogurt", "York", "You", "Zebra", "Zero", "Zeus", "Zipper", "Zombie"
      ]
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

  async addUsers() {

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
