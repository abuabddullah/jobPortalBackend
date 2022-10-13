const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/error');


const app = express();


app.use(cors());
app.use(express.json());


//Route imports
const usersRouter = require('./routes/v1/usersRoutes');



//invoking routes
app.use('/api/v1', usersRouter);


// Not found route
app.all("*", (req, res) => {
    res.send("NO route found.");
});




// Middleware for Errors
app.use(errorMiddleware);


module.exports = app;