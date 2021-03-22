import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { updateSpots } from 'helpers/selectors';

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { /* insert logic */ }
      case SET_APPLICATION_DATA:
        return { /* insert logic */ }
      case SET_INTERVIEW: {
        return /* insert logic */
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const initialState = {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  };
  
  const [state, dispatch] = useReducer(reducer, initialState);

  // const [state, setState] = useState({
  //   day: 'Monday',
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });
  
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