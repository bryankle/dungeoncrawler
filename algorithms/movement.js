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

Map.prototype.generateRooms = function() {
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
    generateRoom()
}

Map.prototype.checkOverlap = function(x, y, width, height) {
    var that = this;
    console.log('Check overlap');
    console.log(this.grid)
    for (var i = x; i < x + width; i++) {
        for (var j = y; j < y + height; j++) {
            if (that.grid[i][j] !== '_') {
                return false
            }
            return true;
        }
    }
}









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

Critter.prototype.comeAlive = function() {
    console.log('Coming alive');

    var that = this;    
    var moves = [
                    this._moveRight.bind(this), 
                    this._moveLeft.bind(this), 
                    this._moveUp.bind(this), 
                    this._moveDown.bind(this)
                ];
   
    function generateCoordinateInBound() {

        var random = Math.floor(Math.random() * 4);

        if ((that.x == 0 && random == 1) || (random == 1 && map.grid[that.x - 1][that.y] !== '_')) {
            generateCoordinateInBound();
        }
        else if ((that.x == 9 && random == 0) || (random == 0 && map.grid[that.x + 1][that.y] !== '_')) { //  Set random to adjust with map width using Redux and state when transferring to React
            generateCoordinateInBound();
        }
        else if ((that.y == 0 && random  == 2) || (random == 2 && map.grid[that.x][that.y - 1] !== '_')) {
            generateCoordinateInBound();
        }
        else if ((that.y == 9 && random  == 3) || (random == 3 && map.grid[that.x][that.y + 1] !== '_')) {
            generateCoordinateInBound();
        }
        else {
            var x = that.x;
            var y = that.y;
            moveCritter(random);
            
             map.grid[x][y] = '_';
            //console.log('after moveCritter')
        }
       //console.log(that.x, that.y);
       
    }
   // generateCoordinateInBound()

      setInterval(generateCoordinateInBound, 1000);

    function moveCritter(func) {
        console.log('from this');

        moves[func]();
        console.log('MAP');
        map.updateGrid()
    }

    //moves[1] // Temporarily removed; probably for testing
    console.log('Current position - x: ' + this.x + ' y: ' + this.y)
}

// Find out how to place critter on grid of map instance
Map.prototype.critterLocation = function(type, x, y) {
    console.log('Critter location working')
    console.log(this.grid)
    this.grid[x][y] = type;
}

// Run every time new critter is added to map
Map.prototype.addCrittersToMap = function(critter) {
    this.critters[critter.type] = critter;
}

// Refreshes grid to reflect new location of critter
Map.prototype.updateGrid = function() {
    console.log(this.grid);
    var critters = this.critters;
    for (var critter in critters) {
        //console.log(critters[critter])
        var x = critters[critter].x;
        var y = critters[critter].y;
        
        this.grid[x][y] = critters[critter].symbol;

    }
    //console.log(this)
}

var map = new Map(10, 10);
var firstCritter = new Critter(9, 2, 'firstCritter');
firstCritter.comeAlive();
map.addCrittersToMap(firstCritter);

// var secondCritter = new Critter(1, 1, 'secondCritter');
// secondCritter.comeAlive();
// map.addCrittersToMap(secondCritter);

// var thirdCritter = new Critter(1, 9, 'thirdCritter');
// thirdCritter.comeAlive();
// map.addCrittersToMap(thirdCritter);

// var fourthCritter = new Critter(9, 1, 'fourthCritter');
// fourthCritter.comeAlive();
// map.addCrittersToMap(fourthCritter);

// var fifthCritter = new Critter(9, 4, 'fifthCritter');
// fifthCritter.comeAlive();
// map.addCrittersToMap(fifthCritter);

// var sixthCritter = new Critter(9, 3, 'sixthCritter');
// sixthCritter.comeAlive();
// map.addCrittersToMap(sixthCritter);

map.updateGrid(); // Places critter on map before spawning obstacles

// Spawns obstacles/rooms
map.generateRooms();
map.generateRooms();
map.generateRooms();
//map.critter(5,5); // Places an 'O' on coordinate [5, 5]
//map.critterLocation('0', 2, 2) // Places 'O' on coordinate [2,2]

//console.log(firstCritter.comeAlive());

// Update map every second
// Initial render of all critters and obstacles before setInterval is responsible for updating grid
map.updateGrid();

