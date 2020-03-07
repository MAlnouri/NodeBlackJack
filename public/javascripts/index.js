let playerArray = [];
let newOrOldUser = "None";
let loginID;

// define a constructor to create player objects
var Player = function (userName, password, wins, losses, money) {
  this.userName = userName;
  this.password = password;
  this.wins = 0;
  this.losses = 0;
  this.money = 25;
  this.ID = playerArray.length + 1;
}
/*
playerArray.push(new Player("Mak", "abc123"));
playerArray.push(new Player("Jack", "abc12345"));
//console.log(playerArray[0].wins);
playerArray[0].wins = 10;
playerArray[0].losses = 2;
playerArray[1].wins = 1;
playerArray[1].losses = 5;
playerArray[1].money = 25;
//console.log(playerArray[0].wins);
*/

document.addEventListener("DOMContentLoaded", function () {

  //pushes username and password to player array when login button is clicked
  document.getElementById("buttonLogin").addEventListener("click", function () {
    //changes value for existing or new user based on drop down choice selected
    $(document).bind("change", "#select-user", function (event, ui) {
      newOrOldUser = $('#select-user').val();
    });

    if(newOrOldUser == "ExistingUser") {
      //logs in as existing user
      loginID = login(document.getElementById("user").value);
      document.getElementById("loggedInAs").innerHTML = "Logged in as " + playerArray[loginID].userName;
      //reveals logged in as element
      document.getElementById("loggedInAs").style.display = "block";

    } else if (newOrOldUser == "NewUser") {
      //if new user, pushes user info to player array and to server
      //playerArray.push(new Player(document.getElementById("user").value, document.getElementById("pass").value));
      let newPlayer = new Player(document.getElementById("user").value, document.getElementById("pass").value);
      playerArray.push(newPlayer);
      addNewPlayer(newPlayer);
      console.log(playerArray);
    } else {
      //if none selected, prompts user to select login type
      console.log("Please select something");
    }
});

//sorts list by most money
document.getElementById("buttonSortMoney").addEventListener("click", function () {
  playerArray.sort(dynamicSort("Money"));
  createList();
  document.location.href = "index.html#Hiscores";
});

//sorts list by most wins
document.getElementById("buttonSortWins").addEventListener("click", function () {
  playerArray.sort(dynamicSort("Wins"));
  createList();
  document.location.href = "index.html#Hiscores";
});

$(document).on("pagebeforeshow", "#Hiscores", function (event) {   // have to use jQuery 
  FillArrayFromServer();  // need to get fresh data
  // createList(); this can't be here, as it is not waiting for data from server
});

document.getElementById("buttonClear").addEventListener("click", function () {
  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";
});

$(document).on("pagebeforeshow", "#Login", function (event) {   // have to use jQuery 
  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";
  });

$(document).on("pagebeforeshow", "#page3", function (event) {   // have to use jQuery 
  let localID = document.getElementById("IDparmHere").innerHTML;
  console.log(localID);
  for(let i=0; i < playerArray.length; i++) {   
    if(playerArray[i].ID = localID){
      let w = playerArray[i].wins;
      let l = playerArray[i].losses;
      document.getElementById("listUser").innerHTML = "User Name: " + playerArray[localID - 1].userName;
      document.getElementById("listMoney").innerHTML = "Money $" + playerArray[i].money;
      document.getElementById("listGames").innerHTML = "Games Played " + (w + l);
      document.getElementById("listWins").innerHTML = "Wins " + playerArray[i].wins;
      document.getElementById("listLoss").innerHTML = "Losses " + playerArray[i].losses;
      document.getElementById("listWinrate").innerHTML = "Winrate " + (w / (w + l) * 100) + " %";
    }  
  }
});

});

/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/
function dynamicSort(property) {
  var sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  }
}

// using fetch to push an object up to server
function addNewPlayer(player) {
  // the required post body data is the playerObject passed in, player
  // create request object
  const request = new Request('/users/login', {
      method: 'POST',
      body: JSON.stringify(player),
      headers: new Headers({
          'Content-Type': 'application/json'
      })
  });
  
    // pass that request object we just created into the fetch()
    fetch(request)
        // wait for frist server promise response of "200" success (can name these returned promise objects anything you like)
        // Note this one uses an => function, not a normal function, just to show you can do either 
        .then(theResonsePromise => theResonsePromise.json())    // the .json sets up 2nd promise
        // wait for the .json promise, which is when the data is back
        .then(theResonsePromiseJson => console.log(theResonsePromiseJson), document.location.href = "#Hiscores")
        // that client console log will write out the message I added to the Repsonse on the server
        .catch(function (err) {
            console.log(err);
        });
};
    

//compares username and password to existing elements in array
function login (userName, password) {
  for (let i = 0; i < playerArray.length; i++) {
    if(userName == playerArray[i].userName /*&& password == playerArray[i].userName*/) {
      console.log("Logging in...");
      return i;
    } else {
      i++;
    }
  }
  console.log("Login info was incorrect.")
}

function createList() {
  // clear prior data
  var divUserlist = document.getElementById("divHiscores");
  while (divHiscores.firstChild) {    // remove any old data so don't get duplicates
  divHiscores.removeChild(divHiscores.firstChild);
  };

  var ul = document.createElement('ul');  
  playerArray.forEach(function (element,) {   // use handy array forEach method
    var li = document.createElement('li');
    //try #page3
    li.innerHTML = "<a data-transition='pop' class='showUserName' data-parm=" + element.ID + "  href='#home'>Get Details </a> " + element.ID + ":  " + element.userName + "  " + element.wins;
    ul.appendChild(li);
    // ok, this is weird.  If I set the href in the <a  anchor to detailPage, it messes up the success of
    // the button event that I add in the loop below.  By setting it to home, it jumps to home for a second
    // but then the button event sends it correctly to the detail page and the value of data-parm is valid.
    ul.appendChild(li);
  });
  divHiscores.appendChild(ul)

  //set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
  var classname = document.getElementsByClassName("showUserName");
  Array.from(classname).forEach(function (element) {
      element.addEventListener('click', function(){
          var parm = this.getAttribute("data-parm");  // passing in the record.Id
          //do something here with parameter on  pickbet page
          document.getElementById("IDparmHere").innerHTML = parm;
          document.location.href = "index.html#page3";
      });
  });
};

function FillArrayFromServer() {
  // using fetch call to communicate with node server to get all data
  fetch('/users/hiscores')
  .then(function (theResonsePromise) {  // wait for reply.  Note this one uses a normal function, not an => function
      return theResonsePromise.json();
  })
  .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
  console.log(serverData);
  playerArray.length = 0;  // clear array
  playerArray = serverData;   // use our server json data which matches our objects in the array perfectly
  createList();  // placing this here will make it wait for data from server to be complete before re-doing the list
  })
  .catch(function (err) {
   console.log(err);
  });
};