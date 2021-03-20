import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { updateSpots } from 'helpers/selectors';

// Implementing Spots:
// 1. Where is the value of 'spots' stored for each day?
// - CORRECTION: inside state.days, then inside each object has 'spots' key

// 2. When should that value change?
// - at the same time the states change from bookingInterview / cancelInterview 

// 3. How can we calculate how many spots should be available?
// Update spots with state.days (answer 1) -1 if creating appt, +1 if deleting appt
// (Overcomplicated) - From appointment id => interview data => if interview is null then add to spot counter?
// (Overcomplicated) - Alternatively, if interview is not null, then subtract from 5 (max interview spots allowed)

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots([...state.days], id, -1)

    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then(res => {
        setState({
          ...state,
          appointments,
          days
        });
      })
  };

  const cancelInterview = id => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots([...state.days], id, 1)

    return axios
      .delete(`/api/appointments/${id}`)
      .then(res => {
        setState({
          ...state,
          appointments,
          days
        });
      })
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}