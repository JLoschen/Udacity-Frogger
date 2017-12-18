var tileHeight = 81;
var tileWidth = 101;
var upMovement = -1 * tileHeight;
var leftMovement = -1 * tileWidth;
var score = 0;
var lives = 5;
var laneSpeed = [100, 150, 200];
var speedSlider;
var spriteDictionary = {
    boy:"images/char-boy.png",
    catGirl:"images/char-cat-girl.png",
    "hornGirl":"images/char-horn-girl.png",
    "pinkGirl":"images/char-pink-girl.png",
    "princess":"images/char-princess-girl.png",
};

// Enemies our player must avoid
class Enemy{
    constructor(lane){
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started
        //this.speed = Math.random() * 200 + 50;
        this.speedBase = laneSpeed[lane-1];
        this.speed = this.speedBase;

        this.x = 0;
        
        //const lane = Math.floor(Math.random() * 3) + 1;
        this.y = lane * tileHeight - 20;
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
    }
    
    update(dt){
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += (this.speed * dt);
        if(this.x > 500){
            this.x = -10;
        }
    }
    
    updateSpeed(speedModifier){
        this.speed = this.speedBase + speedModifier;
    }
    
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Player {
    constructor(characterType){
        this.x = 200;
        this.y = 390;
        this.Ymovement = 0;
        this.Xmovement = 0;
        this.inWater = false;
        this.isHit = false;
        this.halfWidth = 20;
        this.halfHeight = 20;
        this.sprite = spriteDictionary[characterType];
    }
    
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        if(this.inWater)
            ctx.drawImage(Resources.get('images/water-splash2.png'), this.x, this.y - 15);
        
        if(this.isHit)
            ctx.drawImage(Resources.get('images/blood-splash2.png'), this.x, this.y - 15);
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
                incrementScore();
                this.inWater = true;
                
                //using arrow function to lexically bind 'this'
                //https://stackoverflow.com/questions/2130241/pass-correct-this-context-to-settimeout-callback
                setTimeout(() => {
                    this.reset();
                } , 500);
            }
        }
        
        //check for collisions
        for(const enemy of allEnemies){
            const differenceX = Math.abs(this.x - enemy.x);
            const differenceY = Math.abs(this.y - enemy.y);
            if(differenceX < 70 && differenceY < 20 && !this.isHit){
                
                lives--;
                $('#lives').html(lives);
                this.isHit = true;
                
                if(lives === 0){
                     swal({
                        title: 'Game Over',
                        text: 'Better Luck Next Time',
                        type: 'error',
                        confirmButtonText: 'Next Game'
                    },function(){
                        setupNewGame();    
                    });    
                }else{
                    setTimeout(() =>{
                    //player.reset();        
                        this.reset();
                    },500);
                }
            }
        }
        
        //check for gem collision
        const diffX = Math.abs(this.x - gem.x);
        const diffY = Math.abs(this.y - gem.y);
        if(diffX < 70 && diffY < 20){
            incrementScore();
            gem = new Gem();
        }
        
        //render heart
        const heartDiffX = Math.abs(this.x - heart.x);
        const heartDiffY = Math.abs(this.y - heart.y);
        if(heartDiffX < 70 && heartDiffY < 20 && heart.visible){
            //gem = new Gem();
            heart.selected();
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
        this.isHit = false;
    }
}

function incrementScore(){
    score++;
    $('#score').html(score);
    if(score === 10){
        swal({
			title: 'You win!',
			text: 'You got 10!',
			type: 'success',
			confirmButtonText: 'Next Game'
		},function(){
            setupNewGame();    
        });    
    }    
}

function setupNewGame(){
    score = 0;
    $('#score').html(score);
    lives = 5;
    $('#lives').html(lives);
    player.reset();
    allEnemies = [/*new Enemy(), new Enemy(),*/ new Enemy(1), new Enemy(2), new Enemy(3)];
}

const gemSprites = [ 'images/Gem Blue.png', 
                     'images/Gem Green.png',
                     'images/Gem Orange.png'] ;

class Gem{
    constructor(){
        const column = Math.floor(Math.random() * 5);
        this.x = column * tileWidth;
        
        const row = Math.floor(Math.random() * 3) + 1;
        this.y = row * tileHeight - 25;
        
        this.sprite = gemSprites[0];
    }
    
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Heart{
    constructor(){
        const column = Math.floor(Math.random() * 5);
        this.x = column * tileWidth;
        
        const row = Math.floor(Math.random() * 3) + 1;
        this.y = row * tileHeight - 9;
        
        //this.sprite = 'images/Heart.png';
        this.sprite = 'images/Star.png';
        this.visible = true;
    }
    
    selected(){
        this.sprite = 'images/Selector.png';
        this.visible = false;
        this.y -= 28;
        
        speedSlider.val(-50);
        updateSpeedModifier(-50);
        
        setTimeout(() => {
            speedSlider.val(50);
            updateSpeedModifier(50);    
        },3000);
        
        setTimeout(() => {
                    heart = new Heart();
                } , 400);
    }
    
    render(){
        //if(this.visible)
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

function updateSpeedModifier(modifier){
    for(const enemy of allEnemies){
        enemy.updateSpeed(modifier);
    }
}

$(document).ready(function(){
    $('#character-select').change(function(){
        player.sprite =  spriteDictionary[$(this).val()];
        
        //unselect combobox so arrow keys don't changed selection
        $(this).blur();
    });
    
    speedSlider = $('#speed-slider');
    speedSlider.on('input',function(){
        console.log('speed input changed');
       let speedModifier = parseInt($(this).val());
        
        updateSpeedModifier(speedModifier);
    });
});

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [/*new Enemy(), new Enemy(),*/ new Enemy(1), new Enemy(2), new Enemy(3)];

var player = new Player('boy');

var gem = new Gem();

var heart = new Heart();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    speedSlider.blur();
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };    

    player.handleInput(allowedKeys[e.keyCode]);
});
