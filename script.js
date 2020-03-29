const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let gameType;
let cardPath;
let cardsNumber;
let findCards = 0;
let attempt = 0;
let chronoStart = false;

let firstCardId;
let secondCardId;
let switchCard = false;

let chronoSecond = 0;
let chronoMinute = 0;

let clickEnabled = true;

$(function() {
  $('.game').css({'right' : '100%'});
  $('.game').hide();
  $('.history').hide();
  $('.sec1').hide();
  $('.sec2').hide();
  $('.sec3').hide();
  $('.sec4').hide();
}); 

$('.reload').click(function() {
  location.reload();
});

$('.play').click(function() {
  if(startVerificator() == true) {
    $('.menu').animate({'right' : '100%'}, 1500);

    setTimeout( function() {
      $('.menu').hide();
      $('.game').show();
      $('.history').show();
      switch (gameType) {
        case 0:
          $('.sec1').show();
          document.getElementById("panel-title").innerText = "Plateau 2/3";
          break;
        case 1:
          $('.sec2').show();
          document.getElementById("panel-title").innerText = "Plateau 3/6";
          break;
        case 2:
          $('.sec3').show();
          document.getElementById("panel-title").innerText = "Plateau 6/6";
          break;
        case 3:
          $('.sec4').show();
          document.getElementById("panel-title").innerText = "Plateau Difficile";
          break;
      
        default:
          break;
      }
      $('.game').animate({'left' : '-4%'}, 1500);
    }, 1500 );
  }
});

function cardSelector (selector) {
  cardPath = "img/badge_card" + selector + ".png";

  for (let index = 0; index < 3; index++) {
    document.getElementById('cs'+index).style.backgroundColor = "";
  }

  document.getElementById('cs'+selector).style.backgroundColor = "#27ae60";
}

function gameSelector (selector) {
  gameType = selector;

  switch (selector) {
    case 0:
      cardsNumber = 6;
      break;
    case 1:
      cardsNumber = 18;
      break;
    case 2:
      cardsNumber = 36;
      break;
    case 3:
      cardsNumber = 36;
      break;
    default:
      break;
  }

  for (let index = 0; index < 4; index++) {
    document.getElementById('ls'+index).style.backgroundColor = "";
  }

  document.getElementById('ls'+selector).style.backgroundColor = "#27ae60";
}

function startVerificator () {
  if(gameType == null) {
    alert("Merci de sélectionner un Plateau");
    return false;
  } else if(cardPath == null) {
    alert("Merci de sélectionner un dos de Carte");
    return false;
  }

  backCards();
  return true;
}

function backCards () {
  for (let index = 0; index < cardsNumber; index++) {
    document.getElementById("back-card"+gameType+index).src = cardPath;
  }
}

function cardIdentify (id) {

  if(chronoStart == false) {
    chronoStart = true;
    onChrono();
  }

  if(switchCard == false) {
    firstCardId = id;
    switchCard = true;
  } else if(switchCard == true) {
    secondCardId = id;
    switchCard = false;

    clickEnabled = false;
    console.log("false");
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.airline === secondCard.dataset.airline;

  attempt++;
  document.getElementById("score-attempt").innerText = "Tentatives : " + attempt;

  if(isMatch == false) {
    unflipCards();

    $(function() {
      setTimeout( function() {
        clickEnabled = true;
        console.log("true");
      }, 2000 );
    });
  }

  if(isMatch == true) {
    findCards +=2;

    $(function() {
      setTimeout( function() {
        $("."+firstCardId).css({"opacity" : "0"});
        $("."+secondCardId).css({"opacity" : "0"});
      }, 1000 );
      setTimeout( function() {

        if(gameType == 3) {
          cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 12);
            card.style.order = randomPos;
          });
        }

        winDetector();
      }, 1200 );
    });
    $(function() {
      setTimeout( function() {
        clickEnabled = true;
        console.log("true");
      }, 1500 );
    });
  }
}

function winDetector () {
  if(cardsNumber == findCards) {

    chronoStart = false;

    document.getElementById("finish-chrono").innerText = chronoMinute + " : " + chronoSecond;
    document.getElementById("attempt").innerText = attempt;

    $(function() {
      $('.finish').show();
      $('.score').hide();
      $('.history').hide();
    });
  }
}

function onChrono () {
  if(chronoSecond < 59) chronoSecond++;
  else {
    chronoMinute++;
    chronoSecond = 0;
  }

  if(chronoMinute < 10){
    if(chronoSecond < 10){
    document.getElementById("score-chrono").innerText = "Temps : 0" + chronoMinute + " : 0" + chronoSecond;
    }else {
      document.getElementById("score-chrono").innerText = "Temps : 0" + chronoMinute + " : " + chronoSecond;
    }
  }else {
    if(chronoSecond < 10){
      document.getElementById("score-chrono").innerText = "Temps : " + chronoMinute + " : 0" + chronoSecond;
    }else {
      document.getElementById("score-chrono").innerText = "Temps : " + chronoMinute + " : " + chronoSecond;
    }
  }
  

  if(chronoStart == true) setTimeout(onChrono, 1000);
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => {
  if (clickEnabled == true) card.addEventListener('click', flipCard);
});