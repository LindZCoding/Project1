// console.log("IT WORKS WOOO")
//Our canvas variable
const game = document.getElementById("canvas");
//movement tracker
const moveDisplay = document.getElementById("movement")

//canvas sizing
canvas.width = 400;
canvas.height = 600;

//set up height & width variables
game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

//now we need to get the games context so we can add to it, draw on it, create animations etc
//we do this with the built in canvas method, getContext
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

let player = new Player(370, 540, "#6FC9E7", 60, 60)
let meteorOne = new Meteor(0, -60, "pink", 60, 60)
let meteorTwo = new Meteor(185, -60, "pink", 60, 60)
let meteorThree = new Meteor(370, -60, "pink", 60, 60)
let meteorFour = new Meteor(555, -60, "pink", 60, 60)
let meteorFive = new Meteor(740, -60, "pink", 60, 60)
console.log("this is the player", player)
console.log("this is  the meteor", meteorOne)

//array of meteors
let meteors = [meteorOne, meteorTwo, meteorThree, meteorFour, meteorFive]

//if we want to restrict our player from leaving the canvas, we can include that in our movehandler

let movementHandler = (e) => {
    switch(e.key.toLowerCase()) {
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

let meteorMovement = (e) => {
    meteorOne.y += 1;
    meteorTwo.y += 1;
    meteorThree.y += 1;
    meteorFour.y += 1;
    meteorFive.y += 1;
}

let duplicate = () => {
    if (meteorOne.y >= 600) {
        return meteorOne.y = -60;
    }
    if (meteorTwo.y >= 600) {
        return meteorTwo.y = -60;
    }
    if (meteorThree.y >= 600) {
        return meteorThree.y = -60;
    }
    if (meteorFour.y >= 600) {
        return meteorFour.y = -60;
    }
    if (meteorFive.y >= 600) {
        return meteorFive.y = -60;
    }
}


// make collision detection
//writing some logic that determines if any part of our player square touches any part of our meteor
const detectHit = () => {
    //if the player's x + width or y + height hits the meteors x+width or y+height, kill player
     for (i=0; i < meteors.length; i++)
    if (
        player.x < meteors[i].x + meteors[i].width && 
        player.x + player.width > meteors[i].x &&
        player.y < meteors[i].y + meteors[i].height &&
        player.y + player.height > meteors[i].y
    ) {
        //kill meteor
        player.alive = false
        //end the game
        document.querySelector("#btm-right > h2").innerText = "You lose!"
        //not quite where we want to stop the gameLoop
        // stopGameLoop()
    }
}

// we are going to set up our game loop to be used in our timing function
//set up gameLoop func, declaring what happens when our game is running
const gameLoop = () => {
        //clear the canvas
        ctx.clearRect(0, 0, game.width, game.height)
        //display relevant game state(player movement) in our movement display
        moveDisplay.innerText = `X: ${player.x}\nY: ${player.y}`
        //check if the meteor is alive, if so render the meteor
        if (player.alive) {
            meteorOne.render()
            meteorTwo.render()
            meteorThree.render()
            meteorFour.render()
            meteorFive.render()
            //add in our detection to see if the hit has been made 
            detectHit()
        } 

        duplicate();

        //render our player
        if (player.alive) {
        player.render();
        }

        //down movement function on the y axis of the meteors
        meteorMovement();

        setInterval(meteorMovement, 200);

}

// duplicate();
//we also need to declare a func that will stop our animation loop
let stopGameLoop = () => {clearInterval(gameInterval)}

//add event listener for player movement
document.addEventListener("keydown", movementHandler)
// the timing func will determine how and when our game animates
let gameInterval = setInterval(gameLoop, 70)