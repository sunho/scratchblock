import React from 'react'
import Sidebar from './Sidebar';
import Compile from './Compile';

function Navbar() {
    const RubberBand = require("react-reveal/RubberBand");

  return (
    <div className = "nav"> 
            <div>
            </div>
            <div className = "vs-code">
              <Sidebar/> 
            </div>
        </div>
  )
}

export default Navbar