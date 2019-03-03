const milliseconds = timeInMilliseconds => timeInMilliseconds;
const seconds = timeInSeconds => milliseconds(timeInSeconds * 1000);
const minutes = timeInMinutes => seconds(timeInMinutes * 60);

module.exports = {
  milliseconds,
  seconds,
  minutes
};
