class Game {
    constructor() {
        this.board = emptyBoard;
        this.nextQueue = shuffle(emptyNext);
        this.piecePos = [3, 20, 0];
        this.currentPiece = this.nextQueue[0];
        this.nextQueue.shift();
        this.holdPiece = -1;
        this.canHold = true;
        this.gravity = 0;
        this.score = 0;
        this.combo = -1;
        this.b2b = false;
        this.canvas = document.getElementById("canvas");
        this.isPaused = true;
    }

    setCanvas(id) {
        this.canvas = document.getElementById(id);
    }

    setGravity(gravity) {
        this.gravity = gravity;
    }
    pause() {
        this.isPaused = true;
    }
    play() {
        if (this.isPaused == true) {
            this.frame(0);
            this.isPaused = false;
        }
    }

    rotateCw() {
        if (this.isPaused) {
            return;
        }

        this.piecePos[2] += 1;
        if (this.piecePos[2] == 4) {
            this.piecePos[2] = 0
        }
        if (this.isOverlapping()) {
            this.rotateCcw();
        }

        this.frame();
    }
    rotateCcw() {
        if (this.isPaused) {
            return;
        }

        this.piecePos[2] -= 1;
        if (this.piecePos[2] == -1) {
            this.piecePos[2] = 3
        }
        if (this.isOverlapping()) {
            this.rotateCw();
        }

        this.frame();
    }
    rotateFw() {
        if (this.isPaused) {
            return;
        }

        this.piecePos[2] += 2;
        if (this.piecePos[2] > 3) {
            this.piecePos[2] -= 4;
        }
        if (this.isOverlapping()) {
            this.rotateFw();
        }
        this.frame();
    }
    moveLeft() {
        if (this.isPaused) {
            return;
        }

        this.piecePos[0] -= 1;
        if (this.isOverlapping()) {
            this.piecePos[0] += 1;
        }
        else {
            playAudio('move');
        }

        this.frame();
    }
    moveRight() {
        if (this.isPaused) {
            return;
        }

        this.piecePos[0] += 1;
        if (this.isOverlapping()) {
            this.piecePos[0] -= 1;
        }
        else {
            playAudio('move');
        }

        this.frame();
    }
    moveDown() {
        if (this.isPaused) {
            return;
        }

        this.piecePos[1] += 1;
        if (this.isOverlapping()) {
            this.piecePos[1] -= 1;
        }
        else {
            playAudio('softdrop');
        }

        this.frame();
    }
    hold() {
        if (this.isPaused) {
            return;
        }

        if (this.canHold) {
            if (this.holdPiece == -1) {
                
                this.holdPiece = this.currentPiece;
                
                // add next piece
                this.piecePos = [3, 20, 0];
                this.currentPiece = this.nextQueue[0];
                this.nextQueue.shift();

                // add more pieces to queue
                if (this.nextQueue.length < 6) {
                    this.nextQueue = this.nextQueue.concat(shuffle());
                }

                // game over
                if (this.isOverlapping()) {
                    this.piecePos[1] = 18;
                    if (this.isOverlapping()) {
                        this.gameover();
                    }
                }

                this.canHold = false;

            }
            else {

                let piece = this.currentPiece;
                this.currentPiece = this.holdPiece;
                this.holdPiece = piece;

                // add next piece
                this.piecePos = [3, 20, 0];

                // game over
                if (this.isOverlapping()) {
                    this.piecePos[1] = 18;
                    if (this.isOverlapping()) {
                        this.gameover();
                    }
                }

                this.canHold = false;

            }
            
            playAudio('hold');

            this.frame();
        }
    }
    hardDrop() {
        if (this.isPaused) {
            return;
        }

        // hard drop
        do {
            this.piecePos[1] += 1;
        } while (this.isOverlapping() == false);
        this.piecePos[1] -= 1;

        this.lockPiece();
    }
    lockPiece() {
        if (this.isPaused) {
            return;
        }

        // add pieces to board
        for (var y = 0; y < 4; y++) {

            for (var x = 0; x < 4; x++) {
                if (pieces[this.currentPiece][this.piecePos[2]][y][x] != 0) {
                    this.board[y + this.piecePos[1]][x + this.piecePos[0]] = pieces[this.currentPiece][this.piecePos[2]][y][x];
                }
            }

        }

        // clear lines
        let linesCleared = 0;
        for (var y = 39; y > -1; y = y) {
            if (this.board[y].includes(0) == false) {

                for (var z = y; z > 0; z--) {
                    this.board[z] = this.board[z - 1];
                }
                this.board[0] = emptyRow;
                linesCleared++;

            }
            else {y--}

        }

        if (linesCleared == 0) {
            this.combo = -1;
        }
        else {
            this.combo++;
        }

        // detect perfect clear
        for (var y = 0; y < 40; y++) {
            if (this.board[y].reduce((a, b) => a + b, 0) > 0) {
                break;
            }
            else if (y == 39) {
                playAudio('perfectclear');
            }
        }

        // sounds
        if (linesCleared > 0 && linesCleared < 4) {
            playAudio('clear' + linesCleared.toString());
            this.b2b = false;
        }
        else if (linesCleared == 4) {
            if (this.b2b) {
                playAudio('b2b4');
            }
            else {
                playAudio('clear4');
                this.b2b = true;
            }
        }
        else {
            playAudio('lock');
        }

        if (this.combo > 0 && this.combo < 20) {
            playAudio('combo' + this.combo.toString());
        }
        else if (this.combo >= 20) {
            playAudio('combo20');
        }

        // add next piece
        this.piecePos = [3, 20, 0];
        this.currentPiece = this.nextQueue[0];
        this.nextQueue.shift();

        // add more pieces to queue
        if (this.nextQueue.length < 6) {
            this.nextQueue = this.nextQueue.concat(shuffle());
        }

        // game over
        if (this.isOverlapping()) {
            this.piecePos[1] = 18;
            if (this.isOverlapping()) {
                this.gameover();
            }
        }

        this.canHold = true;

        this.frame();
    }

    isOverlapping() {
        
        for (var y = 0; y < 4; y++) {

            for (var x = 0; x < 4; x++) {
                try {
                    if (pieces[this.currentPiece][this.piecePos[2]][y][x] != 0 && this.board[y + this.piecePos[1]][x + this.piecePos[0]] != 0) {
                        return true;
                    }
                }
                catch (e) {
                    if (pieces[this.currentPiece][this.piecePos[2]][y][x] != 0) {
                        return true;
                    }
                }
            }

        }

        return false;
    }

    frame() {
        let ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.width;

		// get ghost piece pos
		let tempPos = this.piecePos[1];
		
		do {
            this.piecePos[1] += 1;
        } while (this.isOverlapping() == false);
        this.piecePos[1] -= 1;
		let ghostPiecePos = this.piecePos;
		
		this.piecePos[1] = tempPos;
		
        // draw board
        for (var y = 18; y < 40; y++) {
            
            for (var x = 0; x < 10; x++) {

                let item;
                try {
                    if (x - this.piecePos[0] < 0 || x - this.piecePos[0] > 3) {
                        throw Error;
                    }
                    else if (pieces[this.currentPiece][this.piecePos[2]][y - this.piecePos[1]][x - this.piecePos[0]] == 0) {
                        throw Error;
                    }
                    item = pieces[this.currentPiece][this.piecePos[2]][y - this.piecePos[1]][x - this.piecePos[0]]
                } catch(e) {
                    // ghost piece
                    try {
						if (x - ghostPiecePos[0] < 0 || x - ghostPiecePos[0] > 3) {
							throw Error;
						}
						else if (pieces[this.currentPiece][ghostPiecePos[2]][y - ghostPiecePos[1]][x - ghostPiecePos[0]] == 0) {
							throw Error;
						}
						item = pieces[this.currentPiece][ghostPiecePos[2]][y - ghostPiecePos[1]][x - ghostPiecePos[0]]
					} catch(e) {
						item = this.board[y][x];
					}
                }
                
                let layer = 0;
                if (y < 20 && item == 0) {
                    layer = 100;
                }
                
                ctx.drawImage(pieceImg, (item * 100), layer, 100, 100, (x * 35) + 150, ((y - 18) * 35), 35, 35);
                
                //console.log(x - this.piecePos[0]);
                
            }

        }

        // draw next queue
        for (var i = 0; i < 6; i++) {
         
            for (var y = 0; y < 4; y++) {

                for (var x = 0; x < 4; x++) {

                    let index = this.nextQueue[i];
                    let item = pieces[index][0][y][x];
                    let layer = 0;

                    if (item == 0) {
                        layer = 100;
                    }
                    //console.log("x- " + (x * 20 + 200) + " y- " + ((y) * 20 + (i * 25)))
                    //console.log(((y) * 20 + (i * 25)))
                    ctx.drawImage(pieceImg, (item * 100), layer, 100, 100, (x * 20 + 510), (((y * 20) + (i * 60)) + 50), 20, 20);
                }

            }

        }

        // draw hold piece
        if (this.holdPiece != -1) {
            for (var y = 0; y < 4; y++) {

                for (var x = 0; x < 4; x++) {

                    let index = this.holdPiece;
                    let item = pieces[index][0][y][x];
                    let layer = 0;

                    if (item == 0) {
                        layer = 100;
                    }
                    //console.log("x- " + (x * 20 + 200) + " y- " + ((y) * 20 + (i * 25)))
                    //console.log(((y) * 20 + (i * 25)))
                    ctx.drawImage(pieceImg, (item * 100), layer, 100, 100, (x * 20 + 60), ((y * 20) + 50), 20, 20);
                }

            }
        }

    }

    gameover() {
        music.pause();
        playAudio('gameover');
        game.pause();
    }
}

function shuffle(a = [0, 1, 2, 3, 4, 5, 6]) {
    var j, x, i;
    for (i = a.length - 1; i > -1; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function playAudio(src) {
    sounds[src].cloneNode(true).play();
}

function createAudio (src) {
    var audio = new Audio('sounds/' + src + '.wav');
    return audio;
}

var sounds = {};
let pieceImg;
var music;

function loadAssets () {
    pieceImg = new Image();
    pieceImg.src = 'images/pieces.png'

    pieceImg.addEventListener('load', e => {
        game.play();
    });
    
    let audioSrcs = ['b2b4','b2bt1','b2bt2','b2bt3','b2btmini','clear1','clear2','clear3','clear4','combo1','combo2','combo3','combo4','combo5','combo6','combo7','combo8','combo9','combo10','combo11','combo12','combo13','combo14','combo15','combo16','combo17','combo18','combo19','combo20','gameover','garbage','hold','ko','lock','move','perfectclear','rotate','rotatefail','softdrop','t0','t1','t2','t3','tmini']
    for (var i = 0; i < audioSrcs.length; i++) {
        sounds[audioSrcs[i]] = createAudio(audioSrcs[i]);
    }

    music = new Audio('sounds/music3.ogg');
    music.loop = true;
    music.play();
    
}

loadAssets();



//returnanimationframe(function) or something

/*

TODO:

Add SRS
Fix DAS
Add Sounds
Add Score
Reuse Empty Next const
Put audio in variables for loading

*/