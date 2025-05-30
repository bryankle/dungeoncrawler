// FEATURES TO IMPLEMENT
// Critter attack
// Critter death

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { storeDamage } from '../actions/store-damage';
//import Hero from '../img/Hero';
import Dungeon from './generateDungeon';
import Hero from '../components/hero';
import Rat from '../components/rat';

import Grass from '../../img/grass.jpg';
import whiteKnight from '../../img/knight-front.png';
import Rock from '../../img/rock.jpg';
import Food from '../../img/food.png';
//import critter from '../../img/pikachu.png';


// IDEAS
// Create a random map generated with rocks and grass with collision data stored in objects
// When spawning character in dungeon, save the center points for each generated room and randomly select from array as initial character spawn point

class Grid extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// charPosition is alwayds mapPosition + 7
			charPosition: [7, 7], // Switch over to charPosition later
			mapPosition: [0,0],
			entireGrid: [], // Can be as large as neccessary
			visibleGrid: [], // Only 15 x 15 is visible in camera view
			mapSize: 150, // Adjust all references to mapSize to height & width later and delete
			height: 150,
			width: 150,
			health: 100,
			cameraSize: 15,
			heroDirection: '',
			critterCount: 0,
			critters: {},
			target: '',
			objectInformation: {
				whiteKnight: {
					solid: true
				},
				_: { // Set to grass temporarily
					solid: false
				},
				GRASS: {
					solid: false
				},
				R: { // Rock
					// Switched to false for testing
					solid: true
				},
				RAT: {
					solid: true
				},
				// FIX
				undefined: {
					solid: false
				},
				POTION: {
					solid: false
				}
			}
		}
	}

	UNSAFE_componentWillMount() {
		// Listen to arrow keys for character movement
		document.addEventListener('keydown', this._handleKeydown.bind(this))

		this.setState({ // Removed this._helperTranspose; add in later if needed
			entireGrid: this.buildMap() //this._createGrid('_', this.state.mapSize, this.state.mapSize)
		})
		
		//this.createCritter(this.state.entireGrid, 'rat', 10, 10);
		// Set critter movement here
	}

	componentDidMount() {
		console.log('componentDidMount');
		const that = this;
		//setInterval(this.eachCritter(that.state.critters, that.moveCritter), 1000)
		// Uncomment below
		// CONTINUE HERE
		// Uncomment this and begin transferring behavior into grid render
		this.heroSpawnPoint();
		
		this._createCritter()
		
		setInterval(() => {
			this.heroTargetCritter(); // Intermittent scans area surrounding critter to target
			this.eachCritter(this.state.critters, this.critterIsAlive);
			this.eachCritter(this.state.critters, this.searchForHero);
		}, 1000)
		setInterval(() => {
			// Scan for critter as long as hero has no current target
			
			this.eachCritter(this.state.critters, this.moveCritter)
		}, 100)
	}

	_handleKeydown(e) {
		if (this.state.health > 0) {
			
			if (e.keyCode == 37) {
			// console.log('Going left...')
			this._moveCharPosition('left');
			}
			else if (e.keyCode == 38) {
				// console.log('Going up...');
				this._moveCharPosition('up');
			}
			else if (e.keyCode == 39) {
				// console.log('Going right...');
				this._moveCharPosition('right');			
			}
			else if (e.keyCode == 40) {
				// console.log('Going down...');
				this._moveCharPosition('down');			
			}
		}
	}

// Render random map and place the array in local state or Redux

// Set character position in center of the map
	// Divide map width and length by 2 and place character on map

// Create an object of different types of map tiles
	// Include image location
	// Include collision data
	// Collision logic
		// Ex: In _moveCharPosition
		// Perform pre render calculation to determine if character's next step is walking into a solid object
		// If true, do not increment/decrement character position
		// If false, perform move

// Character animation walking direction
	// Set latest direction and link it to character sprite walking in that direction in Redux
	// Output character sprite based on last direction walked

// Seperate the logic between grid creation and grid display
	// Create entire grid (whole map) --> determine character camera view of grid --> render view into UI
	_moveCharPosition(direction) {
		// Create copy of map position and char position before manipulating and updating back into state
		let cloneMapPosition = Array.prototype.slice.call(this.state.mapPosition);
		let cloneCharPosition = Array.prototype.slice.call(this.state.charPosition);
		let X = cloneCharPosition[0];
		let Y = cloneCharPosition[1];
		let grid = this.state.entireGrid[X][Y];
		
		let tileType = this.state.entireGrid[X][Y];
		switch(direction) {
			case 'up':
			// Local state array corrected for transposition
				if (cloneMapPosition[1] > 0) {
					Y--;
					// console.log(this.state.entireGrid[Y][X])
					// FIX TEMP TO AVOID AGGRESSIVE RAT GLITCH
					console.log('_HANDLEKEYDOWN')
			console.log(this.state.entireGrid[Y][X])
					if (this._isTileSolid(this.state.entireGrid[Y][X])) {
						break;
					}

					cloneMapPosition[1]--;
					cloneCharPosition[1]--;
					
				}
				this.setState({
					heroDirection: 'up'
				})
				break;
			case 'down':
				if (cloneMapPosition[1] < this.state.mapSize) { // Prevent user from going off grid
					Y++;
					// console.log(this.state.entireGrid[Y][X])			
					// FIX TEMP TO AVOID AGGRESSIVE RAT GLITCH
					console.log('_HANDLEKEYDOWN')
			console.log(this.state.entireGrid[Y][X])
					if (this._isTileSolid(this.state.entireGrid[Y][X])) {
						break;
					}
					cloneMapPosition[1]++;
					cloneCharPosition[1]++;
				}
				this.setState({
					heroDirection: 'down'
				})
				break;
			case 'left':
				if (cloneMapPosition[0] > 0) {
					X--;
					// console.log(this.state.entireGrid[Y][X])
					// FIX TEMP TO AVOID AGGRESSIVE RAT GLITCH
					// console.log('_HANDLEKEYDOWN')
			// console.log(this.state.entireGrid[Y][X])
					if (this._isTileSolid(this.state.entireGrid[Y][X])) {
						break;
					}
					cloneMapPosition[0]--;
					cloneCharPosition[0]--;
				}
				this.setState({
					heroDirection: 'left'
				})
				break;
			case 'right':
				if (cloneMapPosition[0] < this.state.mapSize) {
					X++;
					console.log(this.state.entireGrid[Y][X])
					// FIX TEMP TO AVOID AGGRESSIVE RAT GLITCH
					// console.log('_HANDLEKEYDOWN')
			// console.log(this.state.entireGrid[Y][X])
					if (this._isTileSolid(this.state.entireGrid[Y][X])) {
						break;
					}
					cloneMapPosition[0]++;
					cloneCharPosition[0]++;
				}
				this.setState({
					heroDirection: 'right'
				})
				break;
			default:
				break;
		}

	//	grid[X][Y] = ['_', 'KNIGHT']
		this.setState({
			mapPosition: cloneMapPosition,
			charPosition: cloneCharPosition
		})
	}

	_isTileSolid(tileInformation) {
		if (tileInformation.length == 1) {
			return this.state.objectInformation[tileInformation].solid
		}
		else {
			if (tileInformation.includes('POTION')) {
				return false;
			}
		}
	}

	// Creates initial grid - initiated during componentWillMount
	_createGrid (type, cols, rows) {
		let grid = [],
			tile;
		for (let i = 0; i < cols; i++) {
			let row = [];
			for (let j = 0; j < rows; j++) {
				let random = Math.random();
				// Creates border around map
				// i controls height and j controls width; below set to 8 because glitch if set to 7
				if (i < 7 || j < 7 || i > this.state.mapSize - 8 || j > this.state.mapSize - 7) {
					tile = 'R';
				}
				else {
					// Adjust to generate random obstacles for testing
					// Randomly generate grass or rock on tile
					//tile = random > 0.4 ? '_' : 'R';
					tile = 'R'
				}
				row.push(tile)
			}
			grid.push(row);
		}
		return grid
	}

	// Expected parameters: grid to be manipulated and number of desired rooms
	_generateRooms(grid, rooms) {
		const that = this;
		let roomCenterPoints = [];
		function helperGeneratePosition() {
			// cols & rows will temporarily be substituted for 150 
			let randomX = Math.floor(Math.random() * 150);
			let randomY = Math.floor(Math.random() * 150);
			return [randomX, randomY]
		}
		function helperGenerateRoomSize() {
			let randomWidth = Math.floor(Math.random() * 10) + 5;
			let randomHeight = Math.floor(Math.random() * 10) + 5;
			return [randomWidth, randomHeight];
		}
		function helperFindCenterOfRoom(x, y, w, h) {
			return [Math.floor(x + w / 2), Math.floor(y + h / 2)]
		}
		function generateRoom() {
			console.log('Log generateRoom activity'); // Recursion count
			let randomPosition = helperGeneratePosition();
			let randomSize = helperGenerateRoomSize();
			// console.log('randomPosition:' + randomPosition);
			// console.log('randomSize: ' + randomSize);
			let x = randomPosition[0];
			let y = randomPosition[1];
			let width = randomSize[0];
			let height = randomSize[1];

			// Check if the room fits and if corner points are clear (still 'R')
			// grid is accessed as grid[row_index][column_index]
			// that.state.width is total columns, that.state.height is total rows.
			if (x + width > that.state.width ||      // Room's right edge (exclusive) is beyond total columns
				y + height > that.state.height ||     // Room's bottom edge (exclusive) is beyond total rows
				// Top-left corner of the room to be placed
				grid[y][x] !== 'R' ||
				// Bottom-left corner
				grid[y + height - 1][x] !== 'R' ||
				// Top-right corner
				grid[y][x + width - 1] !== 'R' ||
				// Bottom-right corner
				grid[y + height - 1][x + width - 1] !== 'R'
			) {
				generateRoom();
			}
			else {
				roomCenterPoints.push(helperFindCenterOfRoom(x, y, width, height))
				
				for (let i = x; i < x + width; i++) {
					for (let j = y; j < y + height; j++) {
						grid[i][j] = '_';
					}
				}
			
			}
			grid[8][10] = 'R';
			grid[8][11] = 'R'
			grid[8][12] = 'R'
			grid[8][13] = 'R'
			grid[7][13] = 'R'
		}

		for (let i = 0; i < rooms; i++) {
			generateRoom()
		}

		// Links dungeons together
		// Begins with first dungeon created then sorts by next closest dungeons to minimize overlapping tunnels
		let curriedDrawPath = that._drawPath(grid);
		let paths = that._sortByDistance(roomCenterPoints)
			console.log(paths)
		
			for (let path in paths) {
		
				let start = paths[path].start;
				let sx = start[0];
				let sy = start[1];
				let end = paths[path].end;
				let ex = end[0];
				let ey = end[1];
				grid = curriedDrawPath(sx, sy, ex, ey)
			}

		this.setState({
			roomCenterPoints: paths
		})
		
		return grid;
	}

	// Helper function for generateDungeons; used in _calculatePath
	// Distance formula utilized for calculating dynamically calculating distance from all 
	// potential directions (up, down, left, right) to determine closest path
	_distance(x2, y2) {
		return function(x1, y1) {
			var dx = x2 - x1;
			var dy = y2 - y1;
			return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
		}
	}

	// Helper function for generateDungeons; initiated by _drawPath
	// Path finding algorithm utilized in calculating path from origin to destination
	// Adapted to link rooms together
	_calculatePath(x0, y0, x1, y1) {
		const that = this; // 'this' from Grid component

		// Visited set for the *entire* pathfinding call to avoid cycles across different branches.
		// Stores coordinates as "x,y" strings.
		const visitedOverall = new Set();

		function helper(currentX, currentY, currentPath) {
			const currentPathKey = `${currentX},${currentY}`;

			// Base case: Out of bounds
			if (!(currentX >= 0 && currentX < that.state.width && currentY >= 0 && currentY < that.state.height)) {
				return null;
			}

			// Base case: Already visited this node in this overall search
			if (visitedOverall.has(currentPathKey)) {
				return null;
			}
			visitedOverall.add(currentPathKey);

			// Add current node to a new path copy
			const newPath = [...currentPath, [currentX, currentY]];

			// Base case: Target reached
			if (currentX === x1 && currentY === y1) {
				return newPath;
			}

			let setEndPoint = that._distance(x1, y1); // Creates a function to calculate distance to end
			let directions = [
				{ x: currentX + 1, y: currentY }, // Right
				{ x: currentX - 1, y: currentY }, // Left
				{ x: currentX, y: currentY + 1 }, // Down
				{ x: currentX, y: currentY - 1 }  // Up
			]
			// Add distance to each potential direction
			.map(d => ({ ...d, distance: setEndPoint(d.x, d.y) }))
			// Sort directions by distance (closest first)
			.sort((a, b) => a.distance - b.distance);

			for (const dir of directions) {
				// Recursive call for each valid direction
				const result = helper(dir.x, dir.y, newPath); // Pass the newPath (copy including current node)
				if (result) { // If a path was found by the recursive call
					return result; // Propagate the found path upwards
				}
				// If result is null, this branch was a dead end or loop, try next direction.
			}
			// If the loop completes, no path was found from currentX, currentY with the current sub-path.
			// We don't remove from visitedOverall here because for this specific call of _calculatePath,
			// this node (currentX,currentY) truly led to no solution via any of its children.
			return null; // No path from this node
		}

		// Initial call to the helper function
		const resultPath = helper(x0, y0, []);
		return resultPath || []; // Return the found path, or an empty array if no path was found
	}
	// Helper function for generateRoms; draws paths between each room generated
	_drawPath(grid) {
		var that = this; // 'this' from Grid component
		return function(x0, y0, x1, y1) {
			const pathCoordinates = that._calculatePath(x0, y0, x1, y1);

			if (pathCoordinates.length > 0) { // Check if path is valid and has coordinates
				pathCoordinates.forEach(function(coordinate, idx) {
					let x = coordinate[0];
					let y = coordinate[1];
					// Only draw the "corridor" part of the path, not the start/end points themselves
					if (idx > 0 && idx < pathCoordinates.length - 1) {
					   // Ensure we are within bounds before drawing
					   if (x >= 0 && x < that.state.width && y >= 0 && y < that.state.height) {
							grid[x][y] = '_'; // Path tile
					   }
					}
				});
			}
			return grid;
		}
	}
	// Helper function for generateRooms; links dungeons together by proximity
	_sortByDistance(arr) {
	var that = this;
	var	idx = 0,
		links = {},
		linkNo = 0,
		currCoordinate,
		x, y;
	while (arr.length > 1) {
		var rooms = [];		
		currCoordinate = arr[idx];
		var x0 = currCoordinate[0];
		var y0 = currCoordinate[1];
		arr.splice(idx, 1)
		arr.forEach(function(nextCoordinate, i) {
			var obj = {};
			var x1 = nextCoordinate[0];
			var y1 = nextCoordinate[1];
			obj = {
				'coordinates': [x1, y1],
				'distance': that._distance(x1, y1)(x0, y0)
			}
			rooms.push(obj)
		})
	
		var closestRoom = rooms.sort(function(a, b) {
			return a.distance > b.distance;
		})[0].coordinates
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
	} 
	// End of while loop 
	return links;
}

heroSpawnPoint() {

	let room1 = {};
	room1.x = this.state.roomCenterPoints.link0.start[1]
	room1.y = this.state.roomCenterPoints.link0.start[0];
	console.log(room1.x, room1.y)
	
	this.setState({
		mapPosition: [room1.x - 7, room1.y - 7],
		charPosition: [room1.x, room1.y]
	})
}
// When rat dies, 30% drop rate
_setPotion(x, y) {
	let dropRate = Math.random();
	if (dropRate  < 0.3) {
		// drop
	}
	let grid = Array.prototype.slice.call(this.state.entireGrid);
	
	grid[x][y] = ['POTION', '_'];
	this.setState({
		entireGrid: grid
	})
}

// setInterval to alter direction of critter and setState to update all critter locations. This will force a rerender

// Spawn critter at (10, 10) for now
createCritter(grid, total) {
	let crittersClone = Object.assign({}, this.state.critters);
	let totalCritters = 0;
	function helper(type, x, y, i) {
		let critter = {
			type: type,
			x: x,
			y: y,
			direction: 'down',
			aggressive: true,//Math.random() > 0.5 ? true : false,
			latest: [],
			health: 100
		}
		crittersClone['critter' + totalCritters] = critter;
		totalCritters++;
		let tileUnderCritter = grid[x][y];
		grid[x][y] = ['RAT', tileUnderCritter]
	}
	for (let i = 0; i < total; i++) {
		helper('RAT', 8 + i, 8, i);
	}
	// if (!x && !y) --> generateRandomCoordinates within dungeon
	this.setState({
		critterCount: this.state.critterCount + 1,
		critters: crittersClone
	})
	return grid;
}

_createCritter() {
	let grid = Array.prototype.slice.call(this.state.entireGrid);
	let totalCritters = 0;
		let crittersClone = Object.assign({}, this.state.critters);
	for (let centerPoint in this.state.roomCenterPoints) {
		for (let i = 0; i < 1; i++) {
			helper('RAT', this.state.roomCenterPoints[centerPoint].start[0] + i, this.state.roomCenterPoints[centerPoint].start[1], i);
		}
	}
	console.log('_CREATECRITTER')

	function helper(type, x, y, i) {
		let critter = {
			type: type,
			x: x,
			y: y,
			direction: 'down',
			aggressive: true,//Math.random() > 0.5 ? true : false,
			latest: [],
			health: 100
		}
		crittersClone['critter' + totalCritters] = critter;
		totalCritters++;
		let tileUnderCritter = grid[x][y];
		grid[x][y] = ['RAT', tileUnderCritter]
	}

	
	// if (!x && !y) --> generateRandomCoordinates within dungeon
	this.setState({
		critterCount: totalCritters,
		critters: crittersClone,
		entireGrid: grid
	})
	//return grid;
}
// Take in copy of critters in state and apply callback function
eachCritter = (critters, fn1) => {
	console.log('eachCritter...')
	let updatedCritters = {};
	for (let critter in critters) {
		console.log(critter)
		if (critters[critter]) {
			updatedCritters[critter] = fn1(critters[critter]) // Returns updated object
		}
		// else {
		// 	continue
		// }
		//updatedCritters[critter] = fn1(critters[critter]) // Returns updated object
		// if (critters[critter].health > 0) {
		// 	updatedCritters[critter] = fn1(critters[critter]) // Returns updated object
		// }
	}
	
	this.setState({
		critters: updatedCritters
	})
}
// Accepts critter object and returns an critter object with updated coordinates
// Takes arguments from this.eachCritter1
moveCritter = (critter) => {
	const that = this;
	// console.log('moveCritter...');
	// console.log('charposition');
	// console.log(this.state.charPosition)
	let grid = Array.prototype.slice.call(this.state.entireGrid);
	let cx = critter.x;
	let cy = critter.y;
	// console.log('cx, cy');
	// console.log(cx, cy)
	let hy = that.state.charPosition[0];
	let hx = that.state.charPosition[1];
	// console.log('hx, hy');
	// console.log(hx, hy)

	let coordinateCache = [cx, cy];
	let tileCache = grid[cx][cy][1];
	// Sprite and directions do not correlate
	function _moveRight() {
		// console.log('_moveRight')
		cx++;
		critter.direction = 'down';
	}
	function _moveLeft() {
		// console.log('_moveLeft')
		cx--;
		critter.direction = 'up';
	}
	function _moveUp() {
		// console.log('_moveUp')
		cy--;
		critter.direction = 'right';
	}
	function _moveDown() {
		// console.log('_moveDown')
		cy++;
		critter.direction = 'left';
	}

	let moves = [_moveRight, _moveLeft, _moveUp, _moveDown];

		function _generateCoordinateChase() {
			// Critter will avoid taking the same way back if initial path calculation does not work
			// let latest = [];
			console.log('latest')
			console.log(latest)
			function latestQueue(item) {
				// console.log('latest queue working')
				// console.log(critter.latest)
				if (critter.latest.length == 2) {
					// console.log('LATEST 1')
					critter.latest.shift();
					critter.latest.push(item);
				}
				else {
					// console.log('LATEST 2')
					critter.latest.push(item);
				}
			}

			// console.log('_generateCoordinateChase WORKING')
			function helper(x, y) { // Accepts critter current location
				let distanceToHero = that._distance(hx, hy);
				let D1 = {
					x: x + 1,
					y: y,
					move: _moveRight,
					distance: distanceToHero(x + 1, y)
				}
				let D2 = {
					x: x,
					y: y + 1,
					move: _moveUp,
					distance: distanceToHero(x, y + 1)
				}
				let D3 = {
					x: x - 1,
					y: y,
					move: _moveLeft,
					distance: distanceToHero(x - 1, y)
				}
				let D4 = {
					x: x,
					y: y - 1,
					move: _moveDown,
					distance: distanceToHero(x, y - 1)
				}
				let directions = [D1, D2, D3, D4];
				// console.log(directions)
				directions.sort(function(a, b) {
					return a.distance > b.distance;
				})
				//  If critter is 1 square away from hero in any of 8 surrounding directions; do not move
				if (
					// Left and right of critter
					!((cx - 1 == hx && cy == hy) ||
					(cx + 1 == hx && cy == hy) ||
					// Top of critter
					(cx + 1 == hx && cy + 1 == hy) ||
					(cx == hx && cy + 1 == hy) ||
					(cx - 1 == hx && cy + 1 == hy) ||
					// Bottom of critter
					(cx + 1 == hx && cy - 1 == hy) ||
					(cx == hx && cy - 1 == hy) ||
					(cx - 1 == hx && cy - 1 == hy))
				) {
					for (let d = 0; d < directions.length; d++) {
						let dir = directions[d];
						let dx = dir.x
						let dy = dir.y
					
						// that.state.objectInformation[that.state.entireGrid[dx][dy]].solid
						// FIX
						if (that.state.entireGrid[dx][dy] !== '_' || dx == hx && dy == hy) {
							continue;
						}
						// Implement at a later time - dead lock critter
						// Feature: critter will permanently target hero until it dies regardless proximity to hero on map
						if (critter.latest.length > 1) {
						
							// If the currently projected coordinates matches the previous location, skip coordinates and proceed to next projection
							if (dx == critter.latest[0][0] && dy == critter.latest[0][1]) {
								continue;
							}
						}
						// If critter is trapped and all potential directions are exhausted; do nothing
						// FIX TOOK OUT ELSE
						dir.move();
							critter.x = dx;
							critter.y = dy;
							latestQueue([dx, dy])
							break;
					}	
				}
				
			}
			helper(cx, cy)
		}
	
	 	function _generateCoordinateRandom() {
			let random = Math.floor(Math.random() * 4);
			// Tests to ensure direction generated from variable 'random' will not collide with any solid objects
			// Collision avoidance to avoid solid objects and hero
			// console.log('direction');
			// If critter moves up and object north of critter is solid, generate another random direction
			// If going up
			if (random === 2 && (that.state.objectInformation[that.state.entireGrid[cx][cy - 1]].solid || (cx == hx && cy - 1 == hy))) {
				// console.log('random: 2')
				// console.log(cx, cy - 1)
				_generateCoordinateRandom();
			}
			// If critter moves down and object south of critter is solid, generate another random direction
			// If going down
			else if (random === 3 && (that.state.objectInformation[that.state.entireGrid[cx][cy + 1]].solid || (cx == hx && cy + 1 == hy))) {
				// console.log('random: 3')
				// console.log(cx, cy + 1)
		
				_generateCoordinateRandom();
			}
			// If critter moves left and object west of critter is solid, generate another random direction
			// If going left
			else if (random === 1 && (that.state.objectInformation[that.state.entireGrid[cx - 1][cy]].solid || (cx - 1 == hx && cy == hy))) {
				// console.log('random: 1')
				// console.log(cx - 1, cy)
				_generateCoordinateRandom();
			}
			// If critter moves right and object right of critter is solid, generate another random direction
			// If going right
			else if (random === 0 && (that.state.objectInformation[that.state.entireGrid[cx + 1][cy]].solid || (cx + 1 == hx && cy == hy))) {
				// console.log('random: 0')
				// console.log(cx + 1, cy)
			
				_generateCoordinateRandom();
			}
		// Continue
			else {
				// Directions to not match sprite
				// Execute move
				moves[random]();
			}
			critter.x = cx;
			critter.y = cy;
			// console.log(critter)
	}
	if (!critter.aggressive) {
		_generateCoordinateRandom()
	}
	else if (critter.aggressive) {
		_generateCoordinateChase();
	}
	this.renderCritter(critter, coordinateCache, tileCache)
	return critter
}

// Attacking critter mechanism
heroTargetCritter() {

	let surroundingCoordinates = [
			[this.state.charPosition[0] - 1, this.state.charPosition[1] - 1],
			[this.state.charPosition[0]    , this.state.charPosition[1] - 1],
			[this.state.charPosition[0] + 1, this.state.charPosition[1] - 1],
			[this.state.charPosition[0] - 1, this.state.charPosition[1]    ],
			[this.state.charPosition[0] + 1, this.state.charPosition[1]    ],
			[this.state.charPosition[0] - 1, this.state.charPosition[1] + 1],
			[this.state.charPosition[0]    , this.state.charPosition[1] + 1],
			[this.state.charPosition[0] + 1, this.state.charPosition[1] + 1]
		];

		function checkSurrounding() {
			for (let i = 0; i < surroundingCoordinates.length; i++) {
				if (surroundingCoordinates[i].includes('RAT')) {
					return true;
				}
			}
			return false;
		}

	// If hero currently has a critter targetted, find the coordinates of that specific critter and continue attacking it until it dies
	// Resume search if critter has been killed

	if (this.state.target !== '') {
		let thisCritter = this.state.target.slice(0);
		let x = this.state.critters[thisCritter].x;
		let y = this.state.critters[thisCritter].y;
		this.attackCritter(this.findCritter(x, y))
	}
	else {
		// console.log('HEROTARGETCRITTER TESTING')
		// console.log(this.state.charPosition)
		// FIXED
		let cx = this.state.charPosition[0];
		let cy = this.state.charPosition[1];
		// console.log(cx, cy)
		// let surroundingCoordinates = [
		// 	[this.state.charPosition[0] - 1, this.state.charPosition[1] - 1],
		// 	[this.state.charPosition[0]    , this.state.charPosition[1] - 1],
		// 	[this.state.charPosition[0] + 1, this.state.charPosition[1] - 1],
		// 	[this.state.charPosition[0] - 1, this.state.charPosition[1]    ],
		// 	[this.state.charPosition[0] + 1, this.state.charPosition[1]    ],
		// 	[this.state.charPosition[0] - 1, this.state.charPosition[1] + 1],
		// 	[this.state.charPosition[0]    , this.state.charPosition[1] + 1],
		// 	[this.state.charPosition[0] + 1, this.state.charPosition[1] + 1]
		// ]

		surroundingCoordinates.forEach((coordinate) => {
			// console.log('SURROUNDING COORDINATES');
			// console.log(this.state)
			let y = coordinate[0];
			let x = coordinate[1];
			// console.log(this.state.entireGrid[x][y])
			if (this.state.entireGrid[x][y].includes('RAT')) {
				// console.log('INCLUDES RAT')
				// console.log(this.state.entireGrid[x][y])
				this.attackCritter(this.findCritter(x, y))
				this.setState({
					target: this.findCritter(x, y) // Returns specific critter
				})
				// console.log(this.state)
			}
			else {
				// console.log('no target detected')
				this.setState({
					target: ''
				})
			}
		})
	}
}

// Critter dealing damage to hero
// Will be initiated in componentDidMount in setInterval by function 'eachCritter'
// Accepts critter argument
// Extract x and y coordinates from critter object and conduct a perimeter scan (4 directions) for hero, if true, then attack, if false, then do nothing
searchForHero = (critter) => {
	// console.log('Attacking hero....');
	// console.log(this)
	// let damage = Math.floor(Math.random() * 5); // Deals random damage from 0 - 5
	// let x = critter.x;
	// let y = critter.y;
	// How to record previous critter coordinate?
	// Creating another property in each individual critter's object in state information
	// If critter has stopped moving
	// Run scan on surrounding coordinates to search for hero
	
	// Using previously created 'latest' property in critter object to determine if critter moved (latest was used in path finding algorthm to avoid repetitive steps)


	// console.log('LATEST CRITTER ARRAY TEST');

	let surroundingCoordinates = [
			[critter.x - 1, critter.y - 1],
			[critter.x    , critter.y - 1],
			[critter.x + 1, critter.y - 1],
			[critter.x - 1, critter.y    ],
			[critter.x + 1, critter.y    ],
			[critter.x - 1, critter.y + 1],
			[critter.x    , critter.y + 1],
			[critter.x + 1, critter.y + 1]
		];
	// console.log('surroundingCoordinates')
	// console.log(surroundingCoordinates)
	// Why can't 'this' be scoped here?
	surroundingCoordinates.forEach((direction) => {
		// console.log(this)
		// console.log('LEWL')
		// console.log(direction)
		let x = direction[0];
		let y = direction[1];
		if (x == this.state.charPosition[1] && y == this.state.charPosition[0]) {
			// console.log('Hero detected')
			this.attackHero();
		}
	})
	

	// Ignore hero if hero is dead
	if (this.state.health < 0) {
		critter.aggressive = false;
	}

	// Methods of detecting presence of hero
	// 1. Constantly scanning perimeter for presence of hero
	// 2. Detect lack of critter movement and assume that critter has found the hero
	// OR
	// 3. If critter has ceased movement, perform a single scan to see if hero is in vicinity before attacking
	

	// console.log('Attacking hero...')
	// console.log(critter)
	return critter;
}

attackHero() {
	let damage = Math.floor(Math.random() * 5);
	this.setState({
		health: this.state.health - damage
	})
}



// Function for attacking critter
// Accepts specific critter in state and returns updated 'critters' state object to reflect inflicted damage
// updateCritters(critterName, critterObject) {
// 	let crittersClone = Object.assign({}, this.state.critters);
// 	crittersClone[crittersName] = critterObject;
// 	this.setState({
// 		critters: crittersClone
// 	})
// }

attackCritter(critter) {
	if (this.state.health > 0) {
		// console.log('CURRENTLY ATTACKING CRITTER')
		// Generate damage between 0 - 10
		let damage = Math.floor(Math.random() * 20);
		this.props.storeDamage(damage) // Sends most recent inflicted damage to Redux store for display
		// Insert Redux method to take damage and send to store
		let crittersClone = Object.assign({}, this.state.critters);
		crittersClone[critter].health = crittersClone[critter].health - damage;
		this.setState({
			critters: crittersClone
		})
	}
}

critterIsAlive = (critter) => {
	// console.log('critterIsAlive');
	// If critter is alive, return critter object to state
	if (critter.health >= 0) {
		return critter;
	}
	else if (critter.health < 0) {
		// console.log('CRITTER JUST DIED')
		let x = critter.x;
		let y = critter.y;
		// console.log('CRITTER DIED AT: ' + x + ' ' + y)
		// console.log(this.state)
		let grid = Array.prototype.slice.call(this.state.entireGrid);
		grid[x][y] = '_';
		// Insert potion spawn
		// Feed in x and y into potion spawn function
		// if (this.critter.health < 0) {
		// //	this._setPotion(critter.x, critter.y)
		// }
		this._setPotion(critter.x, critter.y)
		this.setState({
			target: '',
			entireGrid: grid
		})
		return 
	}
}

// Function for removing critter from grid
// 

// Function to identify critter in 'critters' object given x and y coordinate on grid;
findCritter(x, y) {
	for (let critter in this.state.critters) {
		if (this.state.critters[critter].x == x && this.state.critters[critter].y == y) {
			return critter
		}
	}
}

renderCritter(critter, prevCoordinates, prevTile) {
	console.log('mapPosition');
	console.log(this.state.mapPosition)
	let px = prevCoordinates[0];
	let py = prevCoordinates[1];
	let cx = critter.x;
	let cy = critter.y;
	
	// console.log('render critter')
	// console.log(prevTile)
	let grid = Array.prototype.slice.call(this.state.entireGrid);
	// Required to avoid rendering issues when critter is within hero's immediate proximity (8 tiles surrounding hero)
	if (!(grid[cx][cy].length > 1)) {
		let tileUnderCritter = grid[cx][cy];
		grid[px][py] = prevTile;
		grid[cx][cy] = ['RAT', tileUnderCritter];
	}
	this.setState({
		entireGrid: grid
	})
}

// Must reflect critters on state grid at all times

	buildMap() {
		var that = this;
		let grid = this._helperTranspose(this._createGrid('_', this.state.mapSize, this.state.mapSize));
		grid = this._generateRooms(grid, 13)
		// Set initial critters here
		// Reasoning for placing critter creation here: when placing in componentWillMount, grid updates on state later than critter creation
		//grid = this.createCritter(grid, 5);
		// function critterWrapper() {
		// 	this.createCritter(grid, 'rat', 8, 8);
		// }
		 
		return grid;
	}

	// Transpose array to convert grid to true [x][y]
	_helperTranspose(a) {
		return Object.keys(a[0]).map(function(c) {
			return a.map(function(r) { return r[c]; });
		})
	}

	// cameraGrid accepts an array (this.state.grid) and translates into player's camera screen
	cameraGrid (grid) {
		// get camera position from state
		const position = this.state.mapPosition; // Adjust everything to mapPosition later on
		const x = position[0];
		const y = position[1];

		let gridView = [];
		for (let i = y; i < y + this.state.cameraSize; i++) {
			let row = [];
			// Temporary switched to 20 to widen camera view
			for (let j = x; j < x + this.state.cameraSize; j++) {
				row.push(grid[i][j])
			}
			gridView.push(row);
		}
		let center = this.state.cameraSize / 2;
		// Change 10 to Math.floor(center) later
		let tileUnderKnight = gridView[Math.floor(center)][Math.floor(center)];
	
		//gridView[Math.floor(center)][Math.floor(center)] = 'KNIGHT' // ORIGINAL SETTINGS; also go to style.css and remove position: absolute
		gridView[Math.floor(center)][Math.floor(center)] = ['KNIGHT', tileUnderKnight]//gridView[Math.floor(center)][Math.floor(center)].concat(', KNIGHT')
		
		console.log(gridView[Math.floor(center)])
		console.log(Math.floor(center));
		console.log(this.state.charPosition[0])
		return gridView;
	}

	// renderGrid accepts an array (cameraGrid) and translates the array into tile sprites
	renderGrid(grid) {
		let renderGrid = [];
		const that = this;
		grid.forEach(function(row, idx1) {
			let renderRow = [];
			row.forEach(function(tile, idx2) {
				// Special case render if knight is on top of a tile
				if (Array.isArray(tile)) {
					tile.forEach(function(type) {
						switch(type) {
							case '_':
								renderRow.push(<img src={Grass} />)
								break;
							case 'GRASS':
								renderRow.push(<img src={Grass} />)
								break;
							case 'KNIGHT':
								renderRow.push(
									<Hero 
										direction={that.state.heroDirection ? that.state.heroDirection : 'down'}
										health={that.state.health}
									/>) // Default position front facing on initial load
								break;
							case 'R':
								renderRow.push(<img src={Rock} />)
								break;
							case 'RAT':
								let critters = that.state.critters;
								
								for (let critter in critters) {
									if (critters[critter]) {
											// console.log(critters[critter].health)
										if (critters[critter].x == (idx1 + that.state.mapPosition[1]) && critters[critter].y == (idx2 + that.state.mapPosition[0])) {
											renderRow.push(
												<Rat 
													direction={critters[critter].direction}
													health={critters[critter].health}
												/>
											)
										}
									}
								}
								break;
								case 'POTION':
									renderRow.push(<img
									className='whiteKnight' 
									src={Food} />)
								break;
								// for (let i = 0; i < Object.keys(that.state.critters).length; i++){
								// 	var thisCritter = that.state.critters['critter' + i];
								// 	if (thisCritter.x == (idx1 + that.state.mapPosition[1]) && thisCritter.y == (idx2 + that.state.mapPosition[0])) {
								// 		renderRow.push(<Rat direction={thisCritter.direction}/>)
								// 	}
									console.log('this critters')
									console.log(thisCritter.x, thisCritter.y);
								// 	console.log('this map position')
								// 	console.log(that.state.mapPosition)
								// 	console.log('this index');
								// 	console.log(idx1, idx2)
									
								// 	// (function(num) {
								// 	// 	renderRow.push(<Rat direction={that.state.critters['critter' + num].direction}/>)
								// 	// })(i)
								// }
							default:
								break;
							
						}
					})
				}
				// Regular case - render tile normally
				switch(tile) {
					case '_':
						renderRow.push(<img src={Grass} />)
						break;
					case 'GRASS':
						renderRow.push(<img src={Grass} />)
						break;
					case 'KNIGHT':
						renderRow.push(<Hero />)
						break;
					case 'R':
						renderRow.push(<img src={Rock} />)
						break;
					default:
						break;
					
				}
			})
			
			renderGrid.push(<div>{renderRow}</div>)
		}) 
		return renderGrid;
	}

	render() {
		// TESTING
		
		console.log("TESTING!!!!!!!!!!!!!!!!!!!!!!!")
		console.log(this.state.critters);
		return(
			<div>
				<div className="grid">{this.renderGrid(this.cameraGrid(this.state.entireGrid))}</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
    return {
        grid: state.grid,
		damage: state.damage
    }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({storeDamage}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);

//	{this.renderGrid(this.cameraGrid(this.createGrid('GRASS', this.state.mapSize, this.state.mapSize)))}