import React, { Component } from 'react';

import Grid from './grid';
import Hero from '../components/hero';

import DamageReport from './damagereport';

export default class App extends Component {
  render() {
    return (
      <div className="container">
      	<Grid />
        <DamageReport/>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     damage: state.damage
//   }
// }

//export default connect(mapStateToProps)(Grid)
// Convert app.js into a container later to receive Redux information from store