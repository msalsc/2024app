const withCurrentDay = () => {
  const day = new Date().getDay();
  const daylist = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daylist[day];
};

export default withCurrentDay;
