const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('.'));
app.use(express.json());

app.post('/save', (req, res) => {
  fs.writeFileSync('data.json', JSON.stringify(req.body));
  res.send({ status: 'Saved' });
});

app.get('/data', (req, res) => {
  if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json');
    res.json(JSON.parse(data));
  } else {
    res.json({});
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
