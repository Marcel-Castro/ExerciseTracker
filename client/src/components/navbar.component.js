import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">ExerciseTracker</Link>
                <div className="navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                    <Link to="/" className="nav-link">Exercises</Link>
                    </li>
                    <li className="navbar-item">
                    <Link to="/create" className="nav-link">Create Exercise</Link>
                    </li>
                    <li className="navbar-item">
                    <Link to="/register" className="nav-link">Sign Up</Link>
                    </li>
                    <li className="navbar-item">
                    <Link to="/login" className="nav-link">Login</Link>
                    </li>
                </ul>
                </div>
            </nav>
        )
    }
}