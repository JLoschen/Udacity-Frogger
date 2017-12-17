var tileHeight = 81;
var tileWidth = 101;
var upMovement = -1 * tileHeight;
var leftMovement = -1 * tileWidth;
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
class Enemy{
    constructor(lane){
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started
        //this.speed = Math.random() * 200 + 50;
        this.speed = laneSpeed[lane - 1];

        this.x = 0;
        
        //const lane = Math.floor(Math.random() * 3) + 1;
        this.y = lane * tileHeight - 20;
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
//        this.sprite = 'images/dot.PNG';
    }
    
    update(dt){
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += (this.speed * dt);
        if(this.x > 500){
            this.x = - 10;
        }
    }
    
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.draw
    }
    
    isInHitBox(player){
        if(Math.abs(player.x - this.x) < 70 && Math.abs(player.y - this.y) < 20){
            player.reset();
        }
    }
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(characterType){
        this.x = 200;
        this.y = 390;
        this.Ymovement = 0;
        this.Xmovement = 0;
        this.inWater = false;
        this.halfWidth = 20;
        this.halfHeight = 20;
        this.sprite = spriteDictionary[characterType];
    }
    
    render(){
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
                
                //using arrow function to lexically bind 'this'
                //https://stackoverflow.com/questions/2130241/pass-correct-this-context-to-settimeout-callback
                setTimeout(() => {
                    this.reset();
                } , 600);
            }
        }
        
        //check for collisions
        for(const enemy of allEnemies){
            var differenceX = Math.abs(this.x - enemy.x);
            var differenceY = Math.abs(this.y - enemy.y);
            if(differenceX < 70 && differenceY < 20){
                player.reset();
            }
        }
    }
    
    handleInput(direction){
        switch(direction){
            case 'left':
                if(this.x > 0) 
                    this.Xmovement = leftMovement;    
                break;
            case 'up':
                if(this.y > 0)
                    this.Ymovement = upMovement;
                break;
            case 'right':
                if(this.x < 400) 
                    this.Xmovement = tileWidth;
                break;
            case 'down':
                if(this.y < 350)
                    this.Ymovement = tileHeight;
                break;
        }
    }
    
    reset(){
        this.x = 200;
        this.y = 390;
        this.inWater = false;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [/*new Enemy(), new Enemy(),*/ new Enemy(1), new Enemy(2), new Enemy(3)];

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
