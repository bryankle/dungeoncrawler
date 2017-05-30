function Map(width, height) {
    this.width = width;
    this.height = height;
    this.critters = {}
    this.grid = (function() {
            var arr = [];
            for (var i = 0; i < this.width; i++) {
                var row = [];
                for (var j = 0; j < this.height; j++) {
                    row.push('_');
                }
                arr.push(row);
            }
            return arr;
        }).bind(this)();
    this.gridReference = this.grid
}

/* GENERATING RANDOM ROOMS/OBSTACLES(TESTING) */

Map.prototype.generateRooms = function(rooms) {
    var that = this;
    // var randomX = Math.floor(Math.random() * this.width);
    // var randomY = Math.floor(Math.random() * this.height);
   // console.log(randomX, randomY)
    function helperGeneratePosition() {
        var randomX = Math.floor(Math.random() * that.width);
        var randomY = Math.floor(Math.random() * that.height);
        return [randomX, randomY];
    }
    function helperGenerateRoomSize() {
        var randomWidth = Math.floor(Math.random() * 3) + 2;
        var randomHeight = Math.floor(Math.random() * 3) + 2;
        return [randomWidth, randomHeight];
    }
    function generateRoom() {
        var randomPosition = helperGeneratePosition();
        var x = randomPosition[0];
        var y = randomPosition[1];
        var randomSize = helperGenerateRoomSize();
        var width = randomSize[0];
        var height = randomSize[1];
        if (x + width > that.width || y + height > that.height) {
           // console.log('Rerendering...');
           generateRoom();
        }
        else {
            for (var i = x; i < x + width; i++) {
                for (var j = y; j < y + height; j++) {
                    that.grid[i][j] = 'X';
                }
            }
        }
    }
    for (i = 0; i < rooms; i++) {
        generateRoom()
    }
}

/* MAP METHODS USED BY CRITTER TO TRANSLATE CRITTERS ON MAP */
// Not in use at the moment
Map.prototype.critterLocation = function(type, x, y) {
    console.log('Critter location working')
    console.log(this.grid)
    this.grid[x][y] = type;
}

// Run every time new critter is added to map
// Try to implement this into Critter constructor
// Creates an inventory of 'critters' in the Map instance 
Map.prototype._addCrittersToMap = function(critter) {
    this.critters[critter.type] = critter;
}

// Refreshes grid to reflect new location of critter
Map.prototype._updateGrid = function() {
    console.log(this.grid);
    var critters = this.critters;
    for (var critter in critters) {
        //console.log(critters[critter])
        var x = critters[critter].x;
        var y = critters[critter].y;
        
        this.grid[x][y] = critters[critter].symbol;
    }
}

/* CREATE A CRITTER */
// Use random coordinate generator to generate initial x and y coordinate for critter
function Critter(x, y, type, map) {
    this.map = map;
    this.health = 100;
    this.type = type;
    this.x = x;
    this.y = y;
    this.symbol = 'O';
}
/*  Critter movement
    Reference: Right is +; Down is +
    Run in Critter.prototype.comeAlive
*/
Critter.prototype._moveRight = function() {
    this.x++;
}
Critter.prototype._moveLeft = function() {
    this.x--;
}
Critter.prototype._moveUp = function() {
    this.y--;
}
Critter.prototype._moveDown = function() {
    this.y++;
}

/*
    Generates a random direction for critter to travel
    and moves critter in that direction as long as there is no obstacle.
    Grid is updated with Map method _updateGrid after each move
*/
Critter.prototype.comeAlive = function() {
    console.log(this.type + ' is coming alive');

    this.map._addCrittersToMap(this);
    var that = this;    
    var moves = [
                    this._moveRight.bind(this), 
                    this._moveLeft.bind(this), 
                    this._moveUp.bind(this), 
                    this._moveDown.bind(this)
                ];

    function _generateCoordinateInBound() {

        var random = Math.floor(Math.random() * 4);

        if ((that.x == 0 && random == 1) || (random == 1 && that.map.grid[that.x - 1][that.y] !== '_')) {
            _generateCoordinateInBound();
        }
        else if ((that.x == 9 && random == 0) || (random == 0 && that.map.grid[that.x + 1][that.y] !== '_')) { //  Set random to adjust with map width using Redux and state when transferring to React
            _generateCoordinateInBound();
        }
        else if ((that.y == 0 && random  == 2) || (random == 2 && that.map.grid[that.x][that.y - 1] !== '_')) {
            _generateCoordinateInBound();
        }
        else if ((that.y == 9 && random  == 3) || (random == 3 && that.map.grid[that.x][that.y + 1] !== '_')) {
            _generateCoordinateInBound();
        }
        else {
            var x = that.x;
            var y = that.y;
            _moveCritter(random);
            
             that.map.grid[x][y] = '_';
        }
       
    }

      setInterval(_generateCoordinateInBound, 1000);

    function _moveCritter(func) {
        console.log('from this');
        moves[func]();
        that.map._updateGrid()
    }
}

// Create a function that accepts 2 parameters: type and number
// Randomly spawn on an empty space on the map the given number of types of critter

Map.prototype.spawnCritters = function(type, number) {
    var that = this;
    var critter,
        coordinates,
        x = _getRandomLatitude(),
        y = _getRandomLongitude()
    
    console.log(that)
    function _getRandomLatitude() {
        return Math.floor(Math.random() * that.width);
    }

    function _getRandomLongitude() {
        return Math.floor(Math.random() * that.height);
    }
    // while (this.grid[x][y] !== '_') {
    //     console.log('running')
    //     x = _getRandomLongitude();
    //     y = _getRandomLatitude();
    // }
    function verifyCoordinates() {
        console.log('verifying...')
        var x = _getRandomLatitude();
        var y = _getRandomLongitude();
        console.log(x, y)
        if (that.grid[x][y] !== '_') {
            verifyCoordinates();
        }
        else {
            return new Critter(x, y, type+i, that).comeAlive();
        }
    }

    for (i = 0; i < number; i++) {
        coordinates = verifyCoordinates();

        //new Critter(coordinates[0], coordinates[1], type+i, this).comeAlive();
    }
}

var map1 = new Map(10, 10);
// var firstCritter = new Critter(9, 2, 'firstCritter', map1).comeAlive();

// var critter2 = new Critter(1,1, 'critter2', map1);
// critter2.comeAlive();
map1.generateRooms(5);
map1.spawnCritters('rat', 1);


// Spawns obstacles/rooms


