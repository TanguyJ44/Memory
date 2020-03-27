const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let gameType;
let cardPath;

$(function() {
  $('.game').css({'right' : '100%'});
  $('.game').hide();
}); 

$('.play').click(function() {
  if(startVerificator() == true) {
    $('.menu').animate({'right' : '100%'}, 1500);

    setTimeout( function() {
      $('.menu').hide();
      $('.game').show();
      $('.game').animate({'left' : '2%'}, 1500);
    }, 1500 );
  }
});

function cardSelector (selector) {
  cardPath = "/img/badge_card" + selector + ".png";

  for (let index = 0; index < 3; index++) {
    document.getElementById('cs'+index).style.backgroundColor = "";
  }

  document.getElementById('cs'+selector).style.backgroundColor = "#27ae60";
}

function gameSelector (selector) {
  gameType = selector;

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
  return true;
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
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
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

cards.forEach(card => card.addEventListener('click', flipCard));