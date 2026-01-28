let gameMode = 'cpu'; // Default mode
let aPendingChoice = ""; // temporarily store P1 choice in PVP
let playerOneScore = 0;
let playerTwoScore = 0;
let ties = 0;



//---Api Configuration---//
//--This is a practice placeholder--//
const aCpuApiUrl = "https://rpsdemov1-bad6e5b0eff8bxdc.westus3-01.azurewebsites.net/api/rps/rpscpuup";
// -------DOM Elements------- //
const aBtnModeCpu = document.getElementById("btnModeCpu");
const aBtnModePvp = document.getElementById("btnModePvp");
const aModeHint = document.getElementById("modeHint");

const aP1PickEl = document.getElementById("p1Pick");
const aP2PickEl = document.getElementById("p2Pick");
const aRoundResultEl = document.getElementById("roundResult");

const aP2Section = document.getElementById("p2Section");
const aP2Hint = document.getElementById("p2Hint");

const aP1ScoreEl = document.getElementById("p1Score");
const aP2ScoreEl = document.getElementById("p2Score");
const aTiesEl = document.getElementById("ties");

const aBtnPlayAgain = document.getElementById("btnPlayAgain");
const aBtnReset = document.getElementById("btnReset");

// Player 1 buttons
const aBtnP1Rock = document.getElementById("btnP1Rock");
const aBtnP1Paper = document.getElementById("btnP1Paper");
const aBtnP1Scissors = document.getElementById("btnP1Scissors");

// Player 2 buttons (PVP)
const aBtnP2Rock = document.getElementById("btnP2Rock");
const aBtnP2Paper = document.getElementById("btnP2Paper");
const aBtnP2Scissors = document.getElementById("btnP2Scissors");

// -------- Helper Functions -------- //

// Switch game mode
function aSetMode(ANewMode) {
    gameMode = ANewMode;
    aPendingChoice = "";
    aClearPicksUI();

    if (gameMode === 'cpu') {
        aBtnModeCpu.classList.add("isActive");
        aBtnModePvp.classList.remove("isActive");
        aP2Section.style.display = "none";
        aModeHint.innerText = "You are playing against the CPU. Make your choice!";
    } else {
        aBtnModePvp.classList.add("isActive");
        aBtnModeCpu.classList.remove("isActive");
        aP2Section.style.display = "block";
        aModeHint.textContent = "Player 1 picks first, then Player 2 picks.";
        aP2Hint.textContent = "Waiting for Player 1...";
    }
}

// Clear picks display
function aClearPicksUI() {
    aP1PickEl.textContent = "-";
    aP2PickEl.textContent = "-";
    aRoundResultEl.textContent = "Make your choice to start!";
}

// Update scores
function aUpdateScoresUI() {
    aP1ScoreEl.textContent = playerOneScore;
    aP2ScoreEl.textContent = playerTwoScore;
    aTiesEl.textContent = ties;
}

// Random CPU choice
function aRandomCpuChoice() {
    const choices = ["rock", "paper", "scissors"];
    const index = Math.floor(Math.random() * 3);
    return choices[index];
}

//--Return back Cpu choice from API--//
function aGetCpuChoiceFromAPi() {
  return fetch(aCpuApiUrl)
    .then(function (response) {
      return response.text();
  }).then(function (text) {
    return text.trim().toLocaleLowerCase();
  });
}
// Determine winner
function aDetermineWinner(p1Choice, p2Choice) {
    if (p1Choice === p2Choice) return "tie";

    if (
        (p1Choice === "rock" && p2Choice === "scissors") ||
        (p1Choice === "paper" && p2Choice === "rock") ||
        (p1Choice === "scissors" && p2Choice === "paper")
    ) {
        return "player1";
    } else {
        return "player2";
    }
}

// Play a round
function aBtnPlayRound(p1Choice, p2Choice) {
    aP1PickEl.textContent = p1Choice;
    aP2PickEl.textContent = p2Choice;

    const winner = aDetermineWinner(p1Choice, p2Choice);

    if (winner === "tie") {
        ties += 1;
        aRoundResultEl.textContent = "It's a tie!";
    } else if (winner === "player1") {
        playerOneScore += 1;
        aRoundResultEl.textContent = "Player 1 wins!";
    } else {
        playerTwoScore += 1;
        if (gameMode === "cpu") {
            aRoundResultEl.textContent = "CPU wins!";
        } else {
            aRoundResultEl.textContent = "Player 2 wins!";
        }
    }

    aUpdateScoresUI();
}

// Handle Player 1 choice
function handleP1Choice(choice) {
    if (gameMode === "cpu") {
        aP1PickEl.textContent = choice;
        aP2PickEl.textContent = "...";
        aRoundResultEl.textContent = "CPU is making its choice...";
        
        aGetCpuChoiceFromAPi()
        .then(function(cpuChoice) {
         aBtnPlayRound(choice, cpuChoice);
        })
        return;
    } else {
        aPendingChoice = choice;
        aP1PickEl.textContent = choice;
        aP2PickEl.textContent = "?";
        aRoundResultEl.textContent = "Player 2, make your pick!";
        aP2Hint.textContent = "Your turn!";
    }
}

// Handle Player 2 choice (PVP)
function handleP2Choice(choice) {
    if (!aPendingChoice) return;
    aBtnPlayRound(aPendingChoice, choice);
    aPendingChoice = "";
    aP2Hint.textContent = "Waiting for Player 1...";
}

// ----------------- EVENT LISTENERS ----------------- //

aBtnModeCpu.addEventListener("click", () => aSetMode('cpu'));
aBtnModePvp.addEventListener("click", () => aSetMode('pvp'));

aBtnP1Rock.addEventListener("click", () => handleP1Choice("rock"));
aBtnP1Paper.addEventListener("click", () => handleP1Choice("paper"));
aBtnP1Scissors.addEventListener("click", () => handleP1Choice("scissors"));

aBtnP2Rock.addEventListener("click", () => handleP2Choice("rock"));
aBtnP2Paper.addEventListener("click", () => handleP2Choice("paper"));
aBtnP2Scissors.addEventListener("click", () => handleP2Choice("scissors"));

aBtnPlayAgain.addEventListener("click", () => {
    aClearPicksUI();
    aPendingChoice = "";
    if (gameMode === 'pvp') aP2Hint.textContent = "Waiting for Player 1...";
});

aBtnReset.addEventListener("click", () => {
    playerOneScore = 0;
    playerTwoScore = 0;
    ties = 0;
    aClearPicksUI();
    aUpdateScoresUI();
    aPendingChoice = "";
    if (gameMode === 'pvp') aP2Hint.textContent = "Waiting for Player 1...";
});

