import React, {useState} from "react";

export const statusStyle = (status) => {
  const color = {background: ""}

  if(status === "NOT STARTED"){
    color.background = "yellow"
  }else if(status === "ACTIVE") {
    color.background = "green"
  }else if(status === "IN PROGRESS") {
    color.background = "green"
  }else if(status === "NEW") {
    color.background = "blue"
  }else if(status === "INACTIVE") {
    color.background = "red"
  }else{
    color.background = "none"
  }
  return color
}