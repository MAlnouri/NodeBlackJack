
var express = require('express');
var router = express.Router();

let serverPlayerArray = []; // our "permanent storage" on the web server

// define a constructor to create player objects
var Player = function (userName, password, wins, losses, money) {
  this.userName = userName;
  this.password = password;
  this.wins = 0;
  this.losses = 0;
  this.money = 100;
  this.ID = serverPlayerArray.length + 1;
}

// for testing purposes, its nice to preload some data
serverPlayerArray.push(new Player("Mak", "abc123", 22, 18, 99));
serverPlayerArray.push(new Player("Nikki", "abc123", 1, 8, 10));
//serverPlayerArray.push(new Player("Wild_At_Heart", 1990, "Drama", "Nicholas Cage", "Laura VanDern"));
//serverPlayerArray.push(new Player("Raising_Arizona", 1987, "Comedy", "Nicholas Cage", "Holly Hunter"));
//serverPlayerArray.push(new Player("La_La_Land", 2016, "Musical", "Ryan Gosling", "Emma Stone"));


/* POST to login */
router.post('/login', function(req, res) {
  console.log(req.body);
  serverPlayerArray.push(req.body);
  console.log(serverPlayerArray);
  //res.sendStatus(200);
  res.status(200).send(JSON.stringify('success'));
});


/* GET hiscores. */
router.get('/hiscores', function(req, res) {
  res.json(serverPlayerArray);
 });

 /* DELETE to deleteMovie. */
 /*
 router.delete('/deleteMovie/:Title', function(req, res) {
  let Title = req.params.Title;
  Title = Title.toLowerCase();  // allow user to be careless about capitalization
  console.log('deleting ID: ' + Title);
   for(let i=0; i < serverMovieArray.length; i++) {
     if(Title == (serverMovieArray[i].Title).toLowerCase()) {
     serverMovieArray.splice(i,1);
     }
   }
   res.status(200).send(JSON.stringify('deleted successfully'));
});*/


//  router.???('/userlist', function(req, res) {
//  users.update({name: 'foo'}, {name: 'bar'})



module.exports = router;

