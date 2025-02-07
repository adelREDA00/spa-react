import React from 'react'

function Input({ type, name, index }) {
  return (
    <input
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    // onChange={({ target }) => updateItem(type, index, target.value)}
    name={name.replace(" ", "-").toLowerCase()}
  />
  )
}

export default Input