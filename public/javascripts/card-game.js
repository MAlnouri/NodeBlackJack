document.addEventListener("DOMContentLoaded", function(event) {
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
        } else {
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
                hitButton.style.display = "none";
                stayButton.style.display = "none";
                dealButton.style.display = "block";
                }
            }
        
        pSc.innerHTML = "Score: " + pScore;
        cSc.innerHTML = "Score: " + cScore;

        //changes color based on suit
        function suitColor (s) {
            switch (s) {
                default:
                    color = "black";
                    break;
                case 2:
                    color = "red";
                    break;
                case 3:
                    color = "red";
                    break;
            }
            return color;
        }

        function hit () {
            hits++;
            pRank = player[hits].rank;
            pSuit = player[hits].suit;
            pCard.innerHTML += " || " + translateR(pRank) + " OF " +  translateS(pSuit);
            pScore += updateScore(pRank);
        }

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
        } else if(pScore == cScore) {
            result.innerHTML = "PUSH! BETS RETURNED.";
            chips++;
        } else if(pScore > cScore) {
            result.innerHTML = "PLAYER WINS!";
            chips += 2;
        } else {
            result.innerHTML = "HOUSE WINS!";
        }

        cash.innerHTML = "Cash: " + chips;
        cSc.innerHTML = "Score: " + cScore;

        hitButton.style.display = "none";
        stayButton.style.display = "none";
        dealButton.style.display = "block";

        
    });

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
});