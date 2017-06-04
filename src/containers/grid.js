import React, { Component } from 'react';
import { connect } from 'react-redux';
//import Hero from '../img/Hero';
import Dungeon from './generateDungeon';
import Hero from '../components/hero';
import Rat from '../components/rat';

import Grass from '../../img/grass.jpg';
import whiteKnight from '../../img/knight-front.png';
import Rock from '../../img/rock.jpg';
//import critter from '../../img/pikachu.png';


// IDEAS
// Create a random map generated with rocks and grass with collision data stored in objects
// When spawning character in dungeon, save the center points for each generated room and randomly select from array as initial character spawn point

const renderGrass = <img src={Grass} />

class Grid extends Component {
	constructor(props) {
		super(props)
		this.state = {
			charPosition: [7, 7], // Switch over to charPosition later
			mapPosition: [0, 0],
			entireGrid: [], // Can be as large as neccessary
			visibleGrid: [], // Only 15 x 15 is visible in camera view
			mapSize: 150, // Adjust all references to mapSize to height & width later and delete
			height: 150,
			width: 150,
			cameraSize: 15,
			heroDirection: '',
			critterCount: 0,
			critters: {},
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
					solid: false
				},

			}
		}
	}

	componentWillMount() {
		// Listen to arrow keys for character movement
		document.addEventListener('keydown', this._handleKeydown.bind(this))
		this.setState({ // Removed this._helperTranspose; add in later if needed
			entireGrid: this.buildMap() //this._createGrid('_', this.state.mapSize, this.state.mapSize)
		})
		//this.createCritter(this.state.entireGrid, 'rat', 10, 10);
		// Set critter movement here
	}

	_handleKeydown(e) {
		if (e.keyCode == 37) {
			console.log('Going left...')
			this._moveCharPosition('left');
		}
		else if (e.keyCode == 38) {
			console.log('Going up...');
			this._moveCharPosition('up');
		}
		else if (e.keyCode == 39) {
			console.log('Going right...');
			this._moveCharPosition('right');			
		}
		else if (e.keyCode == 40) {
			console.log('Going down...');
			this._moveCharPosition('down');			
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
		
		let tileType = this.state.entireGrid[X][Y];
		console.log(this.state.objectInformation[tileType].solid)
		switch(direction) {
			case 'up':
			// Local state array corrected for transposition
				if (cloneMapPosition[1] > 0) {
					Y--;
					if (this.state.objectInformation[this.state.entireGrid[Y][X]].solid) {
						break;
					}
					else {
						cloneMapPosition[1]--;
						cloneCharPosition[1]--;
					}
				}
				this.setState({
					heroDirection: 'up'
				})
				break;
			case 'down':
				if (cloneMapPosition[1] < this.state.mapSize) { // Prevent user from going off grid
					Y++;			
					if (this.state.objectInformation[this.state.entireGrid[Y][X]].solid) {
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
					if (this.state.objectInformation[this.state.entireGrid[Y][X]].solid) {
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
					if (this.state.objectInformation[this.state.entireGrid[Y][X]].solid) {
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
		this.setState({
			mapPosition: cloneMapPosition,
			charPosition: cloneCharPosition
		})
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
					tile = '_'
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
			// console.log('Log generateRoom activity'); // Recursion count
			let randomPosition = helperGeneratePosition();
			let randomSize = helperGenerateRoomSize();
			console.log('randomPosition:' + randomPosition);
			console.log('randomSize: ' + randomSize);
			let x = randomPosition[0];
			let y = randomPosition[1];
			let width = randomSize[0];
			let height = randomSize[1];

			
			
			if (x + width > that.state.width - 1 || // Added -1 to width and height to determine if generateRoom error still occurs
				y + height > that.state.height - 1 ||// Added -1 to width and height to determine if generateRoom error still occurs
				grid[x][y] !== '_' ||
				grid[x][y + height] !== '_' ||
				grid[x + width][y] !== '_' ||
				grid[y + width][y + height] !== '_'
				) {
				generateRoom();
			}
			else {

				roomCenterPoints.push(helperFindCenterOfRoom(x, y, width, height))
				
				for (let i = x; i < x + width; i++) {
					for (let j = y; j < y + height; j++) {
						grid[i][j] = 'R';
					}
				}
			}
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
		const that = this;
		let arr = [];
		let start = {
			x: x0,
			y: y0
		}
		let end = {
			x: x1,
			y: y1
		}		
		function helper(x, y) {
			arr.push([x, y]);

			let setEndPoint = that._distance(end.x, end.y);
			let D1 = {
				x: x + 1,
				y: y,
				distance: setEndPoint(x + 1, y)
			}
			let D2 = {
				x: x,
				y: y + 1,
				distance: setEndPoint(x, y + 1)
			}
			let D3 = {
				x: x - 1,
				y: y,
				distance: setEndPoint(x - 1, y)
			}
			let D4 = {
				x: x,
				y: y - 1,
				distance: setEndPoint(x, y - 1)
			}
			// Array of objects for 4 directions
			let directions = [D1, D2, D3, D4];
			// Sort directions by closest distance to furthest distance
			directions.sort(function(a, b) {
				return a.distance > b.distance;
			});
			// Loop through all 4 directions subject to conditions and decides on final direction to take
			for (let d = 0; d < directions.length; d++) {
				let dir = directions[d];
			// Ensures projected coordinates stay on grid
				if (dir.x >= that.width || dir.y >= that.length) {
					continue;
				}
				else if (dir.x == end.x && dir.y == end.y) {
					return arr;
				}
				helper (dir.x, dir.y);
				break;
			}
		}
		helper(start.x, start.y);
		
		
		return arr;
	}
	// Helper function for generateRoms; draws paths between each room generated
	_drawPath(grid) {
		var that = this;
		
		return function(x0, y0, x1, y1) {
			that._calculatePath(x0, y0, x1, y1).forEach(function(coordinate, idx) {
				let x = coordinate[0];
				let y = coordinate[1];
				if (idx !== 0) {
					grid[x][y] = 'R' // Changed from X to R for testing
				}
			})
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
	} 
	// End of while loop 
	return links;
}
// setInterval to alter direction of critter and setState to update all critter locations. This will force a rerender

// Spawn critter at (10, 10) for now
createCritter(grid, type, x, y) {
	let crittersClone = Object.assign({}, this.state.critters);
	let critter = {
		type: type,
		x: x,
		y: y
	}
	let tileUnderCritter = grid[x][y];
	grid[x][y] = ['RAT', tileUnderCritter]
	//grid[x][y] = 'R'
	console.log('grid content at ' + x + ' and ' + y);
	console.log(grid[x][y])
	crittersClone['critter' + this.state.critterCount] = critter;
	this.setState({
		critterCount: this.state.critterCount + 1,
		critters: crittersClone
	})
	return grid;
}
// Take in copy of critters in state and apply callback function
eachCritter(critters, fn) {
	for (critter in critters) {
	
	}
}
// Accepts an array and returns an updated array
// Input: [x, y]
moveCritter(critter) {
	let x = critter[0];
	let y = critter[1];
	function _moveRight() {
		
	}
	function _moveLeft() {

	}
	function _moveUp() {

	}
	function _moveDown() {

	}
	let moves = [_moveRight(), _moveLeft(), _moveUp(), _moveDown()];
	
	function _generateCoordinateInBound() {
		let random = Math.floor(Math.random() * 4);
	// Continue
	}

	return [x, y]
}


	/*
		How critters will be represented in state
		critters = {
			critter1: {
				type: type, // Use type to represent in grid
				this.x = x,
				this.y = y,
				
			}
		}
	*/






	buildMap() {
		var that = this;
		let grid = this._createGrid('_', this.state.mapSize, this.state.mapSize);
		grid = this._generateRooms(grid, 13)
		// Set initial critters here
		grid = this.createCritter(grid, 'rat', 10, 10);
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
		console.log('tileUnderKnight')
		console.log(tileUnderKnight)
	
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
		grid.forEach(function(row) {
			let renderRow = [];
			row.forEach(function(tile) {
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
								renderRow.push(<Hero direction={that.state.heroDirection ? that.state.heroDirection : 'down'}/>) // Default position front facing on initial load
								break;
							case 'R':
								renderRow.push(<img src={Rock} />)
								break;
							case 'RAT':
								renderRow.push(<Rat direction={that.state.heroDirection ? that.state.heroDirection : 'down'}/>)
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
		console.log('this.state.critters')
		console.log(this.state.critters)
		console.log('this.state.critterCount')
		console.log(this.state.critterCount)

		console.log(this.state.entireGrid)
		return(
			<div>
				<div className="grid">{this.renderGrid(this.cameraGrid(this.state.entireGrid))}</div>
			</div>
		)
	}
}
function mapStateToProps(state) {
    return {
        grid: state.grid
    }
}

export default connect(mapStateToProps)(Grid);

//	{this.renderGrid(this.cameraGrid(this.createGrid('GRASS', this.state.mapSize, this.state.mapSize)))}