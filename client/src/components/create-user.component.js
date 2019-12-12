import React, { Component } from 'react'

export default class CreateUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            displayName: ''
        }
    }

    render() {
        return (
            <div>
                <p>Create User Component...</p>
            </div>
        )
    }
}