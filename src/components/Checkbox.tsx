import React from 'react'
import './Checkbox.scss'

interface CheckboxProps extends React.PropsWithChildren<any> {}

function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <label className="checkbox-label">
      <input type="checkbox" {...props} />
      <span className="label" style={props.style || {}}>{children}</span>
    </label>
  )
}

export default Checkbox
