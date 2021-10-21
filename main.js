/***************************DICE CODE START*****************************/
function showDice(f) {
  if (f == 1) {
    val = Math.floor(Math.random() * 6) + 1;
    diceFaceImages(val);
  } else {
    var a = setInterval(function () {
      val = Math.floor(Math.random() * 6) + 1;
      diceFaceImages(val, true);
    }, 10);

    setTimeout(function () {
      clearInterval(a);
      val = Math.floor(Math.random() * 6) + 1;
      diceFaceImages(val, false);
    }, 1000);
  }
}

function diceFaceImages(val, blur) {
  var dice = document.getElementById("dice");
  var waitTest = document.getElementById("waitTest");

  if (blur) {
    dice.style.filter = "blur(6px)";
    dice.style.pointerEvents = "none";

    waitTest.style.display = "block";
  } else {
    dice.style.filter = "none";
    dice.style.pointerEvents = "auto";

    waitTest.style.display = "none";

    var activatePlayerEle = $(".main .player-info-blk")[0];
    var activPlayer = activatePlayerEle.getAttribute("activeplayer");

    activatePlayer(activPlayer);
  }

  if (val == 1) {
    dice.style.backgroundPosition = "-34px -31px";
  }
  if (val == 2) {
    dice.style.backgroundPosition = "-232px -32px";
  }
  if (val == 3) {
    dice.style.backgroundPosition = "-433px -32px";
  }
  if (val == 4) {
    dice.style.backgroundPosition = "-34px -229px";
  }
  if (val == 5) {
    dice.style.backgroundPosition = "-232px -229px";
  }
  if (val == 6) {
    dice.style.backgroundPosition = "-433px -229px";
  }

  $("#faceDice")[0].innerHTML = val;
  this.diceValue = val;
}

/***************************DICE CODE END*****************************/

function startGame() {
  var table = $(".table")[0];
  var body = "";

  for (var i = 0; i < 5; i++) {
    var td = "";
    for (var j = 0; j < 5; j++) {
      if (
        (i == 0 && j == 2) ||
        (i == 4 && j == 2) ||
        (i == 2 && (j == 0 || j == 2 || j == 4))
      ) {
        td += "<td class='home-cell cell-" + (i + "" + j) + "'></td>";
      } else {
        td += "<td class='cell-" + (i + "" + j) + "'></td>";
      }
    }
    body += "<tr>" + td + "</tr>";
  }

  table.innerHTML = body;
  player();
}

function player() {
  var players = prompt(
    "Enter players: \n 1) One Player game \n 2) Two Player game (available) \n 3) Three Player game \n 4) Four Player game",
    2
  );

  if (players != 1) {
    var board = $("#board")[0];
    board.style.display = "block";
    start(players);
  } else {
    alert("Please enter valid option.");
  }
}

function start(players) {
  this.roles = ["red", "blue", "green", "black"];
  this.allRouts = getPlayerPaths(players);

  for (var i = 1; i <= players; i++) {
    this.path = this.allRouts[i - 1];
    var span = "";

    for (var s = 0; s < 4; s++) {
      span +=
        '<i class="fa fa-map-marker p-span" gitsPos="' +
        this.allRouts[i - 1][0] +
        '" onclick="gitSelected(this)" player-id="' +
        i +
        '" style="color:' +
        this.roles[i - 1] +
        '"></i>';
    }
    var td = $(".cell-" + this.allRouts[i - 1])[0];
    td.innerHTML = span;
  }
}

function gitSelected(span) {
  console.log(span, this.diceValue);

  var pos = span.getAttribute("gitsPos");
  var player = span.getAttribute("player-id");

  var rout = this.allRouts[player - 1];

  var diceVal = this.diceValue ? this.diceValue : 0;
  diceVal = diceVal + rout.indexOf(pos);

  var cell = rout[diceVal];

  if (diceVal > rout.length - 1) {
    validateGits(span);
  } else {
    moveGit(span, pos, rout, cell);
  }
}

function validateGits(git) {
  var player = git.getAttribute("player-id");
  var rout = this.allRouts[player - 1];
  var activeGits = $("[player-id=" + player + "]");
  var c = 0;

  for (var i = 0; i < activeGits.length; i++) {
    var pos = activeGits[i].getAttribute("gitsPos");
    var diceVal = this.diceValue ? this.diceValue : 0;
    diceVal = diceVal + rout.indexOf(pos);

    if (diceVal > rout.length - 1) {
      c++;
      activeGits[i].style.pointerEvents = "none";
    }
  }

  if (c == 4) {
    activatePlayer(0);
  }

  alert("Not Allowed");
}

function activatePlayer(p) {
  console.log(p);
  var arr = $(".p-span");
  var changeMsgFlg = 1;
  var playerCount = this.allRouts.length;

  if (this.diceValue == 6 || this.playerOut || this.pathComplete) {
    changeMsgFlg = 0;
    this.playerOut = false;
    this.pathComplete = false;
  }

  for (var i = 0; i < arr.length; i++) {
    var ele = arr[i];
    var player = ele.getAttribute("player-id");
    if (p == 0 && changeMsgFlg == 1) {
      ele.style.pointerEvents = "none";

      var activatePlayerEle = $(".main .player-info-blk")[0];
      var activPlayer = parseInt(
        activatePlayerEle.getAttribute("activeplayer")
      );

      if (activPlayer + 1 > playerCount) {
        activatePlayerEle.innerHTML =
          "Player 1, its your turn.  <i class='fa fa-map-marker' style='color:" +
          this.roles[0] +
          ";'></i>";
        activatePlayerEle.setAttribute("activeplayer", 1);
      } else {
        activatePlayerEle.innerHTML =
          "Player " +
          (activPlayer + 1) +
          ", its your turn. <i class='fa fa-map-marker' style='color:" +
          this.roles[activPlayer] +
          ";'></i>";
        activatePlayerEle.setAttribute("activeplayer", activPlayer + 1);
      }
      changeMsgFlg = 0;
    } else if (player != p) {
      ele.style.pointerEvents = "none";
    } else {
      ele.style.pointerEvents = "auto";
    }
  }

  if (p) {
    restrictChance(0);
  } else {
    restrictChance(1);
  }
}

function restrictChance(flag) {
  var dice = $("#dice")[0];
  if (flag) {
    dice.style.pointerEvents = "auto";
  } else {
    dice.style.pointerEvents = "none";
  }
}

function checkPlayerOut(span) {
  var currentPlayer = span.getAttribute("player-id");
  var currentPlayerGitPos = span.getAttribute("gitspos");
  var arr = $(".p-span");

  for (var i = 0; i < arr.length; i++) {
    var ele = arr[i];
    var player = ele.getAttribute("player-id");
    var gitPos = ele.getAttribute("gitspos");

    if (
      currentPlayerGitPos != "02" &&
      currentPlayerGitPos != "20" &&
      currentPlayerGitPos != "42" &&
      currentPlayerGitPos != "24" &&
      currentPlayerGitPos != "22"
    ) {
      if (player != currentPlayer && currentPlayerGitPos == gitPos) {
        this.playerOut = true;
        var rout = this.allRouts[player - 1];

        $(".cell-" + rout[0]).append(ele);
        ele.setAttribute("gitsPos", rout[0]);
      }
    }

    if (currentPlayerGitPos == "22") {
      this.pathComplete = true;
    }
  }

  if (this.pathComplete) {
    alert("Congratulations.!!");
  }
}

function getPlayerPaths(players) {
  var rout_1 = [
    "42",
    "43",
    "44",
    "34",
    "24",
    "14",
    "04",
    "03",
    "02",
    "01",
    "00",
    "10",
    "20",
    "30",
    "40",
    "41",
    "31",
    "21",
    "11",
    "12",
    "13",
    "23",
    "33",
    "32",
    "22",
  ];
  var rout_2 = [
    "24",
    "14",
    "04",
    "03",
    "02",
    "01",
    "00",
    "10",
    "20",
    "30",
    "40",
    "41",
    "42",
    "43",
    "44",
    "34",
    "33",
    "32",
    "31",
    "21",
    "11",
    "12",
    "13",
    "23",
    "22",
  ];
  var rout_3 = [
    "02",
    "01",
    "00",
    "10",
    "20",
    "30",
    "40",
    "41",
    "42",
    "43",
    "44",
    "34",
    "24",
    "14",
    "04",
    "03",
    "13",
    "23",
    "33",
    "32",
    "31",
    "21",
    "11",
    "12",
    "22",
  ];
  var rout_4 = [
    "20",
    "30",
    "40",
    "41",
    "42",
    "43",
    "44",
    "34",
    "24",
    "14",
    "04",
    "03",
    "02",
    "01",
    "00",
    "10",
    "11",
    "12",
    "13",
    "23",
    "33",
    "32",
    "31",
    "21",
    "22",
  ];
  var arr = [];
  if (players == 2) {
    arr = [rout_1, rout_3];
  } else if (players == 3) {
    arr = [rout_1, rout_2, rout_3];
  } else if (players == 4) {
    arr = [rout_1, rout_2, rout_3, rout_4];
  }
  return arr;
}

function moveGit(span, currentPos, rout, cell) {
  $(".cell-" + currentPos).append(span);
  span.setAttribute("gitsPos", cell);
  if (currentPos == cell) {
    checkPlayerOut(span);
    activatePlayer(0);
  } else {
    animate(span, currentPos, rout, cell);
  }
}

function animate(span, currentPos, rout, cell) {
  var t = rout.indexOf(currentPos);

  setTimeout(function () {
    moveGit(span, rout[t + 1], rout, cell);
  }, 250);
}
