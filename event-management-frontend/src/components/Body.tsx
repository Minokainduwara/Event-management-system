import React from 'react'

interface BodyProps {
children: React.ReactNode;
}

function Body(props: BodyProps) {
  return (
    <div>{props.children}</div>
  )
}

export default Body