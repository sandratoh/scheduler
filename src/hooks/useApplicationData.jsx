import { useState, useEffect } from 'react';
import axios from 'axios';
// import { countSpot, updateSpots } from 'helpers/updateSpots';

// spot counter function
const countSpots = (day, appointments) => {
  let counter = 0;
  // loop through the weekday's appointment id array
  day.appointments.forEach(id => {
    const appointment = appointments[id];
    if (appointment.interview === null) {
      counter ++;
    }
  })
  return counter;
}

// Counts appointments for day that have null interview
const updateSpots = function (day, days, appointments) {
  // select day
  const dayCopy = days.find(elem => elem.name === day)

  // spots available for that day
  const availableSpots = countSpots(dayCopy, appointments);
  // update spot state with map to not alter original state
  const result = days.map(elem => {
    if (elem.name === day) {
      return {...elem, spots: availableSpots };
    }
    return elem;
  })

  return result;
};


export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });

  const bookInterview = (id, interview) => {
    // let days;

    // isNewAppointment(state, id)
    //   ? days = updateSpots([...state.days], id, -1)
    //   : days = state.days;

    

    const days = updateSpots(state.day, state.days, state.appointments)

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

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

    const days = updateSpots(state.day, state.days, state.appointments)

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