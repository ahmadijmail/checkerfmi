const cron = require('cron');
const https = require('https');

const backendUrl = 'https://telegrambot-561l.onrender.com'; // Replace with your actual endpoint

const job = new cron.CronJob('0 */5 * * * *', function() {
  // This function will be executed every 5 minutes
  console.log('Pinging server to keep it awake');

  // Perform an HTTPS GET request to hit your backend api
  https.get(backendUrl, (res) => {
    if (res.statusCode === 200) {
      console.log('Ping successful');
    } else {
      console.error(`Ping failed with status code: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('Error during ping:', err.message);
  });
});


// Export the cron job if needed
module.exports = {
  job,
};
