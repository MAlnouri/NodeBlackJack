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

playerArray.push(new Player("Mak", "abc123"));
playerArray.push(new Player("Jack", "abc12345"));
//console.log(playerArray[0].wins);
playerArray[0].wins = 10;
playerArray[0].losses = 2;
playerArray[1].wins = 1;
playerArray[1].losses = 5;
playerArray[1].money = 25;
//console.log(playerArray[0].wins);

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
      //if new user, pushes user info to player array
      playerArray.push(new Player(document.getElementById("user").value, document.getElementById("pass").value));
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
  //document.getElementById("IDparmHere").innerHTML = "";
  createList();
});
  
  document.getElementById("buttonClear").addEventListener("click", function () {
    document.getElementById("user").value = "";
    document.getElementById("pass").value = "";
    //document.getElementById("man").value = "";
    //document.getElementById("woman").value = "";
  });
  
$(document).on("pagebeforeshow", "#Login", function (event) {   // have to use jQuery 
  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";
  //document.getElementById("man").value = "";
  //document.getElementById("woman").value = "";
  });

$(document).on("pagebeforeshow", "#page3", function (event) {   // have to use jQuery 
  let localID =  document.getElementById("IDparmHere").innerHTML;
  let w = playerArray[localID - 1].wins;
  let l = playerArray[localID - 1].losses;
  document.getElementById("listUser").innerHTML = "User Name: " + playerArray[localID-1].userName;
  document.getElementById("listMoney").innerHTML = "Money $" + playerArray[localID - 1].money;
  document.getElementById("listGames").innerHTML = "Games Played " + (w + l);
  document.getElementById("listWins").innerHTML = "Wins " + playerArray[localID - 1].wins;
  document.getElementById("listLoss").innerHTML = "Losses " + playerArray[localID - 1].losses;
  document.getElementById("listWinrate").innerHTML = "Winrate " + (w / (w + l) * 100) + " %";
 });

});

function createList()
{
  // clear prior data
  var divUserlist = document.getElementById("divMovieList");
  while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
  divMovieList.removeChild(divMovieList.firstChild);
  };

  var ul = document.createElement('ul');  
  console.log(playerArray);
  playerArray.forEach(function (element,) {   // use handy array forEach method
    var li = document.createElement('li');
    li.innerHTML = "<a data-transition='pop' class='showUserName' data-parm=" + element.ID + "  href='#page3'>Get Details </a> " + element.ID + ":  " + element.userName + "  " + element.wins;
    ul.appendChild(li);
  });
  divMovieList.appendChild(ul)

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

//compares username and password to existing elements in array
function login (userName, password) {
  for (let i = 0; i < playerArray.length; i++) {
    if(userName == playerArray[i].userName) {
      console.log("Logging in...");
      return i;
    } else {
      i++;
    }
  }
  console.log("Login info was incorrect.")
}