import React, { Component } from 'react';

const DamageReport = function(props) {
    // Will have to use Redux to pass on damage
    return (
        <div>
            <h1>You have inflicted {props.damage} damage to rat</h1>
        </div>
    )
}
export default DamageReport