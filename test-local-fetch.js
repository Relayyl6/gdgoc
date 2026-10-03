const http = require('http');
http.get('http://localhost:3000/events', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data.includes('Build with AI: Gemini API') ? 'Found event!' : 'Not found');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
