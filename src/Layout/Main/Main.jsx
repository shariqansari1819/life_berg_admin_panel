import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../../Pages/Dashboard/Dashboard'
import Login from "../../Pages/Login/Login"
import {Signup} from "../../Pages/Signup/Signup"
import {ForgetPassword} from "../../Pages/ForgetPassword/ForgetPassword"
import {ResetPassword} from "../../Pages/ResetPassword/Resetpassword"
import {PrivateRoute} from '../../PrivateRoute/PrivateRoute';
import {Users} from "../../Pages/Users/Users"


const Main = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={Dashboard} />
        <Route path="/users" element={<PrivateRoute Component={Users} />} />
       {/* <Route path="/videos" element={<PrivateRoute Component={Videos} />} />
        <Route path="/reports" element={<PrivateRoute Component={Reports} />} />*/}
      </Routes>
    </div>
  )
}

export default Main
