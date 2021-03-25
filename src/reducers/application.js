import updateSpots from 'helpers/updateSpots';

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    // case SET_DAY:
    //   return {...state, day: action.day};
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
        interview
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
