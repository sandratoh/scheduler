import { useEffect, useReducer } from 'react';
import axios from 'axios';
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from 'reducers/application';

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

  // Render server data
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

  // WebSocket server connection
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // sending message
    socket.onopen = () => {
      socket.send('ping');
    };

    // receiving data and dispatching action
    socket.onmessage = event => {
      const data = JSON.parse(event.data);

      data.type === 'SET_INTERVIEW' && dispatch(data);
    };
    
    return () => socket.close();

  }, [dispatch]);

  return { state, setDay, bookInterview, cancelInterview };
};