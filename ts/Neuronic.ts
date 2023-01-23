


declare var Sound_Start: any;
declare var Sound_Random: any;
declare var Sound_Over: any;
declare var Sound_NearEnd: any;
declare var Sound_End: any;
declare var Sound_Music: any;

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function playSound(soundArray, volume) {
    // get random index
    var index = getRandomInt(0, soundArray.length - 1);

    soundArray[index].pause();
    soundArray[index].currentTime = 0;
    soundArray[index].volume = volume;
    soundArray[index].play();
}



class Point {
    x: number;
    y: number;

    toString() : string {
        return "x: " + this.x + ", y: " + this.y;// + ", l: " + this.length;
    }

    // Returns a point randomly between 2 points
    static RandomBetween(point1: Point, point2: Point) : Point
    {
        var dist = Math.random();

        var ret = new Point();

        ret.x = point1.x + dist * (point2.x - point1.x);
        ret.y = point1.y + dist * (point2.y - point1.y);

        return ret;
    }

    static scaled(thePoint: Point, scale: number): Point {
        var ret: Point = new Point();
        ret.x = thePoint.x * scale;
        ret.y = thePoint.y * scale;
        return ret;
    }
}

class Vector2D {
    x: number;
    y: number;

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    get normalised(): Vector2D {
        var len: number = this.length;

        var ret: Vector2D = new Vector2D();
        ret.x = this.x / len;
        ret.y = this.y / len;
        return ret;
    }

    

    scaled(scale: number): Vector2D {
        var ret: Vector2D = new Vector2D();
        ret.x = this.x * scale;
        ret.y = this.y * scale;
        return ret;
    }

    toString() : string
    {
        return "x: " + this.x + ", y: " + this.y;// + ", l: " + this.length;
    }

     // Calculate the angle using the dot produce (https://en.wikipedia.org/wiki/Dot_product)
    static AngleBetween2Vectors(v1: Vector2D, v2: Vector2D) : number 
    {
        var dp : number = v1.x * v2.x + v1.y * v2.y;

        return Math.acos(dp / Math.sqrt(v1.lengthSquared * v2.lengthSquared));
    }

    static FromPoints(fromPoint: Point, toPoint: Point): Vector2D
    {
        var ret = new Vector2D();

        ret.x = toPoint.x - fromPoint.x;
        ret.y = toPoint.y - fromPoint.y;

        return ret;
    }
}

interface Connection {
    point1: number;
    point2: number;
}

class Player {
    location: Point;    // The x y location of the player
    ConnectionId: number; // The ID of the id of the connection teh player is on
    Socre: number;      // The players score
}

class Neuron {
    location: Point;
    health: number;
    ConnectionId: number;
    ReviveTicks: number;
    WobbleAngle: number;

    static neuronDrawPoints: Point[] = [{ x: 0, y: 7 }, { x: 1, y: 1 }, { x: 8, y: 8 }, { x: 1.5, y: 0.5 }, { x: 8, y: -8 }, { x: -1, y: -1 }, { x: 0, y: -8 }, { x: -1, y: -1 }, { x: -12, y: 2 }, { x: -1, y: 1 }];

    static Draw(theGame: Game, neuron: Neuron, ctx: CanvasRenderingContext2D)
    {
        var draw = true;

        if (!isNaN(theGame.gameLoopMs)) {
            neuron.WobbleAngle += theGame.gameLoopMs / 100;
        }

        if (neuron.WobbleAngle > 2 * Math.PI)
        {
            neuron.WobbleAngle = 0;
        }

        var diff = nowTicks - neuron.ReviveTicks;

        if (neuron.health < 20)
        {
            var nowTicks = (new Date()).getTime();

            if (Math.round(diff / 250) % 2 > 0)
            {
                draw = false;
            }
        }

        if (draw) {
            var wobbleScale = 0.5 * Math.sin(neuron.WobbleAngle) + 1.5;

            var neuronNeucuusRadius = wobbleScale * 2;

            var drawHealth = neuron.health;

            if (drawHealth > 100)
            {
                drawHealth = 100;
            }

            var green = Math.round(255 * drawHealth / 100);
            var red = Math.round(255 - green);

            var color = "rgb(" + red + "," + green + ",0)";

            ctx.strokeStyle = color

            ctx.beginPath()
            ctx.lineWidth = neuronNeucuusRadius;
            ctx.ellipse(neuron.location.x, neuron.location.y, neuronNeucuusRadius, neuronNeucuusRadius, 0, 0, Math.PI * 2);

            // draw the neuron connections
            ctx.stroke();

            ctx.beginPath()
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgb(40,40,40)";

            var scaledPoints: Point[] = [];

            for (var count = 0; count < Neuron.neuronDrawPoints.length; count++)
            {
                scaledPoints.push(Point.scaled(Neuron.neuronDrawPoints[count], wobbleScale))
            }

            ctx.moveTo(neuron.location.x + scaledPoints[0].x, neuron.location.y + scaledPoints[0].y);

            ctx.quadraticCurveTo(neuron.location.x + scaledPoints[1].x, neuron.location.y + scaledPoints[1].y,
                neuron.location.x + scaledPoints[2].x, neuron.location.y + scaledPoints[2].y);

            ctx.quadraticCurveTo(neuron.location.x + scaledPoints[3].x, neuron.location.y + scaledPoints[3].y,
                neuron.location.x + scaledPoints[4].x, neuron.location.y + scaledPoints[4].y);

            ctx.quadraticCurveTo(neuron.location.x + scaledPoints[5].x, neuron.location.y + scaledPoints[5].y,
                neuron.location.x + scaledPoints[6].x, neuron.location.y + scaledPoints[6].y);

            ctx.quadraticCurveTo(neuron.location.x + scaledPoints[7].x, neuron.location.y + scaledPoints[7].y,
                neuron.location.x + scaledPoints[8].x, neuron.location.y + scaledPoints[8].y);

            ctx.quadraticCurveTo(neuron.location.x + Neuron.neuronDrawPoints[9].x, neuron.location.y + Neuron.neuronDrawPoints[9].y,
                neuron.location.x + scaledPoints[0].x, neuron.location.y + scaledPoints[0].y);

            ctx.stroke();
        }
    }

    static Revive(neuron: Neuron)   {
        // Revive the neuron
        neuron.health = 100;
        neuron.ReviveTicks = (new Date()).getTime();
        neuron.WobbleAngle = 0;
    }
}



class Game {
    deltaT: number = 1000;

    canvas: HTMLCanvasElement;

    points: Point[];
    connections: Connection[];
    zapPoints: Connection[];


    neurons: Neuron[] = [];

    player: Player;

    // The game timer
    gameStartTimeTicks: number;
    gameTime: Date;
    gameLoopMs: number;
    debug: string;
    gameTicks: number = 0;

    _age: number = 0;
    _score: number = 0;

    age = function () {
        if (!this.gameOver)
        {
            this._age = this.gameTicks / 50.0;;
        }

        return this._age;
    }

    pullToPoint: Point;
    pullToVect: Vector2D;

    gameOver: boolean = false;
    gameNearEnd: boolean = false;
    gameHalt: boolean = false;

    gameOverCallback: (score: Number, age: Number) => void;

    neuronHealthDeductionPerSecond: number;


    // The mouse location
    mousePosition: Point = new Point();

    static PlayerPixelsPerSecSpeed: number = 100.0;
    static InitialNeuronHealthDeductionPerSecond = 2.0;
    static deathAccelerationFactor = 0.00001;

    static theGame: Game;
    

    constructor(cv: HTMLCanvasElement, gameOverCb: (score : Number, age: Number) => void) {
        Game.theGame = this;

        this.gameOverCallback = gameOverCb;

        // Set the canvas
        Game.theGame.canvas = cv;

        this.gameStartTimeTicks = (new Date()).getTime();

        // Capture mouse moves
        this.canvas.addEventListener('mousemove', function (evt) {
            var mousePos = Game.getMousePos(Game.theGame.canvas, evt);
            Game.theGame.mousePosition.x = mousePos.x;
            Game.theGame.mousePosition.y = mousePos.y;
        }, false);

        this.neuronHealthDeductionPerSecond = Game.InitialNeuronHealthDeductionPerSecond;

        // Initalise the paths
        //this.initaliseSimplePaths();
        this.initaliseBrainPaths();
        this.initaliseNeurons(100);
        this.initalisePlayer();

        playSound(Sound_Start, 1);
        playSound(Sound_Music, 0.1);
        
        this.gameTime = new Date();
        window.requestAnimationFrame(Game.mainLoop);
    }

    static getMousePos(canvas: HTMLCanvasElement, evt) {
        var rect = canvas.getBoundingClientRect();

        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
         
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY  
    };
}

    static mainLoop(deltaTms: number)
    {
        var deltaT = deltaTms / 1000;

        var oldGameTime = Game.theGame.gameTime;

        Game.UpdateNeurons(Game.theGame, Game.theGame.gameLoopMs);

        if (!Game.theGame.gameOver) {
            Game.MovePlayer(Game.theGame, Game.theGame.gameLoopMs);
        }


        if (!Game.theGame.gameOver) {
            var revived: boolean = false;

            // Check for collisions (Player stimulating neurons)
            for (var count = 0; count < Game.theGame.neurons.length; count++) {
                var neuron = Game.theGame.neurons[count];

                if (neuron.ConnectionId == Game.theGame.player.ConnectionId) {
                    var diffX = neuron.location.x - Game.theGame.player.location.x;
                    var diffY = neuron.location.y - Game.theGame.player.location.y;

                    var distSquared = diffX * diffX + diffY * diffY;

                    if (distSquared < 10 * 10) {
                        if (neuron.health < 98) {
                            revived = true;
                        }
                        Neuron.Revive(neuron);
                    }
                }
            }

            if (revived) {
                playSound(Sound_Over, 0.5);
            }
        }
        

        Game.DrawBoard(Game.theGame);
        Game.theGame.gameTime = new Date();

        // Calculate the load percent
        Game.theGame.gameLoopMs = Game.theGame.gameTime.getTime() - oldGameTime.getTime();

        Game.theGame.gameTicks++;

        if (!Game.theGame.gameOver) {
            Game.theGame._score += Game.theGame.neurons.length / 1000 * Game.theGame.gameLoopMs;
        }


        // Increase the deduction rate
        Game.theGame.neuronHealthDeductionPerSecond = Game.theGame.neuronHealthDeductionPerSecond * 1.0 + (deltaT * Game.deathAccelerationFactor)

        Game.DetectEnd(Game.theGame);

        var rand = getRandomArbitrary(0, 1000);

        if (!Game.theGame.gameOver && rand <= 10)
        {
            playSound(Sound_Random, 1);
        }

        if (!Game.theGame.gameHalt) {
            window.requestAnimationFrame(Game.mainLoop);
        }
    }

    // Initalises a simple path for testing
    initaliseSimplePaths() {
        this.points = [{ x: 110, y: 110 }, { x: 200, y: 200 }, { x: 300, y: 200 }, { x: 320, y: 110 }];
        this.connections = [{ point1: 0, point2: 1 }, { point1: 1, point2: 2 }, { point1: 2, point2: 3 }, { point1: 3, point2: 0 }]
    }

    // Creates the game paths
    initaliseBrainPaths() {
        this.points = [{ x: 119, y: 127 }, { x: 121, y: 120 }, { x: 126, y: 115 }, { x: 132, y: 115 }, { x: 140, y: 119 }, { x: 142, y: 162 },
        { x: 142, y: 174 }, { x: 140, y: 193 }, { x: 132, y: 208 }, { x: 116, y: 218 }, { x: 97, y: 219 }, { x: 85, y: 212 }, { x: 73, y: 214 },
        { x: 57, y: 211 }, { x: 45, y: 201 }, { x: 38, y: 186 }, { x: 38, y: 172 }, { x: 32, y: 167 }, { x: 24, y: 158 }, { x: 20, y: 146 },
        { x: 21, y: 134 }, { x: 28, y: 122 }, { x: 39, y: 116 }, { x: 32, y: 106 }, { x: 28, y: 93 }, { x: 32, y: 80 }, { x: 41, y: 71 },
        { x: 51, y: 68 }, { x: 55, y: 62 }, { x: 58, y: 50 }, { x: 65, y: 40 }, { x: 78, y: 37 }, { x: 92, y: 41 }, { x: 95, y: 29 }, { x: 108, y: 21 },
        { x: 127, y: 24 }, { x: 140, y: 37 }, { x: 141, y: 63 }, { x: 141, y: 76 }, { x: 141, y: 110 }, { x: 136, y: 74 }, { x: 125, y: 85 },
        { x: 112, y: 91 }, { x: 97, y: 84 }, { x: 94, y: 70 }, { x: 107, y: 58 }, { x: 115, y: 60 }, { x: 119, y: 65 }, { x: 135, y: 164 },
        { x: 132, y: 160 }, { x: 116, y: 165 }, { x: 112, y: 177 }, { x: 103, y: 168 }, { x: 89, y: 168 }, { x: 81, y: 176 }, { x: 85, y: 192 },
        { x: 40, y: 161 }, { x: 46, y: 153 }, { x: 57, y: 147 }, { x: 67, y: 148 }, { x: 68, y: 130 }, { x: 76, y: 121 }, { x: 86, y: 120 },
        { x: 99, y: 127 }, { x: 103, y: 138 }, { x: 65, y: 69 }, { x: 76, y: 75 }, { x: 77, y: 87 }, { x: 181, y: 127 }, { x: 179, y: 120 },
        { x: 174, y: 115 }, { x: 168, y: 115 }, { x: 160, y: 119 }, { x: 158, y: 162 }, { x: 158, y: 174 }, { x: 160, y: 193 }, { x: 168, y: 208 },
        { x: 184, y: 218 }, { x: 203, y: 219 }, { x: 215, y: 212 }, { x: 227, y: 214 }, { x: 243, y: 211 }, { x: 255, y: 201 }, { x: 262, y: 186 },
        { x: 262, y: 172 }, { x: 268, y: 167 }, { x: 276, y: 158 }, { x: 280, y: 146 }, { x: 279, y: 134 }, { x: 272, y: 122 }, { x: 261, y: 116 },
        { x: 268, y: 106 }, { x: 272, y: 93 }, { x: 268, y: 80 }, { x: 259, y: 71 }, { x: 249, y: 68 }, { x: 245, y: 62 }, { x: 242, y: 50 },
        { x: 235, y: 40 }, { x: 222, y: 37 }, { x: 208, y: 41 }, { x: 205, y: 29 }, { x: 192, y: 21 }, { x: 173, y: 24 }, { x: 160, y: 37 },
        { x: 159, y: 63 }, { x: 159, y: 76 }, { x: 159, y: 110 }, { x: 164, y: 74 }, { x: 175, y: 85 }, { x: 188, y: 91 }, { x: 203, y: 84 },
        { x: 206, y: 70 }, { x: 193, y: 58 }, { x: 185, y: 60 }, { x: 181, y: 65 }, { x: 165, y: 164 }, { x: 168, y: 160 }, { x: 184, y: 165 },
        { x: 188, y: 177 }, { x: 197, y: 168 }, { x: 211, y: 168 }, { x: 219, y: 176 }, { x: 215, y: 192 }, { x: 260, y: 161 }, { x: 254, y: 153 },
        { x: 243, y: 147 }, { x: 233, y: 148 }, { x: 232, y: 130 }, { x: 224, y: 121 }, { x: 214, y: 120 }, { x: 201, y: 127 }, { x: 197, y: 138 },
        { x: 235, y: 69 }, { x: 224, y: 75 }, { x: 223, y: 87 }, { x: 119, y: 127 }, { x: 121, y: 120 }, { x: 126, y: 115 }, { x: 132, y: 115 },
        { x: 140, y: 119 }, { x: 142, y: 162 }, { x: 142, y: 174 }, { x: 140, y: 193 }, { x: 132, y: 208 }, { x: 116, y: 218 }, { x: 97, y: 219 },
        { x: 85, y: 212 }, { x: 73, y: 214 }, { x: 57, y: 211 }, { x: 45, y: 201 }, { x: 38, y: 186 }, { x: 38, y: 172 }, { x: 32, y: 167 },
        { x: 24, y: 158 }, { x: 20, y: 146 }, { x: 21, y: 134 }, { x: 28, y: 122 }, { x: 39, y: 116 }, { x: 32, y: 106 }, { x: 28, y: 93 },
        { x: 32, y: 80 }, { x: 41, y: 71 }, { x: 51, y: 68 }, { x: 55, y: 62 }, { x: 58, y: 50 }, { x: 65, y: 40 }, { x: 78, y: 37 }, { x: 92, y: 41 },
        { x: 95, y: 29 }, { x: 108, y: 21 }, { x: 127, y: 24 }, { x: 140, y: 37 }, { x: 141, y: 63 }, { x: 141, y: 76 }];

        // Scale the points
        var len = this.points.length;

        for (var count: number = 0; count < len; count++) {
            var point = this.points[count];

            point.x *= 2;
            point.y *= 2;
        }

        // The left hemisphere connections
        this.connections = [{ point1: 0, point2: 1 }, { point1: 1, point2: 2 }, { point1: 2, point2: 3 }, { point1: 3, point2: 4 }, { point1: 4, point2: 5 },
        { point1: 5, point2: 6 }, { point1: 6, point2: 7 }, { point1: 7, point2: 8 }, { point1: 8, point2: 9 }, { point1: 9, point2: 10 }, { point1: 10, point2: 11 },
        { point1: 11, point2: 12 }, { point1: 12, point2: 13 }, { point1: 13, point2: 14 }, { point1: 14, point2: 15 }, { point1: 15, point2: 16 }, { point1: 16, point2: 17 },
        { point1: 17, point2: 18 }, { point1: 18, point2: 19 }, { point1: 19, point2: 20 }, { point1: 20, point2: 21 }, { point1: 21, point2: 22 }, { point1: 22, point2: 23 },
        { point1: 23, point2: 24 }, { point1: 24, point2: 25 }, { point1: 25, point2: 26 }, { point1: 26, point2: 27 }, { point1: 27, point2: 28 }, { point1: 28, point2: 29 },
        { point1: 29, point2: 30 }, { point1: 30, point2: 31 }, { point1: 31, point2: 32 }, { point1: 32, point2: 33 }, { point1: 33, point2: 34 }, { point1: 34, point2: 35 },
        { point1: 35, point2: 36 }, { point1: 36, point2: 37 }, { point1: 37, point2: 38 }, { point1: 38, point2: 39 }, { point1: 40, point2: 41 }, { point1: 41, point2: 42 },
        { point1: 42, point2: 43 }, { point1: 43, point2: 44 }, { point1: 44, point2: 45 }, { point1: 45, point2: 46 }, { point1: 46, point2: 47 }, { point1: 48, point2: 49 },
        { point1: 49, point2: 50 }, { point1: 50, point2: 51 }, { point1: 51, point2: 52 }, { point1: 52, point2: 53 }, { point1: 53, point2: 54 }, { point1: 54, point2: 55 },
        { point1: 56, point2: 57 }, { point1: 57, point2: 58 }, { point1: 58, point2: 59 }, { point1: 59, point2: 60 }, { point1: 60, point2: 61 }, { point1: 61, point2: 62 },
        { point1: 62, point2: 63 }, { point1: 63, point2: 64 }, { point1: 65, point2: 66 }, { point1: 66, point2: 67 }, { point1: 39, point2: 4 }, { point1: 39, point2: 3 },
        { point1: 40, point2: 37 }, { point1: 40, point2: 38 }, { point1: 56, point2: 17 }, { point1: 56, point2: 16 }, { point1: 39, point2: 4 }, { point1: 39, point2: 3 },
        { point1: 65, point2: 27 }, { point1: 65, point2: 28 }, { point1: 48, point2: 5 }, { point1: 48, point2: 6 },];

        this.zapPoints = [  { point1: 0, point2: 72 },
                            { point1: 47, point2: 79 },
                            { point1: 55, point2: 124 },
                            { point1: 64, point2: 100 },
                            { point1: 67, point2: 92 },

                            { point1: 68, point2: 4 },
                            { point1: 115, point2: 11 },
                            { point1: 123, point2: 56 },
                            { point1: 132, point2: 32 },
                            { point1: 135, point2: 24 }]

        var len = this.connections.length;

        // Calculate the right hemisphere : Mirror image of left
        for (var count: number = 0; count < len; count++) {
            var existing = this.connections[count];

            var connection: Connection = { point1: existing.point1 + 68, point2: existing.point2 + 68 };
            this.connections.push(connection);
        }
    }

    initaliseNeurons(num: number)
    {
        for (var count = 0; count < num; count++)
        {
            // Place a neuron on a random connection somewhere
            var conId = getRandomInt(0, this.connections.length - 1);

            var connection = this.connections[conId];

            var neuron = new Neuron();

            var healthRandom = getRandomArbitrary(90, 100);

            neuron.health = healthRandom;
            neuron.ConnectionId = conId;
            neuron.ReviveTicks = (new Date()).getTime();
            neuron.WobbleAngle = 0;
            neuron.location = Point.RandomBetween(this.points[connection.point1], this.points[connection.point2]);

            this.neurons.push(neuron);
        }
    }

    initalisePlayer()
    {
        this.player = new Player();

        this.player.ConnectionId = 3;

        this.player.location = new Point();
        this.player.location.x = this.points[this.connections[this.player.ConnectionId].point1].x;
        this.player.location.y = this.points[this.connections[this.player.ConnectionId].point1].y;
        this.player.Socre = 0;
    }

    DrawGameData(ctx: CanvasRenderingContext2D)
    {
        ctx.font = "20px Georgia";
        ctx.fillStyle = "#88ffDD"; 
        ctx.fillText("score: " + Math.round(this._score), 10, 25);
        ctx.fillText("IQ: " + this.neurons.length, 10, 50);
        ctx.fillText("Age: " + this.age() + " years", 10, 75);
    }

    DrawCircle(ctx: CanvasRenderingContext2D, point: Point, diameter: number)
    {
        var radius = diameter / 2;

        ctx.beginPath()
        ctx.ellipse(point.x, point.y, radius, radius, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    DrawCircleLine(ctx: CanvasRenderingContext2D, point1: Point, point2: Point, diameter: number)
    {
        var radius = diameter / 2;

        // find the number of pixels between the points (max of diff x, diff y
        var distX = Math.abs(point1.x - point2.x);
        var distY = Math.abs(point1.y - point2.y);

        var dist = distX > distY ? distX : distY;

        var xStep = (point2.x - point1.x) / dist;
        var yStep = (point2.y - point1.y) / dist;

        for (var count = 0; count < dist; count+=3) {

            var x = point1.x + xStep * count;
            var y = point1.y + yStep * count;

            ctx.beginPath()
            ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    static FindBestConnectionId(theGame : Game, fromPointId: number, pullVector: Vector2D): number {
        var minAngle = Math.PI * 2;
        var bestId = -1;

        // get all connections on this point
        for (var count = 0; count < theGame.connections.length; count++)
        {
            if (theGame.connections[count].point1 == fromPointId) {
                var conVector = Vector2D.FromPoints(theGame.points[theGame.connections[count].point1], theGame.points[theGame.connections[count].point2]);
                var angleTo = Vector2D.AngleBetween2Vectors(conVector, pullVector);

                if (angleTo < minAngle && angleTo < Math.PI / 2) {
                    minAngle = angleTo;
                    bestId = count;
                }
            }

            if (theGame.connections[count].point2 == fromPointId) {
                var conVector = Vector2D.FromPoints(theGame.points[theGame.connections[count].point2], theGame.points[theGame.connections[count].point1]);
                var angleTo = Vector2D.AngleBetween2Vectors(conVector, pullVector);

                if (angleTo < minAngle && angleTo < Math.PI / 2) {
                    minAngle = angleTo;
                    bestId = count;
                }
            }
        }

        return bestId;
    }

    static moveInDirection(theGame : Game, pullToVect: Vector2D, pullToPoint: Point, distTomove: number, distMultiplier: number): number {

        // Calculate the dist we can move along this vector
        var thisVectDist = distTomove * distMultiplier;


        // Calculate the distance from the player to the pull point
        var playerToPointVect = Vector2D.FromPoints(theGame.player.location, pullToPoint);


        // If we can make it to the pull to point, move player there and calculate the remaing dist
        if (playerToPointVect.lengthSquared < (thisVectDist * thisVectDist)) {
            theGame.player.location.x = pullToPoint.x;
            theGame.player.location.y = pullToPoint.y;

            var ret = distTomove * Math.sqrt(playerToPointVect.lengthSquared / (thisVectDist * thisVectDist));

            return ret;
        }
        else {
            // We won't make it all the way to the pull to point
            var moveVect = pullToVect.scaled(thisVectDist);

            theGame.player.location.x += moveVect.x;
            theGame.player.location.y += moveVect.y;

            return 0;
        }
    }

    static UpdateNeurons(theGame: Game, detltTMs: number) {

        if (detltTMs > 0) {
            var healthDeduction = (detltTMs / 1000) * theGame.neuronHealthDeductionPerSecond;
            

            var removeList = [];

            for (var count = theGame.neurons.length - 1; count >= 0; count--) {
                theGame.neurons[count].health = theGame.neurons[count].health - healthDeduction;

                if (theGame.neurons[count].health <= 0) {
                    // Mark neuron for deletion
                    removeList.push(count);
                }
            }

            // remove the neurons marked for deletion
            for (var count = 0; count < removeList.length; count++) {
                var removeId = removeList[count];

                theGame.neurons.splice(removeId, 1);
            }
        }
    }


    static MovePlayer(theGame: Game, detltTMs: number) {

        //theGame.debug = "" + theGame.connections[theGame.player.ConnectionId].point1;

        theGame.debug = "" + theGame.player.location.x;

        if (detltTMs!= 0)
        {

            var deltaT: number = detltTMs / 1000; // Calculate deltaT in seconds

            var distTomove = this.PlayerPixelsPerSecSpeed * deltaT;
            
            while (distTomove > 0 && !isNaN(theGame.mousePosition.x) ) {
                
                // Calculate the pull vector
                var pullVector = Vector2D.FromPoints(theGame.player.location, theGame.mousePosition);

                // Get the connection the player is on
                var connection = theGame.connections[theGame.player.ConnectionId];

                // get the 2 points on the connection
                var pointA = theGame.points[connection.point1];
                var pointB = theGame.points[connection.point2];

                // Find the vector to each point the player is on
                var vectToA = Vector2D.FromPoints(theGame.player.location, pointA);
                var vectToB = Vector2D.FromPoints(theGame.player.location, pointB);

                // Find the angles to each point
                var angleA = Vector2D.AngleBetween2Vectors(pullVector, vectToA);
                var angleB = Vector2D.AngleBetween2Vectors(pullVector, vectToB);

                // we pull toward the vector with the smallest angle from pull vector
                
                var pullAngle: number = 0;
                var pullToPointId: number;

                var onPoint: Boolean = false;

                if (isNaN(angleB)) {
                    if (angleA <= Math.PI / 2) // Is A in the right direction
                    {
                        theGame.pullToVect = vectToA;
                        pullAngle = angleA;
                        theGame.pullToPoint = pointA;
                        pullToPointId = connection.point1;
                    }
                    else {
                        onPoint = true;

                        theGame.pullToVect = vectToB;
                        pullAngle = 0;
                        theGame.pullToPoint = pointB;
                        pullToPointId = connection.point2;
                    }
                }
                else if (isNaN(angleA)) {
                    if (angleB <= Math.PI / 2) // Is A in the right direction
                    {
                        theGame.pullToVect = vectToB;
                        pullAngle = angleB;
                        theGame.pullToPoint = pointB;
                        pullToPointId = connection.point2;
                    }
                    else {
                        onPoint = true;

                        theGame.pullToVect = vectToA;
                        pullAngle = 0;
                        theGame.pullToPoint = pointA;
                        pullToPointId = connection.point1;
                    }
                }
                else {
                    if (angleA < angleB) {
                        theGame.pullToVect = vectToA;
                        pullAngle = angleA;
                        theGame.pullToPoint = pointA;
                        pullToPointId = connection.point1;
                    }
                    else {
                        theGame.pullToVect = vectToB;
                        pullAngle = angleB;
                        theGame.pullToPoint = pointB;
                        pullToPointId = connection.point2;
                    }
                }

                theGame.pullToVect = theGame.pullToVect.normalised;

                //theGame.debug = "" + pullAngle * 180 / Math.PI;
                var distMultiplier = Math.cos(pullAngle);

                //theGame.debug = pullToPoint.x + ", " + pullToPoint.y;

                // calculate the pull proportion
                distTomove = Game.moveInDirection(theGame, theGame.pullToVect, theGame.pullToPoint, distTomove, distMultiplier);

                if (distTomove > 0.0 || onPoint) {

                    var zapped = false;

                    if (onPoint) {
                        // If we are on a zap point, zap the player
                        for (var count = 0; count < theGame.zapPoints.length; count++) {
                            var zp = theGame.zapPoints[count];

                            if (zp.point1 == pullToPointId)
                            {
                                theGame.player.ConnectionId = zp.point2;

                                theGame.player.location = new Point();
                                theGame.player.location.x = theGame.points[theGame.connections[theGame.player.ConnectionId].point1].x;
                                theGame.player.location.y = theGame.points[theGame.connections[theGame.player.ConnectionId].point1].y;

                                zapped = true;
                                distTomove = 0;
                            }
                        }
                    }
                    
                    if (!zapped) {
                        // recalculate the pull vector
                        pullVector = Vector2D.FromPoints(theGame.player.location, theGame.mousePosition);

                        // Find next connection in closest direction
                        var connId = Game.FindBestConnectionId(theGame, pullToPointId, pullVector);

                        if (connId >= 0) {
                            theGame.player.ConnectionId = connId;
                        }
                        else {
                            // If we don't find one, exit. We can't move
                            break;
                        }
                    }
                }
            }

            
        }
    }

    static DrawBoard(theGame: Game) {

        var ctx: CanvasRenderingContext2D = theGame.canvas.getContext('2d');

        ctx.clearRect(0, 0, theGame.canvas.width, theGame.canvas.height);

        ctx.strokeStyle = "rgb(185,205,30)";
        ctx.lineWidth = 20;

        for (var count = 0; count < theGame.connections.length; count++)
        {
            var connection = theGame.connections[count];
            var point1 = theGame.points[connection.point1];
            var point2 = theGame.points[connection.point2];

            theGame.DrawCircleLine(ctx, point1, point2, 5);

            //ctx.moveTo(point1.x, point1.y);
            //ctx.lineTo(point2.x, point2.y);
            //ctx.stroke();
        }

        // Draw the neurons
        for (var count = 0; count < theGame.neurons.length; count++)
        {
            var neuron = theGame.neurons[count];
            
            Neuron.Draw(theGame, neuron, ctx);
        }

        // Dray the player
        if (!theGame.gameOver) {
            ctx.strokeStyle = "rgb(0,0,255)";
            ctx.lineWidth = 15;
            theGame.DrawCircle(ctx, theGame.player.location, 5);
        }

        // debug

        // draw pull to point

        /*if (theGame.pullToPoint) {
            ctx.strokeStyle = "rgb(0,255,0)";
            ctx.lineWidth = 5;
            theGame.DrawCircle(ctx, theGame.pullToPoint, 2);
        }

        if (theGame.pullToVect) {
            ctx.strokeStyle = "rgb(255,0,0)";
            ctx.lineWidth = 3;
            ctx.moveTo(theGame.player.location.x, theGame.player.location.y );
            ctx.lineTo(theGame.player.location.x + theGame.pullToVect.x * 10, theGame.player.location.y + theGame.pullToVect.y * 10)
            ctx.stroke()
        }*/

        // Draw the game data
        theGame.DrawGameData(ctx);
    };


    static DetectEnd(theGame: Game) {

        if (theGame.gameOver && theGame.neurons.length == 0 && theGame.gameOverCallback)
        {
            theGame.gameOverCallback(theGame._score, theGame.age());
            theGame.gameHalt = true;
        }


        if (!theGame.gameOver)
        {
            var leftNeurons = 0;
            var rightNeurons = 0;

            // Dead if left or right has no neurons
            for (var count = 0; count < theGame.neurons.length; count++)
            {
                var neuron = theGame.neurons[count];

                if (neuron.location.x < 300)
                {
                    leftNeurons++;
                }
                else
                {
                    rightNeurons++;
                }
            }

            //theGame.debug = "left: " + leftNeurons + ", right: " + rightNeurons;
            
            if (!theGame.gameNearEnd)
            {
                if (leftNeurons < 10 || rightNeurons < 10) {
                    theGame.gameNearEnd = true;
                    playSound(Sound_NearEnd, 1);
                }

            }

            if (leftNeurons <= 0 || rightNeurons <= 0)
            {
                theGame.gameOver = true;
                playSound(Sound_End, 1);
            }
        }
    }
}
