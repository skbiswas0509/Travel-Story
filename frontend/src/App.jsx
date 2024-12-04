import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import Login from './Auth/Login'
import Signup from './Auth/Signup'
import Home from './Home/Home'


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' exact element={<Root />}/>
          <Route path='/dashboard' exact element={<Home/>}/>
          <Route path='/login' exact element={<Login/>}/>
          <Route path='/signup' exact element={<Signup/>}/>
        </Routes>
      </Router>
    </div>
  )
}

//define the root component to handle the initial redirect
const Root = () => {
  //check if the token exists in localstorage
  const isAuthenticated = !!localStorage.getItem("token");

  //redirect to dashboard if authenticated, otherwise to login
  return  isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}

export default App