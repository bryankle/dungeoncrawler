import React, { Component } from 'react';
import Grid from '../containers/grid';
import Hero from './hero';

import DamageReport from './damagereport';

export default class App extends Component {
  render() {
    return (
      <div className="container">
      	<Grid />
        <DamageReport damage={12}/>
      </div>
    );
  }
}
// Convert app.js into a container later to receive Redux information from store