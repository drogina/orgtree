import React, { Component } from 'react';
import FA from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/fontawesome-free-solid';

export default class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark">
                <a className="navbar-brand" href="">
                    <FA icon={faRocket} />
                    <span className="ml-3">The Schwartz</span>
                </a>
            </nav>
        )
    }
}