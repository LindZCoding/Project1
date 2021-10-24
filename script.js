// console.log("IT WORKS WOOO")
//Our canvas variable
const game = document.getElementById("canvas");
//movement tracker
const moveDisplay = document.getElementById("movement")

canvas.width = 400;
canvas.height = 600;

//set up height & width variables
game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

//now we need to get the games context so we can add to it, draw on it, create animations etc
//we do this with the built in canvas method, getContext
const ctx = game.getContext("2d")

function Crawler(x, y, color, width, height) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.alive = true
    //then we declare the same type of render method
    this.render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}      

let player = new Crawler(380, 540, "#6FC9E7", 60, 60)
let ogre = new Crawler(200, 50, "lightgreen", 32, 48)
console.log("this is the player", player)
console.log("this is  the ogre", ogre)

//HERE WE ARE GOING to set up our movement handler
//the movement handler will be an event listener
//we will use the WASD keys to move the player around the canvas
// we are going to use switch case here but you can also use if else
//first way we are handling input is going to be with keycodes
// const movementHandler = (e) => {
//     switch(e.keyCode) {
//         //first case 87 = w key
//         //this will move our player up
//         case (87): 
//             player.y -= 10
//             break
//         //keycode 65 = A key to the left
//         case (65):
//             player.x -= 10
//             break
//         //keycode 83 = S key moves player down
//         case (83):
//             player.y += 10
//             break
//         //keycode 68 = D key moves player right
//         case (68):
//             player.x += 10
//             break
//     }
// }

//the second way we can handle key events is with e.key
//if we want to restrict our player from leaving the canvas, we can include that in our movehandler

let movementHandler = (e) => {
    switch(e.key.toLowerCase()) {
        // case "w":
        //     //move up
        //     player.y -= 10
        //     if (player.y <= 0) {
        //         player.y = 0
        //     }
        //     break
        case "a":
            //move left
            player.x -= 95
            if (player.x <= 0) {
                player.x = 0
            }
            break
        // case "s":
        //     //move down
        //     player.y += 10
        //     if (player.y + player.height >= game.height) {
        //         player.y = game.height - player.height
        //     }
        //     break
        case "d":
            //move right
            player.x += 95
            if (player.x + player.width >= game.width) {
                player.x = game.width - player.width
            }
            break
        
    }
}

// make collision detection
//writing some logic that determines if any part of our player square touches any part of our ogre
const detectHit = () => {
    //if the player's x + width or y + height hits the ogre's x+width or y+height, kill shrek
    if (
        player.x < ogre.x + ogre.width && 
        player.x + player.width > ogre.x &&
        player.y < ogre.y + ogre.height &&
        player.y + player.height > ogre.y
    ) {
        //kill shrek
        ogre.alive = false
        //end the game
        document.querySelector("#btm-right > h2").innerText = "You win!"
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
        //check if the ogre is alive, if so render the ogre
        if (ogre.alive) {
            ogre.render()
            //add in our detection to see if the hit has been made 
            detectHit()
        } 
        //render our player
        player.render()
}
//we also need to declare a func that will stop our animation loop
let stopGameLoop = () => {clearInterval(gameInterval)}

//add event listener for player movement
document.addEventListener("keydown", movementHandler)
// the timing func will determine how and when our game animates
let gameInterval = setInterval(gameLoop, 70)