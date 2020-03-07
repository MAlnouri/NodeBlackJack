
var express = require('express');
var router = express.Router();

let serverPlayerArray = []; // our "permanent storage" on the web server

// define a constructor to create player objects
var Player = function (userName, password, wins, losses, money) {
  this.userName = userName;
  this.password = password;
  this.wins = wins;
  this.losses = losses;
  this.money = money;
  this.ID = serverPlayerArray.length + 1;
}

// preset data in the array
serverPlayerArray.push(new Player("Mak", "abc123", 22, 10, 99));
serverPlayerArray.push(new Player("Nikki", "password", 1, 8, 10));
serverPlayerArray.push(new Player("Jackson", "1", 25, 46, 45));


/* POST to login */
router.post('/login', function(req, res) {
  console.log(req.body);
  serverPlayerArray.push(req.body);
  console.log(serverPlayerArray);
  //res.sendStatus(200);
  res.status(200).send(JSON.stringify('success'));
});

/* POST to home */
router.post('/home', function(req, res) {
  console.log(req.body);
  updatedPlayer = req.body;
  serverPlayerArray[updatedPlayer.ID - 1] = updatedPlayer;
  console.log(serverPlayerArray);
  //res.sendStatus(200);
  res.status(200).send(JSON.stringify('success'));
});


/* GET hiscores. */
router.get('/hiscores', function(req, res) {
  res.json(serverPlayerArray);
 });


//  router.???('/userlist', function(req, res) {
//  users.update({name: 'foo'}, {name: 'bar'})



module.exports = router;

