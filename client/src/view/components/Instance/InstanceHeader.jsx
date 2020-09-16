import React from 'react'

export default function InstanceHeader () {
  return (
    <thead>
      <tr>
        <th style={{ width: '25%' }}>name</th>
        <th style={{ width: '20%' }} />
        <th style={{ width: '15%' }}>node version</th>
        <th style={{ width: '15%' }}>chain</th>
        <th style={{ width: '10%' }}></th>
        <th style={{ width: '15%', textAlign: 'right' }}></th>
      </tr>
    </thead>
  )
}