// spot counter function
export const countSpots = (day, appointments) => {
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
export const updateSpots = function (day, days, appointments) {
  // select day
  const dayCopy = days.find(elem => elem.name === day)

  // spots available for that day
  const spots = countSpots(dayCopy, appointments);
  // update spot state with map to not alter original state
  console.log('new day copy', dayCopy);
  
  console.log('days', days)
  
  const result = days.map(elem => {
    if (elem.name === day) {
      return {...elem, spots };
    }
    return elem;
  })


  // // loop through the days to find spots
  // days.forEach(day => {
  //     let counter = 0;
  //     console.log(day.name);
  
  //     // if interview is null, then count
  
  //     for (let appointment in appointments) {
  //       if (appointments[appointment].interview === null && day.appointments.includes(appointments[appointment].id)) {
  //         counter ++;
  //       }
  //     }
  //     day.spots = counter;

  // })
  
  // return days;

  return result;
};