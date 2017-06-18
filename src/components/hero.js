import React, { Component } from 'react';
import whiteKnight from '../../img/knight-front2.png'
import knightFront from '../../img/knight-front.png';
import knightBack from '../../img/knight-back.png';
import knightLeft from '../../img/knight-left.png';
import knightRight from '../../img/knight-right.png';
import deadBody from '../../img/dead.png';

class Hero extends Component {
	constructor(props) {
		super(props)

	}

	addToGrid() {
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				//superGrid[i][j] = 'R';
			}
		}
	}
	// Outputs hero sprite corresponding to direction traveled
	heroDirection(direction) {
		switch(direction) {
			case 'up':
				return knightBack
			case 'down':
				return knightFront
			case 'left':
				return knightLeft
			case 'right':
				return knightRight
			default:
				break;
		}
	}

	// PUSH EMPTY PNG FOR '_' to create second layer

	render() {
		// Export into separate file later
		const tileContainer = {
				height: 30,
				width: 30,
				display: 'inline-block',
				position: 'absolute'
		}
		
		let healthBar = {
			width: this.props.health + '%',
			height: 2,
			backgroundColor: '#7CFC00'
		}

		return (

			<div style={tileContainer}>
				<div style={healthBar}></div>
				<img
				className='whiteKnight' 
				src={
					this.props.health > 0
					? this.heroDirection(this.props.direction)
					: deadBody
					} />
			</div>
		

	
		)
	}
}

export default Hero;

