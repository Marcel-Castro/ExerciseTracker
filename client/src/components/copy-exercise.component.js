import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { Card, CardBody, CardHeader, Button, Row, Col, Container } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

export default class CopyExercise extends Component {
    constructor(props) {
        super(props)

        this.onChangeExerciseName = this.onChangeExerciseName.bind(this)
        this.onChangeNotes = this.onChangeNotes.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.addSet = this.addSet.bind(this)
        this.removeSet = this.removeSet.bind(this)
        this.clearSets = this.clearSets.bind(this)
        this.removeThisSet = this.removeThisSet.bind(this)
        this.generateCards = this.generateCards.bind(this)
        this.duplicateSet = this.duplicateSet.bind(this)
        this.showRPE = this.showRPE.bind(this)
        this.hideRPE = this.hideRPE.bind(this)
        this.updateSet = this.updateSet.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            userID: '5d99275be0301aee8cf6f1dc', //Placeholder until redux is setup
            exerciseName: '',
            notes: '',
            sets: [],
            date: new Date(),
            exerciseID: props.match.params.id
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:4000/exercises/${this.state.exerciseID}`)
            .then(response => {
                var temp = []

                // Ensure that rpe input boxes will show up with placeholder instead of a null value
                response.data.sets.forEach(element => {
                    if (element.rpe === null) {
                        temp.push({
                            reps: element.reps,
                            intensity: element.intensity,
                            showRPE: element.showRPE,
                            rpe: ''
                        })
                    } else {
                        temp.push({
                            reps: element.reps,
                            intensity: element.intensity,
                            showRPE: element.showRPE,
                            rpe: element.rpe
                        })
                    }
                })

                // Get the current time of day rather than the one from the original date
                var originalDate = new Date(response.data.date)
                var nowDate = new Date()
                var newDate = new Date(
                    originalDate.getFullYear(),
                    originalDate.getMonth(),
                    originalDate.getDate(),
                    nowDate.getHours(),
                    nowDate.getMinutes(),
                    nowDate.getSeconds()
                )

                this.setState({
                    userID: response.data.userID,
                    exerciseName: response.data.exerciseName,
                    notes: response.data.notes,
                    sets: temp,
                    date: newDate //new Date(response.data.date)
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    onChangeExerciseName(e) {
        this.setState({
            exerciseName: e.target.value
        })
    }

    onChangeNotes(e) {
        this.setState({
            notes: e.target.value
        })
    }

    onChangeDate(date) {
        this.setState({
            date: date
        })
    }

    addSet = () => {
        var temp = this.state.sets.concat(
            {
                reps: '',
                intensity: '',
                rpe: '',
                showRPE: false
            }
        )
        this.setState({
            sets: temp
        })
    }

    removeSet = () => {
        var temp = this.state.sets
        temp.length = temp.length - 1

        this.setState({
            sets: temp
        })
    }
    
    removeThisSet = (i) => {
        var temp = this.state.sets
        temp.splice(i, 1)

        console.log(i)

        this.setState({
            sets: temp
        })
    }

    clearSets = () => {
        this.setState({
            sets: []
        })
    }

    updateSet = (e, i, field) => {
        var temp = this.state.sets

        if (field === 'reps' || field === 'rpe')
        {
            temp[i][field] = Number(e.target.value)
        }
        else
        {
            temp[i][field] = e.target.value
        }

        this.setState({
            sets: temp
        })
    }

    duplicateSet = (i) => {
        const temp = this.state.sets.concat(
            {
                reps: this.state.sets[i].reps,
                intensity: this.state.sets[i].intensity,
                rpe: this.state.sets[i].rpe,
                showRPE: this.state.sets[i].showRPE
            }
        )
        this.setState({
            sets: temp
        })
    }

    showRPE = (i) => {
        const temp = this.state.sets

        temp[i].showRPE = true
        
        this.setState({
            sets: temp
        })
    }

    hideRPE = (i) => {
        const temp = this.state.sets

        temp[i].showRPE = false
        temp[i].rpe = ''

        this.setState({
            sets: temp
        })
    }

    onSubmit(e) {
        e.preventDefault()

        var temp = []
        
        // Set showRPE to false if it was set to true but no rpe value was entered for each set
        this.state.sets.forEach(element => {
            if ((element.rpe === '' || element.rpe === null) && element.showRPE === true) {
                temp.push({
                    reps: element.reps,
                    intensity: element.intensity,
                    showRPE: false,
                    rpe: ''
                })
            } else {
                temp.push({
                    reps: element.reps,
                    intensity: element.intensity,
                    showRPE: element.showRPE,
                    rpe: element.rpe
                })
            }
        })

        const exercise = {
            userID: this.state.userID,
            exerciseName: this.state.exerciseName,
            notes: this.state.notes,
            date: this.state.date,
            sets: temp
        }

        console.log(exercise)
        console.log(this.state.exerciseID)

        axios.post('http://localhost:4000/exercises/add', exercise)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        window.location.href = '/'
    }

    generateCards = (info, i) => {
        return (
        <li 
            key={i}
            style={{
                "paddingRight": "8px",
                "paddingLeft": "8px",
                "paddingTop": "8px"
            }}
        >
            <Card>
                <CardHeader
                    style={{
                        "height": "36px", 
                        "display": "flex", 
                        "alignItems": "center", 
                        "justifyContent": "center",
                        "backgroundColor": "#858585"
                    }}>
                    <h6 style={{
                        "paddingTop": "8px", 
                        "color": "#f5f5f5",
                        "whiteSpace": "nowrap"
                        }}>
                        Set {i + 1}
                    </h6>
                    {this.state.sets[i].showRPE ? (
                        <Button
                        onClick={() => this.hideRPE(i)}
                        size="sm"
                        style={{
                            "marginLeft": "380px",
                            "marginRight": "6px",
                            "backgroundColor": "transparent",
                            "fontWeight": "bold",
                            "border": "none",
                            "width": "60px"
                        }}
                        >
                            -RPE
                        </Button>
                    ) : (
                        <Button
                        onClick={() => this.showRPE(i)}
                        size="sm"
                        style={{
                            "marginLeft": "380px",
                            "marginRight": "6px",
                            "backgroundColor": "transparent",
                            "fontWeight": "bold",
                            "border": "none",
                            "width": "60px"
                        }}
                        >
                            +RPE
                        </Button>
                    )}
                    <Button
                        onClick={() => this.duplicateSet(i)}
                        size="sm"
                        style={{
                            "marginTop": "2px",
                            "marginRight": "8px",
                            "backgroundColor": "transparent",
                            "border": "none"
                        }}
                    >
                        <FontAwesomeIcon icon={faClone} />
                    </Button>
                    <Button
                        close
                        style={{
                            "height": "24px", 
                            "width": "24px",
                            "marginBottom": "3px",
                            "marginRight": "-4px",
                            "border": "none",
                            "color": "#ffffff",
                            "opacity": "1"
                        }}
                        size="sm"
                        onClick={() => this.removeThisSet(i)}>
                    </Button>
                </CardHeader>
                <CardBody style={{"height": "64px"}}>
                    <Container>
                        <Row style={{
                            "marginTop": "-18px"
                            }}
                        >
                            <Col>
                                <div className="form-group">
                                    <label 
                                        style={{
                                            "marginBottom": "-4px",
                                            "fontWeight": "bold"
                                        }}
                                    >
                                        Reps: 
                                    </label>
                                    <input
                                        type="text"
                                        style={{
                                            "borderRadius": "4px", 
                                            "padding": "3px 8px",
                                            "border": "1px solid #ccc",
                                            "display": "block",
                                            "width": "45px"
                                        }}
                                        placeholder="#"
                                        value={String(info.reps)}
                                        onChange={(event) => this.updateSet(event, i, 'reps')}
                                    />
                                </div>
                            </Col>
                            {this.state.sets[i].showRPE ? (
                                <Col xs="8">
                                    <div>
                                        <label 
                                            style={{
                                                "marginBottom": "-4px", 
                                                "fontWeight": "bold"
                                            }}
                                        >
                                                Intensity: 
                                        </label>
                                        <input 
                                            type="text"
                                            style={{
                                                "borderRadius": "4px", 
                                                "padding": "3px 8px",
                                                "border": "1px solid #ccc",
                                                "display": "block",
                                                "width": "100%"
                                            }}
                                            placeholder="# lbs/kg..."
                                            value={info.intensity}
                                            onChange={(event) => this.updateSet(event, i, 'intensity')}
                                        />
                                    </div>
                                </Col>
                            ) : (
                                <Col xs="10">
                                    <div>
                                        <label 
                                            style={{
                                                "marginBottom": "-4px",
                                                "fontWeight": "bold"
                                            }}
                                        >
                                            Intensity: 
                                        </label>
                                        <input 
                                            type="text"
                                            style={{
                                                "borderRadius": "4px", 
                                                "padding": "3px 8px",
                                                "border": "1px solid #ccc",
                                                "display": "block",
                                                "width": "100%"
                                            }}
                                            placeholder="# lbs/kg..."
                                            value={info.intensity}
                                            onChange={(event) => this.updateSet(event, i, 'intensity')}
                                        />
                                    </div>
                                </Col>
                            )}
                            {this.state.sets[i].showRPE ? (
                                <Col>
                                    <div className="form-group">
                                    <label 
                                        style={{
                                            "marginBottom": "-4px",
                                            "fontWeight": "bold"
                                        }}
                                    >
                                        RPE: 
                                    </label>
                                    <input 
                                        type="text"
                                        style={{
                                            "borderRadius": "4px", 
                                            "padding": "3px 8px",
                                            "border": "1px solid #ccc",
                                            "display": "block",
                                            "width": "45px"
                                        }}
                                        placeholder="#"
                                        value={String(info.rpe)}
                                        onChange={(event) => this.updateSet(event, i, 'rpe')}
                                    />
                                    </div>
                                </Col>
                            ) : (
                                <div></div>
                            )}
                        </Row>
                    </Container>
                </CardBody>
            </Card>
        </li>)
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <Container>
                        <Row className="mb-4 ml-1">
                            <h3>Create New Exercise</h3>
                        </Row>
                        <Row>
                            <Col>
                                {/* Exercise Name Input */}
                                <div className="form-group">
                                    <label>Exercise Name: </label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={this.state.exerciseName}
                                        onChange={this.onChangeExerciseName}
                                    />
                                </div>
                                {/* Notes Input */}
                                <div className="form-group">
                                    <label>Notes: </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        value={this.state.notes}
                                        onChange={this.onChangeNotes}
                                        maxLength="120"
                                    />
                                </div>
                                {/* Date Input */}
                                <div className="form-group">
                                    <label>Date: </label>
                                    <div>
                                    <DatePicker
                                        className="form-control"
                                        selected={this.state.date}
                                        onChange={this.onChangeDate}
                                    />
                                    </div>
                                </div>
                                <div className="mt-4 form-group">
                                    <input
                                        type="submit"
                                        value="Create Exercise"
                                        className="btn btn-primary"
                                    />
                                </div>
                            </Col>
                            <Col className ="ml-5">
                                {this.state.sets.length <= 0 ? (
                                    <div className="mb-3">
                                    <Button onClick={this.addSet}>
                                        Add Set
                                    </Button>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                    <Button onClick={this.addSet}>
                                        Add Set
                                    </Button>
                                    <Button color="danger" className="ml-2" onClick={this.removeSet}>
                                        Remove Set
                                    </Button>
                                    <Button color="danger" className="ml-2" onClick={this.clearSets}>
                                        Clear sets
                                    </Button>
                                    </div>
                                )}
                                <div>
                                    <ul 
                                        className="form-control" 
                                        style={{
                                            "listStyleType": "none", 
                                            "padding": 0, 
                                            "overflowY": "scroll", 
                                            "height": "420px",
                                            "backgroundColor": "#c4c4c4"
                                        }}
                                    >
                                        {this.state.sets.map((set, index) => {
                                            return this.generateCards(set, index)
                                        })}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </form>
            </div>
        )
    }
}