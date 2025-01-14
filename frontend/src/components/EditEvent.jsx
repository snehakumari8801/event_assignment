import React from 'react'
import EventForm from '../components/EventForm'

function EditEvent() {
  return (
    <div className='bg-gray-600'>
      <h1 className='text-3xl font-bold text-center mt-2 p-3 text-white'>Edit Event</h1>
      <EventForm/>
    </div>
  )
}

export default EditEvent
