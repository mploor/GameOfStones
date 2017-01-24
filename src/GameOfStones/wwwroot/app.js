var userMove;
var piles;
var pileLetter = ["A", "B", "C"];
var userScore = 0;
var compScore = 0;
// Function to draw piles of stones - includes move processing on click
function drawStones(piles) {
    var pileString;
    pileString = "<p>A: " + piles[0] + "</p>";
    pileString += "<p>B: " + piles[1] + "</p>";
    pileString += "<p>C: " + piles[2] + "</p>";
    var pileString2;
    pileString2 = "<table>";
    for (var i = 5; i > 0; i--) {
        pileString2 += "<tr>";
        for (var j = 0; j < piles.length; j++) {
            if (piles[j] >= i) {
                pileString2 += "<td><img src='images/stone.jpg' class='pileTable' id='" + j + i + "'></td>";
            }
            else {
                pileString2 += "<td><img src='images/blank.jpg'></td>";
            }
        }
        pileString2 += "</tr>";
    }
    pileString2 += "<tr><td> A </td><td> B </td><td> C </td><tr></table>";
    document.getElementById("gameField").innerHTML = pileString2;
    // Execute move when user clicks on stone
    $(".pileTable").click(function (e) {
        console.log("Table click detected");
        var pileIndex = parseInt(e.currentTarget.id.charAt(0));
        var numStones = piles[pileIndex] - parseInt(e.currentTarget.id.charAt(1)) + 1;
        console.log("Pile: " + pileIndex + "  number: " + numStones);
        // Execute users move
        document.getElementById("userMoveText").innerHTML = "<p>Your move: " + pileLetter[pileIndex] + numStones + "</p>";
        piles[pileIndex] = piles[pileIndex] - numStones;
        drawStones(piles);
        $("#userMove").val(""); // Clear move entry box
        // Check for user win
        if (winner(piles)) {
            document.getElementById("userMoveText").innerHTML = "<p><strong>You win this round</strong></p>";
            document.getElementById("compMoveText").innerHTML = "";
            userScore++;
            if (updateScore(userScore, compScore)) {
                document.getElementById("userMoveText").innerHTML = "<p><strong>You Win the game!</strong></p>";
                $("#newGameBox").show();
                userScore = 0;
                compScore = 0;
                return;
            }
            else {
                $("#nextRoundBox").show();
                return;
            }
        }
        // Determine computer move
        var compMove = findCompMove(piles);
        // Execute computer move
        piles[compMove[0]] = piles[compMove[0]] - compMove[1];
        $("#compMoveText").hide();
        $("#compMoveText").fadeIn(1000);
        setTimeout(function () { drawStones(piles); }, 1500);
        // Check for computer win
        if (winner(piles)) {
            document.getElementById("compMoveText").innerHTML = "<p>My move: " + pileLetter[compMove[0]] + compMove[1] + "</p><p><strong>I win this round</strong></p>";
            document.getElementById("userMoveText").innerHTML = "";
            compScore++;
            if (updateScore(userScore, compScore)) {
                document.getElementById("compMoveText").innerHTML = "<p><strong>I Win the game!</strong></p>";
                userScore = 0;
                compScore = 0;
                $("#newGameBox").show();
                return;
            }
            else {
                $("#nextRoundBox").show();
                return;
            }
        }
        else {
            document.getElementById("compMoveText").innerHTML = "<p>My move: " + pileLetter[compMove[0]] + compMove[1] + "</p>";
        }
    });
}
// Function returns true if a player has won the current game
function winner(piles) {
    var total = 0;
    for (var i = 0; i < piles.length; i++) {
        total += piles[i];
    }
    if (total == 0) {
        return true;
    }
    else {
        return false;
    }
}
// Function updates score on html page, returns true if a player has won 3 games, else false
function updateScore(userScore, compScore) {
    var scoreString1 = "<p>You: " + userScore + "</p>";
    var scoreString2 = "<p>Me: " + compScore + "</p>";
    document.getElementById("score1").innerHTML = scoreString1;
    document.getElementById("score2").innerHTML = scoreString2;
    if (userScore == 3 || compScore == 3) {
        return true;
    }
    else {
        return false;
    }
}
// Function to determine computer move
function findCompMove(piles) {
    var compPile = 0;
    do {
        compPile = Math.floor(Math.random() * 3);
    } while (piles[compPile] == 0);
    var zeroCount = 0; // Count piles with no stones
    for (var i = 0; i < piles.length; i++) {
        if (piles[i] == 0) {
            zeroCount++;
        }
    }
    var compNum = 0;
    if (zeroCount == 2) {
        compNum = piles[compPile];
    }
    else {
        compNum = Math.ceil(Math.random() * (piles[compPile]));
    }
    // If possible, do not give winning move to player 
    if (zeroCount == 1 && piles[compPile] == compNum) {
        if (compNum > 1) {
            compNum = compNum - 1;
        }
        else {
            for (var i = 0; i < piles.length; i++) {
                if (piles[i] > 1) {
                    compPile = i;
                    compNum = piles[i] - 1;
                }
            }
        }
    }
    var compMove = [compPile, compNum];
    return compMove;
}
// Start new game when start button is clicked
$("#startGame, #newGame, #nextRound").click(function () {
    $("#playButton").hide();
    $("#gameField").show();
    $("#newGameBox").hide();
    $("#nextRoundBox").hide();
    $("#score").show();
    document.getElementById("userMoveText").innerHTML = "";
    document.getElementById("compMoveText").innerHTML = "";
    piles = [5, 5, 5];
    drawStones(piles);
    updateScore(userScore, compScore);
    $("#userMove").focus();
});
$("#quitGame").click(function () {
    $("#playButton").show();
    $("#gameField").hide();
    $("#newGameBox").hide();
    $("#nextRoundBox").hide();
    document.getElementById("userMoveText").innerHTML = "";
    document.getElementById("compMoveText").innerHTML = "";
    $("#score").hide();
});
