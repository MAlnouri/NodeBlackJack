let playerArray = [];
let newOrOldUser = "NewUser";
let loginID;
let guest = true;
let loginNew = false;
let loginNewPlayer;

// define a constructor to create player objects
var Player = function (userName, password, wins, losses, money) {
  this.userName = userName;
  this.password = password;
  this.wins = 0;
  this.losses = 0;
  this.money = 25;
  this.ID = playerArray.length + 1;
}

document.addEventListener("DOMContentLoaded", function () {

  //pushes username and password to player array when login button is clicked
  document.getElementById("buttonLogin").addEventListener("click", function () {
    if(newOrOldUser == "ExistingUser") {
      //logs in as existing user
      loginID = login(document.getElementById("user").value, document.getElementById("pass").value);
      document.getElementById("loggedInAs").innerHTML = "Logged in as " + playerArray[loginID].userName;
      //reveals logged in as element
      document.getElementById("loggedInAs").style.display = "block";
      //changes money for user
      chips = playerArray[loginID].money;
      cash.innerHTML = "Cash: " + chips;
      //sets guest boolean to false
      guest = false;
    } else if (newOrOldUser == "NewUser") {
      //if new user, pushes user info to player array and to server
      loginNewPlayer = new Player(document.getElementById("user").value, document.getElementById("pass").value);
      addNewPlayer(loginNewPlayer);
      console.log(playerArray);
      loginNew = true;
    } else if (newOrOldUser == "DeleteUser") {
      //deletes user from array
      let deleteID = login(document.getElementById("user").value, document.getElementById("pass").value);
      console.log("Delete ID " + deleteID);
      // doing the call to the server right here
      fetch('users/deleteUser/' + deleteID , {
      // users/deleteMovie/Moonstruck   for example, this is what the URL looks like sent over the network
          method: 'DELETE'
      })  
      // now wait for 1st promise, saying server was happy with request or not
      .then(responsePromise1 => responsePromise1.text()) // ask for 2nd promise when server is node
      .then(responsePromise2 =>  console.log(responsePromise2), document.location.href = "index.html#refreshPage")  // wait for data from server to be valid
      // force jump off of same page to refresh the data after delete
      .catch(function (err) {
          console.log(err);
          alert(err);
        });
      if(loginID == deleteID) {
        //if deleted user was logged in, logs out as guest
        loginID =  null;
        guest = true;
        document.getElementById("loggedInAs").innerHTML = "Logged in as Guest";
        chips = 25;
        cash.innerHTML = "Cash: " + chips;
      }
    }
  });

  //changes value for existing or new user based on drop down choice selected
  $(document).bind("change", "#select-user", function (event, ui) {
    newOrOldUser = $('#select-user').val();
  });

  //sorts list by most money
  document.getElementById("buttonSortMoney").addEventListener("click", function () {
    playerArray = playerArray.sort(compareMoney);
    createList();
    //document.location.href = "index.html#Hiscores";
  });

  //sorts list by most wins
  document.getElementById("buttonSortWins").addEventListener("click", function () {
    playerArray = playerArray.sort(compareWins);
    createList();
    //document.location.href = "index.html#Hiscores";
  });

  $(document).on("pagebeforeshow", "#home", function (event) {   // have to use jQuery 
    //FillArrayFromServer(); // need to get fresh data
    if(loginNew == true) {
      //logs in as newly created user
      loginID = login(loginNewPlayer.userName, loginNewPlayer.password);
      document.getElementById("loggedInAs").innerHTML = "Logged in as " + playerArray[loginID].userName;
      //reveals logged in as element
      document.getElementById("loggedInAs").style.display = "block";
      //changes money for user
      chips = playerArray[loginID].money;
      cash.innerHTML = "Cash: " + chips;
      //sets guest boolean to false
      guest = false;
      loginNew = false;
      loginNewPlayer = undefined;
    }
  });

  $(document).on("pagebeforeshow", "#Hiscores", function (event) {   // have to use jQuery 
    FillArrayFromServer();  // need to get fresh data
    // createList(); this can't be here, as it is not waiting for data from server
  });

  $(document).on("pagebeforeshow", "#Login", function (event) {   // have to use jQuery 
    FillArrayFromServer();  // need to get fresh data
  });

  // leaving ListAll to force the pagebeforeshow on ListAll from within that page when delete
  $(document).on("pagebeforeshow", "#refreshPage", function (event) { 
    document.location.href = "index.html#ListAll";
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
    //IDparmHere
    let localUser = document.getElementById("listUser").innerHTML;
    console.log(localUser);
    for(let i = 0; i < playerArray.length; i++) {
      if(playerArray[i].userName == localUser) {
        let w = playerArray[i].wins;
        let l = playerArray[i].losses;
        document.getElementById("listUser").innerHTML = "User Name: " + playerArray[i].userName;
        document.getElementById("listMoney").innerHTML = "Money $" + playerArray[i].money;
        document.getElementById("listGames").innerHTML = "Games Played " + (w + l);
        document.getElementById("listWins").innerHTML = "Wins " + playerArray[i].wins;
        document.getElementById("listLoss").innerHTML = "Losses " + playerArray[i].losses;
        document.getElementById("listWinrate").innerHTML = "Winrate " + ((Math.round(w / (w + l) * 100))) + " %";
      }  
    }
  });

  //beginning of card game code

  let hits = 0;
  let comphits = 0;
  //scores for the game
  let pScore = 0;
  let cScore = 0;
  let chips = 25;

  const dealButton = document.getElementById("deal");
  const hitButton = document.getElementById("hit");
  const stayButton = document.getElementById("stay");

  let pCard = document.getElementById("playerCard");
  let cCard = document.getElementById("computerCard");
  let result = document.getElementById("result");
  let pSc = document.getElementById("pScore");
  let cSc = document.getElementById("cScore");
  let cash = document.getElementById("cash");

  cash.innerHTML = "Cash: " + chips;

  function hit () {
    hits++;
    pRank = player[hits].rank;
    pSuit = player[hits].suit;
    pCard.innerHTML += " || " + translateR(pRank) + " OF " +  translateS(pSuit);
    pScore += updateScore(pRank);
  }

  //arrays store the decks for the player and computer
  player = [];
  computer = [];
  //shuffles and deals a deck of cards to player and computer when button is clicked
  dealButton.addEventListener("click", function() {
    //resets the game
    hits = 0;
    comphits = 0;
    pScore = 0;
    cScore = 0;
    pCard.innerHTML = "";
    cCard.innerHTML = "";
    result.innerHTML = "";

    //places bet if player has enough money
    if(chips == 0) {
      result.innerHTML = "You don't have money to play.";
    } else if(guest) {
      console.log("playing as guest");
      chips--;
      cash.innerHTML = "Cash: " + chips;
      //creates a deck of 52 cards with ranks and suits
      deck.load();
      //shuffles the deck of cards
      for(i = 0; i < 52; i++) {
        const temp = Math.floor(Math.random() * (i + 1));
        const swap = deck.cards[temp];
        deck.cards[temp] = deck.cards[i];
        deck.cards[i] = swap;
      }
      //splits the deck between player and computer
      for(i = 0; i < 26; i++) {
        player[i] = deck.cards[i];
        computer[i] = deck.cards[i + 26];
      }
      //hides deal button and displays hit/stay buttons
      dealButton.style.display = "none";
      hitButton.style.display = "block";
      stayButton.style.display = "block";
    } else {
      chips--;
      playerArray[loginID].money--;
      cash.innerHTML = "Cash: " + chips;
      //creates a deck of 52 cards with ranks and suits
      deck.load();
      //shuffles the deck of cards
      for(i = 0; i < 52; i++) {
        const temp = Math.floor(Math.random() * (i + 1));
        const swap = deck.cards[temp];
        deck.cards[temp] = deck.cards[i];
        deck.cards[i] = swap;
      }
      //splits the deck between player and computer
      for(i = 0; i < 26; i++) {
        player[i] = deck.cards[i];
        computer[i] = deck.cards[i + 26];
      }
      //hides deal button and displays hit/stay buttons
      dealButton.style.display = "none";
      hitButton.style.display = "block";
      stayButton.style.display = "block";
    }
  });

    //deals the next card for each player when the button is clicked
    hitButton.addEventListener("click", function() {
      let pRank = player[hits].rank;
      let pSuit = player[hits].suit;
      let cRank = computer[hits].rank;
      let cSuit = computer[hits].suit;

      if(hits == 0) {
        //deals the play 2 cards and 1 card to computer to begin game
        pCard.innerHTML = translateR(pRank) + " OF " +  translateS(pSuit);
        pScore += updateScore(pRank);
        hit();
        cCard.innerHTML = translateR(cRank) + " OF " +  translateS(cSuit);
        cScore += cUpdateScore(cRank);
      } else {
        hit();
        if(pScore > 21) {
          result.innerHTML = "BUST!";
          //updates server array if logged in (not guest)
          if(!guest) {
            playerArray[loginID].losses++;
            updateServer(playerArray[loginID]);
          }
          console.log(playerArray);
          hitButton.style.display = "none";
          stayButton.style.display = "none";
          dealButton.style.display = "block";
        }
      }
      
      pSc.innerHTML = "Score: " + pScore;
      cSc.innerHTML = "Score: " + cScore;

    });

    stayButton.addEventListener("click", function() {
      //automates dealer actions
      while(cScore < 17) {
        comphits++;
        cRank = computer[comphits].rank;
        cSuit = computer[comphits].suit;
        cCard.innerHTML += " || " + translateR(cRank) + " OF " +  translateS(cSuit);
        cScore += cUpdateScore(cRank);
      }
      
      //compares dealer and player cards to determine winner
      if(cScore > 21) {
        result.innerHTML = "PLAYER WINS!";
        chips += 2;
        if(!guest) {
          playerArray[loginID].wins++;
          playerArray[loginID].money += 2;
          updateServer(playerArray[loginID]);
        }
        console.log(playerArray);
      } else if(pScore == cScore) {
        result.innerHTML = "PUSH! BETS RETURNED.";
        chips++;
        if(!guest) {
          playerArray[loginID].money++;
          updateServer(playerArray[loginID]);
        }
        console.log(playerArray);
      } else if(pScore > cScore) {
        result.innerHTML = "PLAYER WINS!";
        chips += 2;
        if(!guest) {
          playerArray[loginID].wins++;
          playerArray[loginID].money += 2;
          updateServer(playerArray[loginID]);
        }
        console.log(playerArray);
      } else {
        if(!guest) {
          playerArray[loginID].losses++;
          updateServer(playerArray[loginID]);
        }
        console.log(playerArray);
        result.innerHTML = "HOUSE WINS!";
      }

      cash.innerHTML = "Cash: " + chips;
      cSc.innerHTML = "Score: " + cScore;

      hitButton.style.display = "none";
      stayButton.style.display = "none";
      dealButton.style.display = "block";
      
    });
    //end of card game code

});

function compareWins(a, b) {
  const winsA = a.wins;
  const winsB = b.wins;

  let comparison = 0;
  if (winsA > winsB) {
    comparison = -1;
  } else if (winsA < winsB) {
    comparison = 1;
  }
  return comparison;
}

function compareMoney(a, b) {
  const moneyA = a.money;
  const moneyB = b.money;

  let comparison = 0;
  if (moneyA > moneyB) {
    comparison = -1;
  } else if (moneyA < moneyB) {
    comparison = 1;
  }
  return comparison;
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

function updateServer(player) {
  // the required post body data is the playerObject passed in, player
  // create request object
  const request = new Request('/users/home', {
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
        .then(theResonsePromiseJson => console.log(theResonsePromiseJson), document.location.href = "#Home")
        // that client console log will write out the message I added to the Repsonse on the server
        .catch(function (err) {
            console.log(err);
        });
};

//compares username and password to existing elements in array
function login (userName, password) {
  for (let i = 0; i < playerArray.length; i++) {
    if(userName == playerArray[i].userName && password == playerArray[i].password) {
      console.log("Logging in...");
      return i;
    }
  }
  console.log("Login info was incorrect.")
}

function createList() {
  // clear prior data
  var divUserlist = document.getElementById("divHiscores");
  while (divHiscores.firstChild) {    // remove any old data so no duplicates
  divHiscores.removeChild(divHiscores.firstChild);
  };

  var ul = document.createElement('ul');  
  playerArray.forEach(function (element,) {   // use array forEach method
    var li = document.createElement('li');
    //try #page3
    li.innerHTML = "<a data-transition='pop' class='showUserName' data-parm=" + element.userName + "  href='#home'>Get Details </a> " + element.ID + ":  " + element.userName;
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
      element.addEventListener('click', function() {
          var parm = this.getAttribute("data-parm");  // passing in the record.Id
          //IDparmHere
          document.getElementById("listUser").innerHTML = parm;
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

function updateScore(c) {
  switch (c) {
    case 11:
      rank = 10;
      break;
    case 12:
      rank = 10;
      break;
    case 13:
      rank = 10;
      break;
    case 14:
      if(pScore > 10) {
        rank = 1;
      } else {
        rank = 11;
      }
      break;
    default:
      rank = c;
      break;
  }
  return rank;
}

function cUpdateScore(d) {
  switch (d) {
      case 11:
          rank = 10;
          break;
      case 12:
          rank = 10;
          break;
      case 13:
          rank = 10;
          break;
      case 14:
          if(cScore > 10) {
              rank = 1;
          } else {
              rank = 11;
          }
          break;
      default:
          rank = d;
          break;
  }
  return rank;
}

//translates suits to strings
function translateS (s) {
  switch (s) {
      case 0:
          suit = "SPADES";
          break;
      case 1:
          suit = "CLUBS";
          break;
      case 2:
          suit = "DIAMONDS";
          break;
      case 3:
          suit = "HEARTS";
          break;
  }
  return suit;
}

//translates face cards to strings
function translateR (r) {
  switch (r) {
      case 11:
          rank = "JACK";
          break;
      case 12:
          rank = "QUEEN";
          break;
      case 13:
          rank = "KING";
          break;
      case 14:
          rank = "ACE";
          break;
      default:
          rank = r;
          break;
  }
  return rank;
}