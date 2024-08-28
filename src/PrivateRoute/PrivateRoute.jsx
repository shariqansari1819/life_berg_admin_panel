import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const PrivateRoute = (props) => {
  // console.log("groups :")
  const { Component } = props;


  
  const navigate = useNavigate();
  useEffect(() => {
    var x = localStorage.getItem("authToken");
    if (x === undefined || x == null) {
      // console.log("note toke")
      navigate("/login");
    }
  });
  return (
    <div>
      <Component />
    </div>
  );
};

 
