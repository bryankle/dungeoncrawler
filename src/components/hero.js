import React, { Component } from 'react';
import whiteKnight from '../../img/knight-front.png'

class Hero extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		console.log('componentWillMount...')
		const sprite = "Testing"
		console.log(sprite)
	}


	componentDidMount() {
		console.log('componentDidMount')
	}

	render() {
		const sprite = document.querySelector('.hero-sprite');
		console.log('Rendered')

		return(
			<img 
				className="hero-sprite"
				src={whiteKnight} />
		)
	}
}

export default Hero;