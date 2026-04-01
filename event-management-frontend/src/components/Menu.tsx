import React from 'react'
import { Link } from 'react-router-dom'

interface MenuProps {
  to: string;
  label: string;
}

function Menu(props: MenuProps) {
  return (
    <Link to={props.to} className='text-white font-Inter font-bold hover:bg-white/20 transition p-2 rounded-md'>{props.label}</Link>
  )
}

export default Menu