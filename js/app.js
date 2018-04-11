/*
 * A list that holds all the cards
 */
let allCards = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube",
        "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor",
        "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// Start the game - set all to default
  let open = [];
  let matchCard = 0;
  let movesCount = 0;
  let stars = 3;
  let timer = {
        secs: 0,
        mins: 0,
              };
let winner = $("#win");


// Start timer
let timerStart = function() {
    if (timer.secs >= 60) {
        timer.mins++;
        timer.secs = 0;
    } else {
        timer.secs++;
    }

    // Single digit secs ( 1- 9)  preceded with  0 (01-09)
    let formattedSec = "0";
    if (timer.secs <=9 ) {
        formattedSec += timer.secs
    } else {
        formattedSec = timer.secs;
    }

    let time = timer.mins + ":" + formattedSec;
    $(".timer").text(time);
};


// Restarts timer
function timerReset() {
    clearInterval(timer.clearTime);
    timer.secs = 0;
    timer.mins = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(timerStart, 1000);
};

// Randomizes cards on board and updates card HTML
function updateDeck() {
    allCards = shuffle(allCards);
    let index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + allCards[index]);
      index++;
    });
    timerReset();
};
// Changing the selected card class to open & show
function cardSelect(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
  };

// Changing the selected card class back to default
function faceUp(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

// Moves counter and level check
function updateMovesCount() {
  const expert = 12;
  const intermediate = 16;
  $(".moves").text(movesCount);
    if (movesCount === expert || movesCount === intermediate) {
        starRemove();

    }
  };

// Remove a star
function starRemove() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    stars--;
    $(".num-stars").text(stars);
};

// Set the stars number back to default
function starRestart() {
    $(".fa-star-o").attr("class", "fa fa-star");
};

// Returns whether or not currently open cards match
function isCorrect() {
  if (open[0].children().attr("class")===open[1].children().attr("class")) {
      return true;
  } else {
      return false;
  }
};

// Set incorect open card to default (close)

var resetCard = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
  };



// Sets currently open cards to the match state, checks win condition

var cardsMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matchCard += 2;

    if (matchCard === 16) {
        clearInterval(timer.clearTime);
        winningScreen();
    }
};


let onceClicking = function() {
    if (faceUp( $(this) )) {

        if (open.length === 0) {
            cardSelect( $(this) );

        } else if (open.length === 1) {
            cardSelect( $(this) );
            movesCount++;
            updateMovesCount();

            if (isCorrect()) {
                return cardsMatch();

            } else {
                setTimeout(resetCard, 900);

            }
        }
    }
};

//  Winning popup on
function winningScreen() {
    winner.css("display", "block");
};

// Resets all game state to default
  let resetGame = function() {
      open = [];
      matchCard = 0;
      movesCount = 0;
      timerReset();
      updateMovesCount();
      $(".card").attr("class", "card");
      updateDeck();
      starRestart();
      winner.css("display", "none");
  };


//  Start event listeners

 $(".card").click(onceClicking);
 $(".restart").click(resetGame);
 $(".new-game").click(resetGame);



 // New game board when page load
 $(updateDeck);
