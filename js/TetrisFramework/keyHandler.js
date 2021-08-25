var keysPressed = {};
var softdropInterval;
var dasInterval;
var dasOn = false;

window.onkeydown = function(e){
    if (keysPressed[e.keyCode] == undefined) {
        keysPressed[e.keyCode] = {};
    }

    if (!keysPressed[e.keyCode].isPressed) {
        keysPressed[e.keyCode].isPressed = true;
        keysPressed[e.keyCode].wasKeyJustPressed = true;
    }
};
window.onkeyup = function(e){
    if (keysPressed[e.keyCode] == undefined) {
        keysPressed[e.keyCode] = {};
    }

    keysPressed[e.keyCode].isPressed = false;
};

function frame(f) {
    if (isKeyPressed(40)) {
        if (wasKeyJustPressed(40)) {
            game.moveDown();
            softdropInterval = setInterval(function(){ game.moveDown(); }, 20);
        }
    }
    else {
        clearInterval(softdropInterval);
    }

    if (wasKeyJustPressed(32)) {
        game.hardDrop();
    }
    if (wasKeyJustPressed(67)) {
        game.hold();
    }

    if (wasKeyJustPressed(90)) {
        game.rotateCcw();
    }
    if (wasKeyJustPressed(88) || wasKeyJustPressed(38)) {
        game.rotateCw();
    }
    if (wasKeyJustPressed(86)) {
        game.rotateFw();
    }

    if (isKeyPressed(37)) {
        keysPressed[37].timePressed = f - keysPressed[37].offset;
        if (wasKeyJustPressed(37)) {
            game.moveLeft();
            keysPressed[37].offset = f;
            keysPressed[37].timePressed = 0;
            clearInterval(dasInterval);
        }
        else if (keysPressed[37].timePressed > 150 && !dasOn) {
            dasInterval = setInterval(function(){ game.moveLeft(); }, 20);
            dasOn = true;
        }
    }
    if (isKeyPressed(39)) {
        keysPressed[39].timePressed = f - keysPressed[39].offset;
        if (wasKeyJustPressed(39)) {
            game.moveRight();
            keysPressed[39].offset = f;
            keysPressed[39].timePressed = 0;
            clearInterval(dasInterval);
            
        }
        else if (keysPressed[39].timePressed > 150 && !dasOn) {
            dasInterval = setInterval(function(){ game.moveRight(); }, 20);
            dasOn = true;
        }
        
    }
    if (!isKeyPressed(37) && !isKeyPressed(39)) {
        dasOn = false;
        clearInterval(dasInterval);
    }

    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

function isKeyPressed(code) {
    try {
        if (keysPressed[code].isPressed === true) {
            return true;
        }
    }
    catch (e) {
        return false;
    }
    return false;
}

function wasKeyJustPressed(code) {
    try {
        if (keysPressed[code].wasKeyJustPressed === true) {
            keysPressed[code].wasKeyJustPressed = false;
            return true;
        }
    }
    catch (e) {
        return false;
    }
    return false;
}