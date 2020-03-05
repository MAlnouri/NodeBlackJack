deck = {
    //creates an array of 52 cards with ranks and suits
    cards: [],
    
    load: function () {
        for(i = 2; i <= 14; i++) {
            for(j = 0; j < 4; j++) {
                this.cards.push(new Card(j, i));
            }
        }
    }
}