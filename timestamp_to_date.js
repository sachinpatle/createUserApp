exports.timestampToDate = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getFullYear()} : ${date.getMonth()+1} : ${date.getDate()}`
};

exports.timestampToTime = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getHours()} : ${date.getMinutes()}`
};

