function Map(width, height) {
    this.width = width;
    this.height = height;
    this.A = {
        x: 0,
        y: 0
    }
    this.B = {
        x: 0,
        y: 0
    }
    this.grid = (function() {
            var arr = [];
            for (i = 0; i < this.width; i++) {
                var row = [];
                for (j = 0; j < this.height; j++) {
                    row.push('_');
                }
                arr.push(row);
            }
            return arr;
        }).apply(this);
}

Map.prototype.start = function(x1, y1) {
    var that = this;
    this.grid.forEach(function(row, y) {
        row.forEach(function(cell, x) {
            if (cell == 'A') {
                console.log(x,y)
                that.grid[x][y] = '_'
            }
        })
    })
    this.grid[x1][y1] = 'A';
    this.A.x = x1;
    this.A.y = y1;
    return this.grid;
}

Map.prototype.end = function(x2, y2) {
    var that = this;
    this.grid.forEach(function(row, y) {
        row.forEach(function(cell, x) {
            if (cell == 'B') {
                that.grid[x, y] = '_';
            }
        })
    })
    this.B.x = x2;
    this.B.y = y2;
    this.grid[x2][y2] = 'B';
    return this.grid;
}

Map.prototype._distance = function(x2, y2) {
    return function(x1, y1) {
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }
};

Map.prototype.cellIsEmpty = function(x, y) {
    if (this.grid[x][y] == '_') {
        return true;
    }
    else {
        return false;
    }
}
// Outer function to provide scope
Map.prototype.calculatePath = function() {
    var arr = [];
    var start = {
        x: this.A.x,
        y: this.A.y
    };   
    var end = {
        x: this.B.x,
        y: this.B.y
    }
    var that = this,
        latest = [];
    /* 
        Queue which retains last 2 previous coordinates
        Used to cache previous coordinates to prevent circular recursion traveling inbetween 2 coordinates
    */
    function latestQueue(item) {
        if (latest.length > 1) {
            latest.shift();
            latest.push(item);
        }
    else {
        latest.push(item);
    }
}
    // Inner recursive function
    function helper(x, y) {
        // Push definite coordinates into array located in outer function
        arr.push([x, y]);
        // Delete later
        if (x == end.x && y == end.y) {
            console.log('Match');
            return 'Match';
        }
        // Curried distance function with destination pre set
        var setEndPoint = that._distance(end.x, end.y);
        // Objects containing array possibilities and current distance from destination
        var D1 = {
            x: x + 1,
            y: y,
            distance: setEndPoint(x + 1, y)
        }
        var D2 = {
            x: x,
            y: y + 1,
            distance: setEndPoint(x, y + 1)
        }
        var D3 = {
            x: x - 1,
            y: y,
            distance: setEndPoint(x - 1, y)
        }
        var D4 = {
            x: x,
            y: y - 1,
            distance: setEndPoint(x, y - 1)
        }
        // Array of objects for different directions
        var directions = [D1, D2, D3, D4]; // Cycle through all 4 directions before deciding which direction

        // Sorting direction by current distance to destination
        directions.sort(function(a, b) {
            return a.distance > b.distance;
        })
        console.log(directions)
        // Loop through all 4 directions and subject to conditions before deciding on which direction to proceed
        for (var d = 0; d < directions.length; d++) {
            var dir = directions[d];

            var a = dir.x;
            var b = dir.y;

            console.log('curr: ' + a, b)

            // Ensure projected coordinates stay on grid
            if (a >= that.width || b >= that.length) {
                continue;
            }
            // Run only if array 'latest' has 2 values. 'latest' is queue of the previous 2 coordinates
            if (latest.length > 1) {
                console.log('latest')
                console.log(latest)
                // If the currently projected coordinates matches the previous location, skip coordinates and proceed to next projection
                if (a == latest[0][0] && b == latest[0][1]) {
                    continue;
                }
            }
            // Proceed if grid cell is empty
            if (that.grid[a][b] == '_') {
                console.log('C')
                latestQueue([a, b])
                helper(a, b);
                break;
            }
            // Return once destination has been reached
            else if (that.grid[a][b] == 'B') {
                 //console.log('C')
                return this.path = arr;
            }
        }

    }
    // Start inner recursive function
    helper(start.x, start.y);
    // Update 'path' property of map
    console.log(arr);
    return this.path = arr;
}

/* Render grid on console
    Draws grid with waypoints entirely mapped out
*/
Map.prototype.drawPath = function() {
    this.calculatePath().forEach(function(coordinate, idx) {
        var x = coordinate[0];
        var y = coordinate[1];
        if (idx !== 0) {
            this.grid[x][y] = 'O';
        }
    }.bind(this))
    console.log(this.grid);
    return this.grid;
}

/* 
    Refresh grid each step
    Shows live action movement from start to destination
    Accepts array argument from Map.prototype.calculatePath
*/
Map.prototype.drawSequentialPath = function(pathArray) {
    var i = 0;
    var that = this;
    function drawStep1() {
        console.log('Hi...')
        i++;
        var x = that.path[i][0];
        var y = that.path[i][1];
        console.log(x, y)
        that.grid[x][y] = 'O';
        console.log(that.grid)
        if (i == that.path.length - 1) {
            clearInterval(startInterval)
    
        }
        
    }
    var startInterval = setInterval(drawStep1, 500)
}

/* RANDOM DUNGEON GENERATOR */

// Generate randomly spaced/sized rooms
// Produces 1 room each execution
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

// Map.prototype.checkOverlap = function(x, y, width, height) {
//     var that = this;
//     console.log('Check overlap');
//     for (var i = x; i < x + width; i++) {
//         for (var j = y; j < y + height; j++) {
//             if (that.grid[i][j] !== '_') {
//                 return false
//             }
//             return true;
//         }
//     }
// }



var map1 = new Map(10, 10);
// Obstacle Insertion
// map1.grid[0][1] = 'X';
// map1.grid[1][1] = 'X';
// map1.grid[2][1] = 'X';
// map1.grid[3][1] = 'X';
// map1.grid[4][1] = 'X';
// map1.grid[5][1] = 'X';
// map1.grid[6][1] = 'X';
// map1.grid[7][1] = 'X';
// map1.grid[8][1] = 'X';

// map1.grid[1][3] = 'X';
// map1.grid[2][3] = 'X';
// map1.grid[3][3] = 'X';
// map1.grid[4][3] = 'X';
// map1.grid[5][3] = 'X';
// map1.grid[6][3] = 'X';
// map1.grid[7][3] = 'X';
// map1.grid[8][3] = 'X';
// map1.grid[9][3] = 'X';

// map1.grid[0][5] = 'X';
// map1.grid[1][5] = 'X';
// map1.grid[2][5] = 'X';
// map1.grid[3][5] = 'X';
// map1.grid[4][5] = 'X';
// map1.grid[5][5] = 'X';
// map1.grid[6][5] = 'X';
// map1.grid[7][5] = 'X';
// map1.grid[8][5] = 'X';

// map1.grid[1][7] = 'X';
// map1.grid[2][7] = 'X';
// map1.grid[3][7] = 'X';
// map1.grid[4][7] = 'X';
// map1.grid[5][7] = 'X';
// map1.grid[6][7] = 'X';
// map1.grid[7][7] = 'X';
// map1.grid[8][7] = 'X';
// map1.grid[9][7] = 'X';

// map1.grid[1][8] = 'X';
// map1.grid[3][9] = 'X';
// map1.grid[5][8] = 'X';
// map1.grid[7][9] = 'X';
// map1.grid[5][3] = 'X';
// map1.grid[6][3] = 'X';
// map1.grid[7][3] = 'X';
// map1.grid[8][3] = 'X';
// map1.grid[9][3] = 'X';


map1.start(0, 0);
map1.end(9,9);
map1.generateRooms();
map1.generateRooms();
map1.generateRooms();

console.log(map1.grid)
map1.calculatePath();
//map1.drawPath();
map1.drawSequentialPath(this.path)
