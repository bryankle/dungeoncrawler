import React, { Component } from 'react';
import whiteKnight from '../../img/knight-front2.png'

class Hero extends Component {
	constructor(props) {
		super(props)
		this.cameraGrid = this.props.cameraGrid;
		this.renderGrid = this.props.renderGrid;
	}

	componentWillMount() {
		let superGrid = this.props.grid;
		console.log(superGrid)
	}


	componentDidMount() {
	}

	addToGrid() {
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				//superGrid[i][j] = 'R';
			}
		}
	}

	// PUSH EMPTY PNG FOR '_' to create second layer

	render() {
		console.log(this.cameraGrid)
		console.log('greetings from hero');
		console.log('superGrid');
		///console.log(superGrid)
		const sprite = document.querySelector('.hero-sprite');
		console.log('Rendered')

		return(
		
				<img
					className='whiteKnight' 
					src={whiteKnight} />
			
		)
	}
}

export default Hero;

/*
<button
					onClick={this.addToGrid()}
				>
				Add to grid
				</button>
				<button
					onClick={() => {
						this.props.updateGrid(this.props.grid)
					}}
				>Set State</button>
				<img 
					className="hero-sprite"
					src={whiteKnight} 
				/>
*/