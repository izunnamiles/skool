const express = require('express');
const app = express();
const routes = require('./router');
const { urlencoded } = require('express');


app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use('/api/v1', routes);

//comment during testing
app.listen(process.env.PORT || '3000', () => {
  console.log(`Server is running on port: ${process.env.PORT || '3000'}`);
});

module.exports = app