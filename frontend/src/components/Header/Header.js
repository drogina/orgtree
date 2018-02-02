import React, { Component } from 'react';
import logo from '../../logo.svg';

export default class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark">
                <h1 className="navbar-brand mb-0">Really Cool Org</h1>
            </nav>
        )
    }
}