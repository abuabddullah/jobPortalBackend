const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/error');


const app = express();


app.use(cors());
app.use(express.json());


//Route imports
const usersRouter = require('./routes/v1/usersRoute');
const jobsRouter = require('./routes/v1/jobsRoute');



//invoking routes
app.use('/api/v1', usersRouter);
app.use('/api/v1', jobsRouter);


// Not found route
app.all("*", (req, res) => {
    res.send("NO route found.😜");
});




// Middleware for Errors
app.use(errorMiddleware);


module.exports = app;