// ============================================================================
// METEOR SHOWER (2017)
// A simple javascript game

// ----------------------------------------------------------------------------
// Get game elements
var windowSize = $(window).width();
var gameSize = 40;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    console.log("mobile");
}
var highscore = localStorage.getItem("highscore");
$("#hs").text("Your highscore is: " + highscore);

console.log(gameSize);

// ----------------------------------------------------------------------------
//Variables
var size; //Size of game
var currentSize; //Size of player
var xdir; //--> / <--
var ydir; // /\ / \/
var interval; 
var count;
var totalcount = 0;
var safeMove;
var safeDirection = 0;
var level = 1;
var score = 0;
var roundTime = 1000;
var paused = false;

initGame(gameSize);
initLevel(1);

// ----------------------------------------------------------------------------
// Initialise Game
function initGame(sizeToCreate) {
    //Initialise variables
    size = sizeToCreate; //Size of game
    currentSize = size; //Size of player
    xdir = 0; //Not moving
    ydir = 0; //Not moving

    //Build game board
    $("#header").css("width",size*10);
    $("#score-container").css("width",size*5);
    $("#score-container").css("left",size*5);
    $("#level-container").css("width",size*4);
    $("#box").css("width", size);
    $("#box").css("height", size);
    $("#progress-container").width(size*10);
    $("#wrapper").css("width", size*10);
    $("#wrapper").css("height", size*10);
    $("#buttons").width(size*10);
    $("#buttons").height(size*10);
}

// ----------------------------------------------------------------------------
// Initialise Level
function initLevel(level){
    $("#level").text("Level: "+ level);
    if(level > 4){
        gameOver();
    }
    interval = 30; 
    count = 0;
    totalcount = 0;

    //Clear obstacles
    var obstacles = $(".obstacle");
    for(i = 0 ; i < obstacles.length; i++){
        var obstacle = obstacles[i];
        $(obstacle).remove();
    }

    //Build safe zone and place player
    switch(level){
        case 1:
            $("#safe").css("width", size*10);
            $("#safe").css("height", size*3);
            $("#safe").css("top", size*7);
            $("#safe").css("left", 0);
            $("#box").css("top",  size * 8);
            $("#box").css("left", size * 5);
            safeMove = false;
            break;
        case 2:
            $("#safe").css("width", size*4);
            $("#safe").css("height", size*4);
            $("#safe").css("top", size*6);
            $("#safe").css("left", size*3);
            $("#box").css("top",  size * 8);
            $("#box").css("left", size * 5);
            safeMove = true;
            break;
        case 3:
            $("#safe").css("width", size*4);
            $("#safe").css("height", size*4);
            $("#safe").css("top", size*3);
            $("#safe").css("left", size*3);
            $("#box").css("top",  size * 5);
            $("#box").css("left", size * 5);
            safeMove = false;
            break;
        case 4:
            $("#safe").css("width", size*4);
            $("#safe").css("height", size*4);
            $("#safe").css("top", size*3);
            $("#safe").css("left", size*3);
            $("#box").css("top",  size * 5);
            $("#box").css("left", size * 5);
            safeMove = true;
            break;
    }
}

// ----------------------------------------------------------------------------
// Game loop
setInterval(function(){
        if(!paused){
        //Update level progress bar
        var progress = (totalcount/roundTime)* size * 10;
        $("#progress").width(progress);

        count++;
        totalcount++;

        //Advance a level if progress complete
        if(totalcount > roundTime){
        level ++;
        initLevel(level);
        }

        //Create new obstacle every interval
        if(count > interval){
        count = 0;
        newObstacle();
        if(interval > 2){
        interval -= 1;
        }
        }

        //Move safe zone left and right
        if(safeMove){
            var safePos = $("#safe").position();
            var safeLeft = safePos.left;
            var safeWidth = $("#safe").width();
            switch(safeDirection){
                case 0: 
                    $("#safe").css("left", safeLeft - 1);
                    if(safeLeft <= 0)
                        safeDirection = 1;
                    break;
                case 1:
                    $("#safe").css("left", safeLeft + 1);
                    if(safeLeft + safeWidth >= size * 10)
                        safeDirection = 0;
                    break;
            }
        }

        //Work out new player coords
        var moveAmount = size/5;
        var pos = $("#box").position();
        var left = pos.left;
        var top = pos.top;
        switch(xdir){
            case 1:
                if(left < size*10 - currentSize)
                    left+=moveAmount;
                break;
            case 2:
                if(left > 0)
                    left -=moveAmount;
                break;
        }
        switch(ydir){
            case 1:
                if(top > 0)
                    top-=moveAmount;
                break;
            case 2:
                if(top < size*10 - currentSize)
                    top+=moveAmount;
                break;
        }

        //Move black obstacles
        var downObstacles = $(".downObstacle");
        for(i = 0 ; i < downObstacles.length; i++){
            var obstacle = downObstacles[i];
            var pos2 = $(obstacle).position();
            var top2 = pos2.top;
            $(obstacle).css("top", top2+moveAmount);
            if(top2 >= size*10 - (size/2)){
                $(obstacle).remove();
                score++;
                $("#score").text("Score: " + score);
            }
        }

        //Move white obstacles
        var leftObstacles = $(".leftObstacle");
        for(i = 0 ; i < leftObstacles.length; i++){
            var obstacle = leftObstacles[i];
            var pos2 = $(obstacle).position();
            var left2 = pos2.left;
            $(obstacle).css("left", left2+moveAmount);
            if(left2 >= size*10 - (size/2)){
                $(obstacle).remove();
                score++;
                $("#score").text("Score: " + score);
            }
        }

        //Chack if player hit obstacle or red zone
        var obstacles = $(".obstacle");
        for(i = 0 ; i < obstacles.length; i++){
            var obstacle = obstacles[i];
            var pos2 = $(obstacle).position();
            var top2 = pos2.top;
            var left2 = pos2.left;
            var posSafe = $("#safe").position();
            var topSafe = posSafe.top;
            var leftSafe = posSafe.left;
            var widthSafe = $("#safe").width();
            var heightSafe = $("#safe").height();
            if((left2 > (left-(size/2)) && left2 < (left+currentSize) && top2 > (top - (size/2)) && top2 < (top + currentSize)) 
                    || !(top >= topSafe && top <= topSafe+heightSafe-currentSize && left >= leftSafe && left <= leftSafe + widthSafe - currentSize)){
                if($(obstacle).hasClass("healthObstacle")){
                    grow();
                }else{
                    shrink();
                }
            }
        }

        //Move player
        $("#box").css("left", left);
        $("#box").css("top", top);
        }
}, 50);

// ----------------------------------------------------------------------------
// Keydown handler
window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    //Change player direction
    if (key == 39) {
        xdir = 1; //Right
    }else if (key == 37) {
        xdir = 2; //Left
    }else if(key == 38){
        ydir = 1; //Up
    }else if(key == 40){
        ydir = 2; //Down
    }else if(key == 80){

        //Toggle pause
        paused = !paused;
        if(paused){
            var pause = document.createElement("div");
            $(pause).addClass("pause");
            $(pause).css("left", size*5 - 30);
            $(pause).css("top", size*5 - 30);
            var cont = document.getElementById("wrapper");
            var top = document.getElementById("top");
            cont.insertBefore(pause,top);
        } else {
            $(".pause")[0].remove();
        }
    }
}

// ----------------------------------------------------------------------------
// Keyup Handler
window.onkeyup = function(e){
    //Turn off player direction
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 39 || key == 37){
        xdir = 0;
    }
    if(key == 38 || key == 40){
        ydir = 0;
    }
}

// ----------------------------------------------------------------------------
// Create a new obstacle
function newObstacle(){
    //Create new obstacle at random position
    var x = Math.floor(Math.random() * ((size * 10)-size/2));
    var obstacle = document.createElement("div");
    $(obstacle).addClass("obstacle");
    switch(level){
        case 1: //Level 1 and 2, only black obstacles
        case 2: $(obstacle).addClass("downObstacle");
                $(obstacle).css("left", x);
                break;
        case 3: //Level 3 and 4, black and white obstacles
        case 4: var y = Math.floor(Math.random() * 2);
                if(y == 0){
                    $(obstacle).addClass("downObstacle");
                    $(obstacle).css("left", x);
                } else {
                    $(obstacle).addClass("leftObstacle");
                    $(obstacle).css("top", x);
                }
                break;
    }
    $(obstacle).css("width", size/2);
    $(obstacle).css("height", size/2);

    //1/20 obstacles is red obstacle
    var z = Math.floor(Math.random() * 20);
    if(z == 1){
        $(obstacle).addClass("healthObstacle");
    }

    //Insert obstacle into game
    var cont = document.getElementById("wrapper");
    var top = document.getElementById("top");
    cont.insertBefore(obstacle,top);

}

// ----------------------------------------------------------------------------
// Shrink player
function shrink(){
    currentSize--;
    $("#box").css("width", currentSize);
    $("#box").css("height", currentSize);
    if(currentSize <= 1){
        gameOver();
    }
}

// ----------------------------------------------------------------------------
// Grow player
function grow(){
    currentSize++;
    $("#box").css("width", currentSize);
    $("#box").css("height", currentSize);
    if(currentSize <= 1){
        gameOver();
    }
}

// ----------------------------------------------------------------------------
// Game Over
function gameOver() {
    totalcount = 0;
    //Remove all obstacles
    var obstacles = $(".obstacle");
    for(i = 0 ; i < obstacles.length; i++){
        var obstacle = obstacles[i];
        $(obstacle).remove();
    }
    var highscore = localStorage.getItem("highscore");

    if(highscore !== null){
        if (score > highscore) {
            localStorage.setItem("highscore", score);      
        }
    }
    else{
        localStorage.setItem("highscore", score);
    }
    //Display game score and restart
    //alert("Game Over! Score: " + score);
    initGame(gameSize);
}

