import React from 'react'
import {useState} from 'react';

function Compile() {
  const [compile, setCompile] = useState(false);

  const activateCompile = () => {
    setCompile(true);
  }
  return (
    <div className = "compile-button" onClick = {activateCompile}>
        {"<> Compile"}
        {/* {compile ? } */}
    </div>
  )
}

export default Compile