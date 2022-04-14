import Button from '@material-ui/core/Button'
import React from 'react'

export default function CustomButton(props) {
  return (
    <Button
      style={{
        ...props.style,
      }}
      {...props}
      onMouseDown={(e) => e.preventDefault()}
    >
      {props.children}
    </Button>
  )
}
