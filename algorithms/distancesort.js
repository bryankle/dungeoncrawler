var arr = [
    [123,15],
    [67,21],
    [2,109],
    [33, 12],
    [90, 42]
]

var links = {
    path1: {
        start: [],
        end: []
    }
}

function distance(x2, y2) {
    return function(x1, y1) {
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }
};

// console.log(arr);
// console.log(distance(arr[0][0], arr[0][1])(arr[1][0], arr[1][1]))


function sortByDistance(arr) {
    //var obj = {},
    var    idx = 0,
        //rooms = [],
        links = {},
        linkNo = 0,
        currCoordinate,
        x, y;
    while (arr.length > 1) {
        var rooms = [];       
        currCoordinate = arr[idx];
        x0 = currCoordinate[0];
        y0 = currCoordinate[1];
        arr.splice(idx, 1)
        arr.forEach(function(nextCoordinate, i) {
            var obj = {};
            var x1 = nextCoordinate[0];
            var y1 = nextCoordinate[1];

            //obj['room' + i]['coordinates'] = [x1, y1];
            obj = {
                'coordinates': [x1, y1],
                'distance': distance(x1, y1)(x0, y0)
            }
            //console.log(obj)
            rooms.push(obj)
            //dist.push(distance(x1, y1)(x0, y0));
        })


        var closestRoom = rooms.sort(function(a, b) {
            return a.distance > b.distance;
        })[0].coordinates
        console.log('currentRoom: ' + x0, y0);
        console.log('closestRoom: ' + closestRoom);
        console.log(arr)
        links['link'+linkNo] = {
            start: [x0, y0],
            end: closestRoom
        }
        linkNo++;
        // Updates idx number for next iteration
        arr.forEach(function(subArray, i) {
            var sx = subArray[0];
            var sy = subArray[1];
            var cx = closestRoom[0];
            var cy = closestRoom[1];
            console.log(sx, sy);
            if (sx == cx && sy == cy) {
                //console.log(idx)
                //return arr.splice(idx, 1);
                idx = i;
            }
        })
        // /console.log(rooms);
    } // WHILE LOOP ENDS
    console.log(links)
    return links;
}

sortByDistance(arr)
