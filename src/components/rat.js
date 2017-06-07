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
		return(
		
		<img
			className='whiteKnight' 
			src={this.ratDirection(this.props.direction)} />
		)
	}
}

export default Rat;

