import React, { Component } from 'react';
import { connect } from 'react-redux';

const DamageReport = function(props) {
    // Will have to use Redux to pass on damage
    return (
        <div>
            <h1>You have inflicted {props.damage} damage to rat</h1>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        damage: state.damage
    }
}

export default connect(mapStateToProps)(DamageReport)