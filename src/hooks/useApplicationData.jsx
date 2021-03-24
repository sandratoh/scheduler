import { useEffect, useReducer } from 'react';
import axios from 'axios';
import updateSpots from 'helpers/updateSpots';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {...state, day: action.day};
    case SET_APPLICATION_DATA:
      return {
        ...state, 
        days: action.days, 
        appointments: action.appointments, 
        interviewers: action.interviewers 
      };
    case SET_INTERVIEW:
      const { id, interview } = action;

      const appointment = {
        ...state.appointments[id],
        interview: {...interview}
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      const days = updateSpots(state.day, state.days, appointments)

      return {
        ...state,
        appointments,
        days
      }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

export default function useApplicationData() {
  const initialState = {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  };
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDay = day => dispatch({type: SET_DAY, day});

  const bookInterview = (id, interview) => {
    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then(res => {
        dispatch({
          type: SET_INTERVIEW,
          id,
          interview,
        });
      })
  };

  const cancelInterview = id => {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(res => {
        dispatch({
          type: SET_INTERVIEW,
          id,
          interview: null,
        })
      })
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      })
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
};