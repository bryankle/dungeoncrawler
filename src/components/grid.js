import React, { Component } from 'react';
import Hero from './Hero';
import Dungeon from '../containers/generateDungeon';

import Grass from '../../img/grass.jpg';
import whiteKnight from '../../img/knight-front.png';
import Rock from '../../img/rock.jpg';


// IDEAS
// Create a random map generated with rocks and grass with collision data stored in objects

const renderGrass = <img src={Grass} />

class Grid extends Component {
	constructor(props) {
		super(props)
		this.state = {
			charPosition: [7, 7], // Switch over to charPosition later
			mapPosition: [0, 0], // Not in use at the moment
			entireGrid: [], // Can be as large as neccessary
			visibleGrid: [], // Only 15 x 15 is visible in camera view
			mapSize: 150,
			cameraSize: 15,
			objectInformation: {
				whiteKnight: {
					solid: true
				},
				GRASS: {
					solid: false
				},
				ROCK: {
					solid: true
				}
			}
		}
	}

	componentWillMount() {
		document.addEventListener('keydown', this._handleKeydown.bind(this))
		this.setState({
			entireGrid: this.helperTranspose(this._createGrid('GRASS', this.state.mapSize, this.state.mapSize))
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
					tile = 'ROCK';
				}
				else {
					// Randomly generate grass or rock on tile
					tile = random > 0.4 ? 'GRASS' : 'ROCK';
				}
				row.push(tile)
			}
			grid.push(row);
		}
		
		return grid
	}
	// Transpose array to convert grid to true [x][y]
	helperTranspose(a) {
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
					case 'GRASS':
						renderRow.push(<img src={Grass} />)
						break;
					case 'KNIGHT':
						renderRow.push(<img src={whiteKnight} />)
						break;
					case 'ROCK':
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
		//this._moveCharPosition();
			console.log(this.state.mapPosition)
			console.log(this.state.charPosition)
			//this.createGrid('GRASS', this.state.mapSize, this.state.mapSize)
			

		return(
			<div>	
				<Dungeon />
				{this.renderGrid(this.cameraGrid(this.state.entireGrid))}
			</div>
		)
	}
}

export default Grid;

//	{this.renderGrid(this.cameraGrid(this.createGrid('GRASS', this.state.mapSize, this.state.mapSize)))}