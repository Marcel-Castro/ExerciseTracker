import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import Navbar from "./components/navbar.component.js"
import ExerciseList from "./components/exercise-list.component.js"
import EditExercise from "./components/edit-exercise.component.js"
import CreateExercise from "./components/create-exercise.component.js"
import CreateUser from "./components/create-user.component.js"
import CopyExercise from "./components/copy-exercise.component.js"
import Login from "./components/login.component.js"

function App() {
  return (
    <Router>
      <Navbar />
      <br/>
      <Route path="/" exact component={ExerciseList} />
      <Route path="/create" component={CreateExercise} />
      <Route path="/edit/:id" component={EditExercise} />
      <Route path="/copy/:id" component={CopyExercise} />
      <Route path="/register" component={CreateUser} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
