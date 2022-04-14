import { TextField } from '@material-ui/core'
import { Col, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'

let contentTimer

export default function LagFreeTextEditor(props) {
  let changeValue = props.changeValue

  let [value, setValue] = useState('')

  useEffect(() => {
    console.log('props.value', props.value)

    setValue(props.value)
  }, [props.value])

  const editValue = (value) => {
    setValue(value)

    clearTimeout(contentTimer)

    contentTimer = setTimeout(async () => {
      changeValue(value)
    }, 100)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '.9rem' }}>
        {props.title} &nbsp;{props.miniTooltip ? props.miniTooltip : null}
        {props.subtitle ? (
          <span style={{fontSize: '.8em', color: 'grey' }}>
            {props.subtitle}
          </span>
        ) : null}
      </span>
      <TextField
        {...props}
        style={{
          ...props.style,
          marginLeft: '0.5em',
          fontSize: '1em',
        }}
        InputProps={{
          ...props.InputProps,
          style: {
            fontSize: '1.2em',
            cursor: 'pointer',
          },
        }}
        onBlur={() => changeValue(value)}
        onChange={(evt) => editValue(evt.target.value)}
        value={value}
      />
    </div>
  )
}
