import React, { Component } from 'react';
import ratFront from '../../img/rat/rat-front.png';
import ratBack from '../../img/rat/rat-back.png';
import ratLeft from '../../img/rat/rat-left.png';
import ratRight from '../../img/rat/rat-right.png';

class Rat extends Component {
	constructor(props) {
		super(props)
	}

	// Outputs hero sprite corresponding to direction traveled
	ratDirection(direction) {
		switch(direction) {
			case 'up':
				return ratBack
			case 'down':
				return ratFront
			case 'left':
				return ratLeft
			case 'right':
				return ratRight
			default:
				break;
		}
	}
	// PUSH EMPTY PNG FOR '_' to create second layer

	render() {

		const critterContainer = {
				height: 30,
				width: 30,
				display: 'inline-block',
				position: 'absolute'
			}

			let healthBar = {
				width: this.props.health + '%',
				height: 2,
				backgroundColor: 'red'
			}

		return (
		
			
			<div style={critterContainer}>
				<div style={healthBar}></div>
				<img
				className='whiteKnight' 
				src={this.ratDirection(this.props.direction)} />
			</div>
		)
	}
}

export default Rat;

// .critter-container {
// 	height: 30px;
// 	width: 30px;
// 	display: inline-block;
// 	position: absolute;
// }

// .whiteKnight {
// 	position: absolute
// }