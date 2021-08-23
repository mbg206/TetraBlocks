window.onkeydown = function(e){
    let keyCode = e.keyCode;
    if (keyCode == 38 || keyCode == 88) {
        game.rotateCw();
        game.frame();
    }
    if (keyCode == 90) {
        game.rotateCcw();
        game.frame();
    }
    if (keyCode == 86) {
        game.rotateFw();
        game.frame();
    }

    if (keyCode == 37) {
        game.moveLeft();
        game.frame();
    }
    if (keyCode == 39) {
        game.moveRight();
        game.frame();
    }
    if (keyCode == 40) {
        game.moveDown();
        game.frame();
    }
    if (keyCode == 32) {
        game.hardDrop();
        game.frame();
    }
    if (keyCode == 67) {
        game.hold();
        game.frame();
    }
};