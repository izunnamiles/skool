const { urlencoded } = require('express');
const express = require('express');
const routes = require('./router');
const app = express();

app.use(express.json());
app.use(urlencoded({ extended:false }))

app.use('/api/v1', routes);

app.listen(process.env.PORT || '3000', () => {
  console.log(`Server is running on port: ${process.env.PORT || '3000'}`);
});