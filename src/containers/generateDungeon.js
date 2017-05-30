// Notes on how to implement dungeon generator
// Redux will be used here to update the global state and feed the array into grid.js
// Question: Will grid.js update grid using global state data before rendering?

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateGrid } from '../actions/update-grid';

class Dungeon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapSize: 150,
            grid: [],
            rooms: {}
        }
    }

   componentWillMount() {
       this.setState({
        grid: this.createDungeon()
       })
   }

    createDungeon () {
		let grid = [],
			tile;
		for (let i = 0; i < this.state.mapSize; i++) {
            let row = [];
            for (let j = 0; j < this.state.mapSize; j++) {
                row.push('_')
            }
            grid.push(row);
        }
		return grid
	}

    _getFirstPoint() {
        let X = Math.floor(Math.random() * this.state.mapSize); // Fix to produce only under 150
        let Y = Math.floor(Math.random() * this.state.mapSize); // Fix to produce only under 150
        //console.log(X, Y);
        return [X, Y]
    }

    _getSecondPoint(X1, Y1) {
        let X2 = X1 + Math.floor(Math.random() * 10) + 5;
        let Y2 = Y1 + Math.floor(Math.random() * 10) + 5;
        // console.log('Second point')
        // console.log(X2, Y2) 
        return [X2, Y2]
    }

    createRoom() {
        const position1 = this._getFirstPoint();
        const position2 = this._getSecondPoint.apply(this, position1);
        console.log(position1);
        console.log(position2);
        let gridClone = Array.prototype.slice.call(this.state.grid);
        // console.log('Copy grid')
        // console.log(gridClone);
        let X = [position1[0], position2[0]];
        let Y = [position1[1], position2[1]];
       
        for (let i = X[0]; i < X[1]; i++) {
            for (let j = Y[0]; j < Y[1]; j++) {
               // console.log(i, j);
                gridClone[i][j] = 'G';
            }
        }
        
//        console.log(gridClone);
    }

    generateRooms() {
        
    }

    render() {
        //this.props.updateGrid([1,2,3]);
        console.log('Creating dungeon...')
        this.createRoom();
        //this._getSecondPoint.apply(this, this._getFirstPoint())
        return (
            <div>Hello from generate Dungeon</div>
        )
    }
 }

function mapStateToProps(state) {
    return {
        grid: state.grid
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({updateGrid}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dungeon);