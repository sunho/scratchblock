import React from 'react';
import {useState} from 'react';
import sidebarIcon from '../images/sidebarIcon.png';
import exitIcon from '../images/exitIcon.png'
import { BlockView } from './BlockView';
import { getBlockDef } from '../blocks/Blocks';

function Sidebar() {
  const [activate, setActivate] = useState(false);
  const presets: any[] = [
    {type: 'intType'},
    {type: 'if', condition: {type: 'equalTo', left: {type: 'identifier', name: 'var'}, right: {type: 'numberLiteral', value: 53}}, body: []}
  ];


  const activeNav = () => {
    setActivate(!activate);
  }
  return (
    <div className = {activate ? 'sidebarrr' : 'Sidebar-none'}>
      <div className = 'menu-icon' onClick = {activeNav}>
      {!activate ? <img className = "icons" id = "sidebar-icon" src = {sidebarIcon} alt = "sidebar"/> : <img className = "icons" id = "exit-icon" src = {exitIcon} alt = "exit"/>}
      {presets.map((x: any) => (<BlockView data={x} path={[]} def={getBlockDef(x)!} isPreview={true}/>))}
      </div>
    </div>
  )
}

export default Sidebar