import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../../Pages/Dashboard/Dashboard'
import Login from "../../Pages/Login/Login"
import { Signup } from "../../Pages/Signup/Signup"
import { ForgetPassword } from "../../Pages/ForgetPassword/ForgetPassword"
import { ResetPassword } from "../../Pages/ResetPassword/Resetpassword"
import { PrivateRoute } from '../../PrivateRoute/PrivateRoute';
import { Users } from "../../Pages/Users/Users"
import {NewsArticles } from "../../Pages/NewsArticles/NewsArticles"



const Main = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/" element={Dashboard} /> */}
        <Route path="/users" element={<PrivateRoute Component={Users} />} />
        <Route path="/news-articles" element={<PrivateRoute Component={NewsArticles} />} />
        {/*<Route path="/reports" element={<PrivateRoute Component={Reports} />} />*/}
      </Routes>
    </div>
  )
}

export default Main
