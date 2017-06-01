import React, { Component } from 'react';
import { connect } from 'react-redux';
//import Hero from '../img/Hero';
import Dungeon from './generateDungeon';

import Grass from '../../img/grass.jpg';
import whiteKnight from '../../img/knight-front.png';
import Rock from '../../img/rock.jpg';


// IDEAS
// Create a random map generated with rocks and grass with collision data stored in objects
// When spawning character in dungeon, save the center points for each generated room and randomly select from array as initial character spawn point

const renderGrass = <img src={Grass} />

class Grid extends Component {
	constructor(props) {
		super(props)
		this.state = {
			charPosition: [7, 7], // Switch over to charPosition later
			mapPosition: [0, 0], // Not in use at the moment
			entireGrid: [], // Can be as large as neccessary
			visibleGrid: [], // Only 15 x 15 is visible in camera view
			mapSize: 150, // Adjust all references to mapSize to height & width later and delete
			height: 150,
			width: 150,
			rooms: [],
			cameraSize: 15,
			objectInformation: {
				whiteKnight: {
					solid: true
				},
				_: {
					solid: false
				},
				GRASS: {
					solid: false
				},
				R: { // Rock
					solid: true
				}
			}
		}
	}

	componentWillMount() {
		document.addEventListener('keydown', this._handleKeydown.bind(this))
		this.setState({
			entireGrid: this._helperTranspose(this._createGrid('_', this.state.mapSize, this.state.mapSize))
		})
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
				if (i < 7 || j < 7 || i > this.state.mapSize - 7 || j > this.state.mapSize - 8) {
					tile = 'R';
				}
				else {
					// Randomly generate grass or rock on tile
				tile = random > 0.4 ? '_' : 'R';
				//	tile = '_'
				}
				row.push(tile)
			}
			grid.push(row);
		}
		return grid
	}

	_distance(x2, y2) {
		return function(x1, y1) {
			var dx = x2 - x1;
			var dy = y2 - y1;
			return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
		}
	}

	// Run by drawPath
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
		// this.setState = {
		// 	path: arr
		// }
		// Unneccessary to update state of path, return arr for drawPath instead
		return arr;
	}
	// CONTINUE HERE
	// SET UP DRAW PATH TO INTEGRATE WITH GRID IN STATE INSTEAD OF OBJECT PROPERTY
	// Ran from _connectRooms
	_drawPath(x0, y0, x1, y1) {
		this._calculatePath(x0, y0, x1, y1).forEach(function(coordinate, idx) {
			let x = coordinate[0];
			let y = coordinate[1];
			if (idx !== 0) {
				this.state.grid[x][y] = 'X'
			}
		}.bind(this))
		return this.grid;
	}
	
	_generateRooms(cols, rows) {
		const that = this;
		function helperGeneratePosition() {
			// cols & rows will temporarily be substituted for 150 
			let randomX = Math.floor(Math.random() * 150);
			let randomY = Math.floor(Math.random() * 150);
			return [randomX, randomY]
		}
		function helperGenerateRoomSize() {
			let randomWidth = Math.floor(Math.random() * 10) + 2;
			let randomHeight = Math.floor(Math.random() * 10) + 2;
			return [randomWidth, randomHeight];
		}
		function helperFindCenterOfRoom(x, y, w, h) {
			return [Math.floor(x + w / 2), Math.floor(y + h / 2)]
		}
		function generateRoom() {
			console.log('Log generateRoom activity');
			
			let randomPosition = helperGeneratePosition();
			let randomSize = helperGenerateRoomSize();
			console.log('randomPosition:' + randomPosition);
			console.log('randomSize: ' + randomSize);
			let x = randomPosition[0];
			let y = randomPosition[1];
			let width = randomSize[0];
			let height = randomSize[1];
			
			if (x + width > that.state.width || y + height > that.state.height) {
				generateRoom();
			}
			else {
				let rooms = Array.prototype.slice.call(that.state.rooms);
				console.log('rooms')
				console.log(rooms)
			}
		}
		generateRoom()
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
			for (let j = x; j < x + this.state.cameraSize; j++) {
				row.push(grid[i][j])
			}
			gridView.push(row);
		}
		let center = this.state.cameraSize / 2;
		gridView[Math.floor(center)][Math.floor(center)] = 'KNIGHT';
		console.log(Math.floor(center));
		console.log(this.state.charPosition[0])
		return gridView;
	}
	
	// renderGrid accepts an array (cameraGrid) and translates into tile sprites
	renderGrid(grid) {
		let renderGrid = [];
		
		grid.forEach(function(row) {
			let renderRow = [];
			row.forEach(function(tile) {
				switch(tile) {
					case '_':
						renderRow.push(<img src={Grass} />)
						break;
					case 'GRASS':
						renderRow.push(<img src={Grass} />)
						break;
					case 'KNIGHT':
						renderRow.push(<img src={whiteKnight} />)
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
	// Render entire grid into string for viewing/testing
	renderGridToString() {
		console.log(this.state.entireGrid)
		let gridString = '';
		this.state.entireGrid.forEach(function(row) {
			let str = row.join(', ');
			console.log(row)
			row.forEach(function(tile) {

			})
			console.log(str);
			gridString = gridString.concat(str).concat('\n');
		})
		console.log('gridToString')
		console.log(gridString)
		return gridString;
	}

	render() {
			// console.log(this.state.mapPosition)
			// console.log(this.state.charPosition)
			//this.createGrid('GRASS', this.state.mapSize, this.state.mapSize)
			console.log('Testing');
			console.log(this._calculatePath(0, 0, 10, 10))
			console.log('From Redux...');
			console.log(this.props)
			console.log('_generateRooms');
			this._generateRooms()
			
		return(
			<div>
				<Dungeon />	
				{this.renderGrid(this.cameraGrid(this.state.entireGrid))}
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