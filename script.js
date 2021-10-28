// console.log("IT WORKS WOOO")
//Our canvas variable
const game = document.getElementById("canvas");

//movement tracker
const moveDisplay = document.getElementById("movement")

const startButton = document.getElementById("startButton")

const restartButton = document.getElementById("restartButton")
restartButton.disabled = true

//drop options for objects
const dropOptions = [0, 185, 370, 555, 740]

//speed options for objects
const speedOptions = [7, 9, 10, 13, 17]

//interval variable so the game can clear it on restart
let intervalHandle;

const pointsToWin = 10;

//Points on bottom left
const pointsView = document.querySelector("#btm-left > h2")

//bottom right message 
const gameEndingMessage = document.querySelector("#btm-right > h2")

//array of stars that the player has touched
let interactions = [];

//canvas sizing
canvas.width = 400;
canvas.height = 600;

//set up height & width variables
game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

//get the games context so we can add to it, draw on it, create animations etc
const ctx = game.getContext("2d")


function Meteor(x, y, color, width, height) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.alive = true
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

function Player(x, y, color, width, height) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.alive = true
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

function Star(x, y, color, width, height) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.dropRate = speedOptions[Math.floor(Math.random() * speedOptions.length)]
    this.collected = false
    this.alive = true
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let player = new Player(370, 540, "#6FC9E7", 60, 60)
let meteorOne = new Meteor(0, -50, "pink", 60, 40)
let meteorTwo = new Meteor(185, -60, "pink", 60, 40)
let meteorThree = new Meteor(370, -60, "pink", 60, 40)
let meteorFour = new Meteor(555, -50, "pink", 60, 40)
let meteorFive = new Meteor(740, -60, "pink", 60, 40)
// console.log("this is the player", player)
// console.log("this is  the meteor", meteorOne)

//array of meteors
let meteors = [meteorOne, meteorTwo, meteorThree, meteorFour, meteorFive]

//array of stars and number game can render at once
let stars = [];
for (let i = 0; i < 10; i++) {
    stars.push(new Star(
        dropOptions[Math.floor(Math.random() * dropOptions.length)],
        -60, "yellow", 20, 30
    ));
}

//Connecting stars to points innerText(bottom left)
function incrementPoints(currentStar) {

    if (interactions.includes(currentStar)) {
        return;
    } else {
        interactions.push(currentStar);
        //score goes up by 1 every time star is collected
        score++ 
        pointsView.innerText = `Points: ${score}` 
        if (score === pointsToWin) {
            //game ending condition
            gameEndingMessage.innerText = "YOU WIN!!!"
            player.alive = false
        } 
    }

}

//restricting where player can move
let movementHandler = (e) => {
    switch (e.key.toLowerCase()) {
        case "a":
            //move left
            player.x -= 185
            if (player.x <= 0) {
                player.x = 0
            }
            break
        case "d":
            //move right
            player.x += 185
            if (player.x + player.width >= game.width) {
                player.x = game.width - player.width
            }
            break

    }


}

//how many spaces on the y axis the meteors can go
let meteorMovement = () => {
    meteorOne.y += 9;
    meteorTwo.y += 13;
    meteorThree.y += 15;
    meteorFour.y += 8;
    meteorFive.y += 12;
}

//how many spaces on the y axis stars can go
let starMovement = () => {
    stars.forEach(s => s.y += s.dropRate)
}

//Code for meteors to loop after going off screen
let meteorLoop = () => {
    if (meteorOne.y >= 600) {
        return meteorOne.y = -45;
    }
    if (meteorTwo.y >= 600) {
        return meteorTwo.y = -60;
    }
    if (meteorThree.y >= 600) {
        return meteorThree.y = -45;
    }
    if (meteorFour.y >= 600) {
        return meteorFour.y = -60;
    }
    if (meteorFive.y >= 600) {
        return meteorFive.y = -60;
    }
}

//code for stars to loop after going off screen
const starLoop = () => {
    for (let i = 0; i < stars.length; i++) {
        if (stars[i].y >= 600 || stars[i].collected === true) {
            stars[i] = new Star(dropOptions[Math.floor(Math.random() * dropOptions.length)], -60, 'yellow', 20, 30)
        }
    }
}


// make collision detection
//if any part of player square touches any part of meteor
const detectMeteorHit = () => {
    //if the player's x + width or y + height hits the meteors x+width or y+height, kill player
    for (i = 0; i < meteors.length; i++)
        if (
            player.x < meteors[i].x + meteors[i].width &&
            player.x + player.width > meteors[i].x &&
            player.y < meteors[i].y + meteors[i].height &&
            player.y + player.height > meteors[i].y
        ) {
            //kill player
            player.alive = false
            //end the game
            gameEndingMessage.innerText = "Game over!"
        }
}

//score starts at 0
let score = 0;

//detection if player touches any part of the stars
const detectStarHit = () => {
    for (i = 0; i < stars.length; i++)
        if (
            player.x < stars[i].x + stars[i].width &&
            player.x + player.width > stars[i].x &&
            player.y < stars[i].y + stars[i].height &&
            player.y + player.height > stars[i].y
        ) {
            stars[i].alive = false
            stars[i].collected = true
            incrementPoints(stars[i])
        }
}


// we are going to set up our game loop to be used in our timing function
//set up gameLoop func, declaring what happens when our game is running


const gameLoop = () => {
    //clear the canvas
    ctx.clearRect(0, 0, game.width, game.height)
    //display relevant game state(player movement) in our movement display
    moveDisplay.innerText = `X: ${player.x}\nY: ${player.y}`
    //check if the player is alive, if so render the meteors and stars
    if (player.alive) {

        detectMeteorHit()
        detectStarHit()
        player.render()
        meteorOne.render()
        meteorTwo.render()
        meteorThree.render()
        meteorFour.render()
        meteorFive.render()
        //only render stars that have NOT been collected
        stars.filter(s => !s.collected).forEach(s => s.render())

    }


    //Our function that loops the meteors after going off screen
    meteorLoop();

    //render our player if the player is alive
    // if (player.alive) {
    //     player.render();
    // }

    if (player.alive === false) {
        moveDisplay.innerText = ""
    }

    //down movement function on the y axis of the meteors
    meteorMovement();

    //down movement function on the y axis of the stars
    starMovement();

    //function that loops the stars after they go off screen
    starLoop();

}

//event listener for player movement
document.addEventListener("keydown", movementHandler)

//timing func will determine how and when game animates
const gameStart = () => {
    startButton.disabled = true
    restartButton.disabled = false
    initializeGame()
    clearInterval(intervalHandle)
    intervalHandle = setInterval(gameLoop, 50)
}

//Restart game button function
const gameRestart = () => {
    initializeGame()
    clearInterval(intervalHandle)
    intervalHandle = setInterval(gameLoop, 50)

}

// initial game setup when start or restart is clicked
const initializeGame = () => {
    stars = [];
    for (let i = 0; i < 10; i++) {
        stars.push(new Star(
            dropOptions[Math.floor(Math.random() * dropOptions.length)],
            -60, "yellow", 20, 30
        ));

    }
    interactions = [];
    player = new Player(370, 540, "#6FC9E7", 60, 60)
    meteorOne = new Meteor(0, -50, "pink", 60, 40)
    meteorTwo = new Meteor(185, -60, "pink", 60, 40)
    meteorThree = new Meteor(370, -60, "pink", 60, 40)
    meteorFour = new Meteor(555, -50, "pink", 60, 40)
    meteorFive = new Meteor(740, -60, "pink", 60, 40)
    meteors = [meteorOne, meteorTwo, meteorThree, meteorFour, meteorFive]
    score = 0;
    moveDisplay.innerText = ""
    gameEndingMessage.innerText = "Collect 50 stars to win!"
    pointsView.innerText = "Points: 0"
}