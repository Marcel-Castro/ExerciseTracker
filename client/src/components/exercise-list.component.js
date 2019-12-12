import React, { Component } from 'react'
import axios from 'axios'
import { Card, CardBody, Button, Row, Col, Container, Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './exercise_list.css'

export default class ExerciseList extends Component {
    constructor(props) {
        super(props)

        this.deleteExercise = this.deleteExercise.bind(this)
        this.generateExerciseCard = this.generateExerciseCard.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.equalReps = this.equalReps.bind(this)
        this.equalIntense = this.equalIntense.bind(this)
        this.cardDescription = this.cardDescription.bind(this)
        this.displayCurrent = this.displayCurrent.bind(this)
        this.setDeleteEntered = this.setDeleteEntered.bind(this)
        this.setDeleteLeft = this.setDeleteLeft.bind(this)
        this.setCurrent = this.setCurrent.bind(this)

        this.state = {
            exercises: [],
            currentExercise: undefined,
            deleteEntered: false,
            userID: '5d99275be0301aee8cf6f1dc' //Placeholder until redux is setup
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:4000/exercises/byUser/${this.state.userID}`)
            .then(response => {
                console.log(response.data)

                this.setState({
                    exercises: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    deleteExercise = (id) => {
        axios.delete(`http://localhost:4000/exercises/${id}`)
            .then(response => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
        
        this.setState({
            exercises: this.state.exercises.filter(el => el._id !== id)
        })
    }

    formatDate = (someDate) => {
        return ({
            day: moment(someDate).format('ddd DD'),
            month: moment(someDate).format('MMM'),
            year: moment(someDate).format('YYYY'),
            time: moment(someDate).format('hh:mm a')
        })
    }

    equalReps = (setArray) => {
        return setArray.every(el => 
            (el.reps === setArray[0].reps)
        )
    }

    equalIntense = (setArray) => {
        return setArray.every(el => 
            (el.intensity === setArray[0].intensity)
        )
    }

    setDeleteEntered = () => {
        this.setState({
            deleteEntered: true
        })
    }

    setDeleteLeft = () => {
        this.setState({
            deleteEntered: false
        })
    }

    setCurrent = (exercise) => {
        if (this.state.deleteEntered === false)
        {
            this.setState({
                currentExercise: exercise
            })
        }
    }

    displayCurrent = () => {
        if (this.state.currentExercise === null || this.state.currentExercise === undefined) {
            return (
                <div style={{"marginTop": "14px"}}>
                    <Card style = {{"paddingRight": "15px", "paddingLeft": "15px", "paddingTop": "7px"}}>
                        <label>Select an exercise to view more information about it...</label>
                    </Card>
                </div>
            )
        }
        else {
            return (
                <div style={{"marginTop": "15px"}}>
                    <Card
                        style = {{
                            "paddingRight": "15px", 
                            "paddingLeft": "15px", 
                            "paddingTop": "12px",
                            "paddingBottom": "5px"
                        }}
                    >
                        <h5>{this.state.currentExercise.exerciseName}</h5>
                        <br></br>
                        <label style={{"fontWeight": "bold"}}>Notes: </label>
                        <label>{this.state.currentExercise.notes}</label>
                    </Card>
                    <Card
                        style={{
                            "paddingLeft": "14px",
                            "paddingRight": "14px",
                            "paddingTop": "-14px",
                            "marginTop": "10px",
                            "height": "438px",
                            "overflowY": "scroll"
                        }}
                    >
                        <Table borderless striped hover style={{"marginTop": "12px"}}>
                            <thead>
                                <tr>
                                    <th style={{"padding": "10px"}}></th>
                                    <th style={{"padding": "10px"}}>Reps</th>
                                    <th style={{"padding": "10px"}}>Intensity</th>
                                    <th style={{"padding": "10px"}}>RPE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.currentExercise.sets.map((set, index) => {
                                    return (
                                        <tr key={index}>
                                            <td 
                                                style={{
                                                    "padding": "10px",
                                                    "fontWeight": "bold"
                                                }}
                                            >
                                                Set {index + 1}
                                            </td>
                                            <td style={{"padding": "10px"}}>{set.reps}</td>
                                            <td style={{"padding": "10px"}}>{set.intensity}</td>
                                            {set.rpe ? (
                                                <td style={{"padding": "10px"}}>{set.rpe}</td>
                                            ) : (
                                                <td style={{"padding": "10px"}}></td>
                                            )}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Card>
                </div>
            )
        }
    }

    cardDescription = (exercise) => {
        if (exercise.sets.length > 0) {
            if (this.equalReps(exercise.sets) === true && this.equalIntense(exercise.sets) === true) {
                return (
                    <li><label>{exercise.sets.length} Sets of {exercise.sets[0].reps} @ {exercise.sets[0].intensity}</label></li>
                )
            } else if (this.equalIntense(exercise.sets) === true) {
                return (
                    <li><label>{exercise.sets.length} Sets of Varying Reps @ {exercise.sets[0].intensity}</label></li>
                )
            } else if (this.equalReps(exercise.sets) === true) {
                return (
                    <li><label>{exercise.sets.length} Sets of {exercise.sets[0].reps} @ Varying Intensities</label></li>
                )
            } else {
                return (
                    <li><label>{exercise.sets.length} Sets of Varying Reps @ Varying Intensities</label></li>
                )
            }
        } else {
            return (
                <li><label>No Sets Recorded</label></li>
            )
        }
    }

    generateExerciseCard = (exercise) => {
        const date = this.formatDate(exercise.date)

        return (
            <li 
                key={exercise._id}
                style ={{
                    "padding": "4px"
                }}
            >
                <Card
                    className="exerciseCard"
                    onClick={() => this.setCurrent(exercise)}
                    style={{
                        "backgroundColor": "#f2f2f2"
                    }}
                >
                    <CardBody>
                        <Container>
                            <Row>
                                <Col className="leftColCard">
                                    <ul
                                        style={{
                                            "listStyleType": "none",
                                            "textAlign": "right"
                                        }}
                                    >
                                        <li>{date.day}</li>
                                        <li>{date.month}</li>
                                        <li>{date.year}</li>
                                        <li>{date.time}</li>
                                    </ul>
                                </Col>
                                <Col className="middleColCard">
                                    <ul
                                        style={{
                                            "listStyleType": "none"
                                        }}
                                    >
                                        <li><h6>{exercise.exerciseName}</h6></li>
                                        {this.cardDescription(exercise)}
                                    </ul>
                                </Col>
                                <Col>
                                    <div
                                        style={{
                                            "display": "flex",
                                            "alignItems": "center"
                                        }}
                                    >
                                        <Link to={"/edit/" + exercise._id} className="nav-link">
                                            <Button>
                                                Edit
                                            </Button>
                                        </Link>
                                        <Link to={"/copy/" + exercise._id} className="nav-link">
                                            <Button style={{"marginLeft": "-16px"}}>
                                                Copy
                                            </Button>
                                        </Link>
                                        <Button
                                            color="danger"
                                            onMouseEnter={() => this.setDeleteEntered()}
                                            onMouseLeave={() => this.setDeleteLeft()}
                                            onClick={() => (window.confirm("Are you sure you wish to delete this?") 
                                                && this.deleteExercise(exercise._id))}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </CardBody>
                </Card>
            </li>
        )
    }

    render() {
        return (
            <Container className="mainContainer mx-auto">
                <Row>
                    <Col>
                        <Card
                            style={{
                                "overflowY": "scroll",
                                "height": "600px",
                                "marginTop": "15px"
                            }}
                        >
                            <div>
                                <ul
                                    style={{
                                        "listStyleType": "none",
                                        "padding": "10px"
                                    }}
                                >
                                    {this.state.exercises.map((exercise) => {
                                        return this.generateExerciseCard(exercise)
                                    })}
                                </ul>
                            </div>
                        </Card>
                    </Col>
                    <Col>
                        {this.displayCurrent()}
                    </Col>
                </Row>
            </Container>
        )
    }
}