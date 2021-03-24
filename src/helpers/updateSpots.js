const countSpots = (day, appointments) => {
  let counter = 0;

  day.appointments.forEach(id => {
    const appointment = appointments[id];
    if (appointment.interview === null) {
      counter ++;
    }
  })

  return counter;
};

export default function updateSpots(day, days, appointments) {
  const dayCopy = days.find(elem => elem.name === day);

  const spots = countSpots(dayCopy, appointments);

  const result = days.map(elem => {
    if (elem.name === day) {
      return {...elem, spots };
    }
    return elem;
  })

  return result;
};
