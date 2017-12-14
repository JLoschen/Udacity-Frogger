var tileHeight = 80;
var tileWidth = 101;
var upMovement = -80;
var leftMovement = -101;
var score = 0;
var laneSpeed = [100, 150, 200];
var spriteDictionary = {
    boy:"images/char-boy.png",
    catGirl:"images/char-cat-girl.png",
    hornGirl:"images/char-horn-girl.png",
    pinkGirl:"images/char-pink-girl.png",
    princess:"images/char-princess-girl.png",
};
// Enemies our player must avoid
var Enemy = function(lane) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    //this.speed = Math.random() * 200 + 50;
    this.speed = laneSpeed[lane - 1];
    
    this.x = 0;
    //const lane = Math.floor(Math.random() * 3) + 1;
    //console.log('creating enemit' + lane);
    this.y = lane * tileHeight - 20;
    //console.log('creating enemit' + lane + ' ' + this.y);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //console.log('app enemy constructor');
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
    if(this.x > 500){
        this.x = - 10;
//        const lane = Math.floor(Math.random() * 3) + 1;
//        this.y = lane * tileHeight - 20;
    }
    
    //console.log('app update');
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    //this.x = 3 * tileSize;
    //this.y = 1 * tileSize;
    
    //river at -20
    //top    lane at 60y
    //middle lane at 140 y;
    //bottom lane at 220 y;
    
    //column 0:0
    //column 1:
    //column 2:
    //column 3:
    //column 4:
    
    //this.x = 404;
    //this.y = 380;
    //console.log('render enemy at '+ this.x + ' ' + this.y);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(characterType){
        //console.log('player ctor');
        this.x = 200;
        this.y = 390;
        this.Ymovement = 0;
        this.Xmovement = 0;
        this.inWater = false;
        
        this.sprite = spriteDictionary[characterType];
        //console.log(this.sprite);
    }
    
    render(){
        //console.log('x:' + this.x + ' y:' + this.y);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    
    update(){
        if(this.Xmovement !== 0){
            this.x += this.Xmovement;
            this.Xmovement = 0;
        }
        
        if(this.Ymovement !== 0){
            this.y += this.Ymovement;
            this.Ymovement = 0;
            
            //if they won
            if(this.y < 50 && !this.inWater){
                score++;
                var numKeys = document.getElementById("score");
                numKeys.innerHTML = score;
                
                this.inWater = true;
                setTimeout(function(){
                    movePlayerBack(this);}
                           , 2000);
            }
        }
    }
    
    handleInput(direction){
        switch(direction){
            case 'left':
                this.Xmovement = leftMovement;
                break;
            case 'up':
                this.Ymovement = upMovement;
                break;
            case 'right':
                this.Xmovement = tileWidth;
                break;
            case 'down':
                this.Ymovement = tileHeight;
                break;
        }
    }
}

function movePlayerBack(player){
    console.log('resetting');
    player.x = 200;
    player.y = 390;
    player.inWater = false;
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [/*new Enemy(), new Enemy()*/, new Enemy(1), new Enemy(2), new Enemy(3)];

var player = new Player('boy');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
