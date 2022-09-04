## Backend Environment & Database connection
#### Environment Setup : _Folder বানানো + mongodb, mongoose, dotenv, express etc connect করে project এর foundation ready করা_


1. **"ExpressBoilerTemplate"** নামের একটা parent-folder বানাতে হবে যার  ভিতরে আরো দুটা folder বানাতে হবে "ExpressBoilerTemplate/**frontend**" & "ExpressBoilerTemplate/**backend**"
3. backend folder এর ভিতরে দুটা file বানাতে হবে "ExpressBoilerTemplate/backend/**server.js**" & "ExpressBoilerTemplate/backend/**app.js**"
4. এবার terminal দিয়ে **"ExpressBoilerTemplate"** folder এ _**npm init**_ command দিতে হবে, package name দিতে হবে **ExpressBoilerTemplate**, entry point দিতে হবে **backend/server.js** বাদ বাকি সব step ok ok করে দিতে হবে
####

```http
npm init
package name : ExpressBoilerTemplate
entry point : backend/server.js
```

####
5. আবারো terminal দিয়ে "**ExpressBoilerTemplate**" folder এ npm দিয়ে **express, mongoose, dotenv, cors** install করতে হবে
####

```http
npm i express mongoose dotenv cors
```
####

6. এবার "ExpressBoilerTemplate/backend/**app.js**" file এ **express, cors** কে import করে তা দিয়ে **app** বানিয়ে **_app.use()_** method দিয়ে **_cors() & express.json()_** function কে invoke করে তারপর app কে এই file থেকে **export** করে দিয়ে হবে যাতে অন্য file থেকেও এই app টার access পাওয়া যায়
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/app.js]]
"""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json())
module.exports = app;
```

####
7. এবার backend folder এ একটা config নামের folder বানাতে হবে "ExpressBoilerTemplate/backend/**config**" তার ভিতরে একটা **_.env_** file বানাতে হবে "ExpressBoilerTemplate/backend/config/**config.env**" এবং এই file এ একটা **_PORT_** নামের environment variable বানাতে হবে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/config/config.env]]
""""""""""""""""""""""""""""""""""""""""""""""""""""""
PORT=5000
```

####
8. এবার "ExpressBoilerTemplate/backend/**server.js**" file এ **app, dotenv** কে import করে নিতে হবে, তারপর **_dotenv_** কে file এর সাথে connect করে নিতে হবে (_line: 4_) এবং **_app.listen()_** method দিয়ে একটা server establish করতে হবে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/server.js]]
""""""""""""""""""""""""""""""""""""""""""""""
const app = require("./app");
const dotenv  = require("dotenv")
//config
dotenv.config({ path: "backend/config/config.env" });
app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
```

####
9. এবার nodemon দিয়ে server কে run করার জন্য **_start & start-dev_** scrip add করতে হবে "ExpressBoilerTemplate/**package.json**" file এ
####

```http
[[FILENAME : ExpressBoilerTemplate/package.json]]
"""""""""""""""""""""""""""""""""""""""""
"start": "node backend/server.js",
"start-dev": "nodemon backend/server.js",
```


## Backend Route Test without DB Connected : 

####
10. backend folder এ দুটা নতুন folder বানাতে হবে "ExpressBoilerTemplate/backend/**controllers**" & "ExpressBoilerTemplate/backend/**routes**" তারপর **controllers** folder এ **users** এর জন্য একটা file বানাতে হবে "ExpressBoilerTemplate/backend/controllers/**usersController.js**" । 

>_এই **contoller** file গুলো মূলত **API** এর **async** function কে hold করে_
11. **usersController** **_API_** এর জন্য **_getAllUsers_** function বানাতে হবে যা **inline exported** হবে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/controllers/usersController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
// Get All Product
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    success: true,
    message: "getAllUsers route is working",
  });
});
```

####
12. এবার "ExpressBoilerTemplate/backend/**routes**" folder এ **_getAllUsers** function_ কে **_get request দিয়ে routing_** করার জন্য জন্য একটা file বানাতে হবে "ExpressBoilerTemplate/backend/routes/**usersRoutes.js**"
13. "ExpressBoilerTemplate/backend/routes/**usersRoutes.js**" file এ **express, getAllUsers** কে import করে **express** এর সাহায্যে **_express.Router()_** method দিয়ে **router** create করতে হবে, এরপর **_router.route().get()_** method দিয়ে প্রতিটা **API requests** এর aginst এ route বানাতে হবে এবং সবার নিচে **router** কে exports করে দিতে হবে । 

>_এখানে মূলত সকল **API**s এর জন্য যে http req আছে যেমন **.get, .post, .put, .delete** আছে সেগুলোকে **pathName** অনুযায়ি line by line declare করা হয় এবং **pathName** যদি same হয় তাহলে সবগুলো request কে একই line এও declare করা যায়_
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/routes/usersRoutes.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { getAllUsers } = require("../controllers/usersController");



const router = express.Router();



router.route("/all").get(getAllUsers);







module.exports = router;
```

####
14. এবার "ExpressBoilerTemplate/backend/**app.js**" file এ **_usersRoutes_** variable কে import করে তারপর **_app.use()_** method দিয়ে **commonURL & usersRoutes** সহ invoke করতে হবে। 

>
>>_এই **commonURL** সব সময় url এর সাথে fixed থাকে_
>
>> এখানে **commonURL** হচ্ছে **"_/user_"**
>
> পাশাপাশি এখানে **_NOT FOUND_** route বানিয়ে দেয়া হয়েছে যাতে যেকোন ভুল লিঙ্ক এ **req** দিলে যাতে **error** না খেয়ে একটা meaningfull message আসে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/app.js]]
"""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const cors = require('cors')


const app = express();


app.use(cors())
app.use(express.json())


//Route imports
const usersRouter = require('./routes/usersRoutes');



//invoking routes
app.use('/user', usersRouter);


// Not found route
app.all("*", (req, res) => {
    res.send("NO route found.");
});




module.exports = app;
```

####
15. এবার **nodemon** দিয়ে project run করার জন্য terminal দিয়ে **"ExpressBoilerTemplate"** folder এ _**npm run start-dev**_ command দিতে হবে
####

```http
[[FOLDERNAME : ExpressBoilerTemplate]]
""""""""""""""""""""""""""""""
npm run start-dev
```

####
16. এবার **postman software** দিয়ে project test করার জন্য **Ecommerce** নামের একটা নতুন collection বানাতে হবে, তারপর সেখানে **_http://localhost:5000/user/all_** link এর against এ একটা **GET request** generate করতে হবে
####

####
![postman success screenshot](https://i.ibb.co/P5hKGfb/Capture.png)
####




## Connect Database : 

####
17. প্রথমে "ExpressBoilerTemplate/backend/config/**config.env**" file এ **_DB_URI_** নামের আরো একটা environment variable বানাতে হবে

>
>> এই **_DB_URI_** টা **MongoCompass** এর জন্য কেবল অর্থাৎ যখন direct **mongoDB** তে **database connenct** করা হবে তখন কিন্তু এইটাকে change করে **mongoDB** database এর **_DB_URI_** ব্যবহার করতে হবে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/config/config.env]]
""""""""""""""""""""""""""""""""""""""""""""""""""""""
PORT=5000
DB_URI="mongodb://localhost:27017/Ecommerce"
```

####
18. Database connect করার জন্য "ExpressBoilerTemplate/backend/config/**database.js**" নামের একটা file বানাতে হবে, তারপর সেখানে **mongoose** কে import করে নিতে হুবে, এবার **connectDatabase** function এ নিচে দেখানো code এর মত করে **database connect** করে সবার নিচে **connectDatabase** কে এখান থেকে export করে দিতে হবে 

>তবে মনে রাখতে হবে বর্তমান version এ **_useCreateIndex: true_** লিখলে **error* দেয় তাই এই line টাকে **comment out** করে দিতে হবে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/config/database.js]]
""""""""""""""""""""""""""""""""""""""""""""""""""""""
const mongoose = require("mongoose");
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   // useCreateIndex: true, // this is not supported now
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
        console.log(err);
    });
};
module.exports = connectDatabase;
```

####
19. এবার "ExpressBoilerTemplate/backend/**server.js**" file এ **_connectDatabase_** function কে import করে invoke করে দিতে হবে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/server.js]]
""""""""""""""""""""""""""""""""""""""""""""""
const app = require("./app");
const dotenv  = require("dotenv");
const connectDatabase = require("./config/database");
//config
dotenv.config({ path: "backend/config/config.env" });
// Connecting to database
connectDatabase();
app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
```





## Backend errorhandlling with node.js in built _Error_ method

#### Handle Errors for : Wrong Mongodb Id, async error handleing, Mongoose duplicate key error, Wrong JWT, JWT EXPIRE error, http status code error

### Handling Wrong Mongodb Id error

####
1. এবার backend folder এর ভিতরে "ExpressBoilerTemplate/backend/**utils**" folder বানিয়ে তার ভিতরে একটা file বানাতে হবে "ExpressBoilerTemplate/backend/utils/**errorhander.js**" নামের
2. এবার এখানে আমরা একটা js class generate করব **ErrorHandler** নামের যা inherited হবে node.js এর  default **_Error_ Class** feature থেকে  , এরপর সবার নিচ থেকে **_ErrorHandler_** class টাকে export করে দিবা যাতে অন্যসব file থেকে এর সাহায্যে আমরা প্রয়োজনিয় error generate করতে পারি।

>
>> **ErrorHandler** class টাতে, **constructor** এর সাহায্যে আমরা error কে  invoke করার  সময়  যে **agrument** হিসেবে **message** & **statusCode** পাঠাব তা recieve করব।
>
>> **super** এর সাহায্যে আমরা  **super or parent class অর্থাত "Error"** Class এর   message show করার যে default **constructor** আছে  তাকে **chile class _ErrorHandler_** এ **inherrit** করেছি
>
>> এখানে **super** বলতে মূলত **parent class** এর constructor কে বুঝায়
>
>> **captureStackTrace** হচ্ছে **"Error"**  Class এর  default function যাকে আমরা  **inherrit** করেছি। এই  **captureStackTrace** function ই মুলত কোন error আসলে তা আমাদের **stack** এ trace করে দেয়  দুটা parameter এর সাহায্যে যার একটি হচ্ছে, **(১) child class নিজেই এক্ষেত্রে "ErrorHandler"** এবং ২য় হচ্ছে, **(২) child class এর constructor**


####

```http
[[FILENAME : ExpressBoilerTemplate/backend/utils/errorhander.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor);
    }
    
}
module.exports = ErrorHandler
```

####
3. এবার এই  erro কে  conditionally implement করার জন্য আমাদের একটা  **middleware** বানাতে হবে এজন্য, backend folder এর ভিতরে "ExpressBoilerTemplate/backend/**middleware**" folder বানিয়ে তার ভিতরে একটা file বানাতে হবে "ExpressBoilerTemplate/backend/middleware/**error.js**" নামের
4. এই "ExpressBoilerTemplate/backend/middleware/**error.js**" file এ  **_ErrorHandler_** কে import  করি নিব , তারপর   **module.exports** করব একটা **callback** function কে যা চারটি **parameter** নিবে **_err,req,res,next_**

> এটা মূলত **express.js** এর default error handling method , extra হিসেবে just কিছু **condition** implement করা হয়েছে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/middleware/error.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
module.exports = errorMiddleware 
```


####
5. এবার "ExpressBoilerTemplate/backend/**app.js**" file এ  এই   **_errorMiddleware_** কে import করে নিব, তারপর  **_app.use()_** method এর সাহায্যে সর্ব শেষ middleware হিসেবে **_errorMiddleware_** কে রাখব 

> এটাই মূলত  নিয়ম যে, **errorMiddleware** সবার last এ invoke করা থাকে যাতে অন্যকোন একটা middleware এ কোন সমস্যা হলে programm jump করা এই last middleware এ hit করবে তারপর error show করবে 
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/app.js]]
"""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const cors = require('cors')
const errorMiddleware = require("./middleware/error");


const app = express();


app.use(cors())
app.use(express.json())


//Route imports
const usersRouter = require('./routes/usersRoutes');



//invoking routes
app.use('/user', usersRouter);


// Not found route
app.all("*", (req, res) => {
    res.send("NO route found.");
});




// Middleware for Errors
app.use(errorMiddleware);


module.exports = app;
```

####
7. এবার **postman software** এ test করব **_mongDb id_** last এর digit 9 কে অন্যকিছু দিয়ে replace করব
####
![postman success screenshot](https://i.ibb.co/9GTfJcd/xcv.png)
####











### Handling asynchronus error
<br/>
####
8. এবার **_asynch error_** কে handle করার জন্য  আরো একটা middleware বানাতে হবে ExpressBoilerTemplate/backend/middleware/**catchAsyncErrorsMiddleware.js** নামের,

> এই **middleware** টা মূলত **parameter** হিসেবে একটা  **function** কে  recieve করবে তারপর  javaScript এর default class **Promise** এর **Promise.resolve().catch()** method এর সাহায্যে যদি কোন error না থাকে তাহলে **try** করবে আর থাকলে **catch** করে **next** করবে
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/middleware/catchAsyncErrorsMiddleware.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
module.exports = catchAsyncErrorsMiddleware
```

####
9. এবার "ExpressBoilerTemplate/backend/controllers/**usersController.js**" file এ **catchAsyncErrorsMiddleware** কে import করে নিয়ে তারপর সবগুলো asynchronus function এর যেখানে আমরা  **_asynch()_** function use করেছিলাম তাকে **_catchAsyncErrorsMiddleware_** দিয়ে নিচের মত মুড়িয়ে দিব,  

> **catchAsyncErrorsMiddleware(async(req,res,next){})**
####

```http
[[FILENAME : ExpressBoilerTemplate/backend/controllers/usersController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const ErrorHandler = require("../utils/ErrorHandler");


// Get All Product
exports.getAllUsers = catchAsyncErrorsMiddleware(async(req, res) => {
  res.status(200).json({
    success: true,
    message: "getAllUsers route is working",
  });
})
```

####
10. এবার **postman software** এ test করব
####
![postman success screenshot](https://i.ibb.co/LpQnFPj/xcv.png)
####



### Handling _unhadled promise rejection_ error
<br/>

> **_unhadled promise rejection_** error বলতে , কোন কারনে link এ কোণ spelling mistake হয়ে গেলে যাতে server forcedly shut down হয়ে যায় সেই কাজ করা
> **unhadled promise rejection error** কে অবশ্যি ExpressBoilerTemplate/backend/**server.js** file এর সবার নিচে just **export** করার আগে define করতে হয়
####
11. এজন্য  ExpressBoilerTemplate/backend/**server.js** file এ গিয়ে প্রথমে **_app.listen()_** কে একটা  **_server_** নামের varibale এ রাখব, তারপর **_process.on()_** method এ  **_unhandledRejection_** event use করে  একটা **callback** function input দিব যা প্রয়োজনিয় message **console** করবে, **server** close করবে, **process** exit করবে
####

> **server.close()** method ও একটা **callback** function recieve করবে যেখানে **process.exit()** method invoke 
####
```http
[[FILENAME : ExpressBoilerTemplate/backend/server.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
//config
dotenv.config({ path: "backend/config/config.env" });
// Connecting to database
connectDatabase();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);  
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
```

####
10. এবার **terminal** এ test  করার জন্য আগে কিছু error create করতে হবে তাই ExpressBoilerTemplate/backend/config/**database.js** file এর **_.catch_()**  method কে comment out করে দিব যাতে  error auto  catch  হয় এ solve না হয়ে যায় এবং

####
```http
[[FILENAME : ExpressBoilerTemplate/backend/config/database.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const mongoose = require("mongoose");
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true, // this is not supported now
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    /* .catch((err) => {
        console.log(err);
    }); */
};
module.exports = connectDatabase;
```

#### 

####
11. এবং ExpressBoilerTemplate/backend/config/**config.env** file এর  **_DB_URI_** variable এর value নষট করে দিব  দেখব **terminal** এ error আসবে

####
```http
[[FILENAME : ExpressBoilerTemplate/backend/config/config.env]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
PORT=5000
DB_URI="mongo://localhost:27017/Ecommerce"
```
#### 

####
![postman success screenshot](https://i.ibb.co/LpQnFPj/xcv.png)
####

####
12. test success হলে again ExpressBoilerTemplate/backend/config/**config.env** file এর  **_DB_URI_** variable এর value ঠিক করে দিব

####
```http
[[FILENAME : ExpressBoilerTemplate/backend/config/config.env]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
PORT=5000
DB_URI="mongodb://localhost:27017/Ecommerce"
```
#### 



### Handling _uncaught_ error
<br/>

> **_uncaught_** error বলতে ,  যদি project এ কোণ  **undefined variable** থাকার কারনে যেই error টা দেয় তাকে handle করতে হবে
> **_uncaught_** কে অবশ্যি ExpressBoilerTemplate/backend/**server.js** file এর সবার  উপরে define করতে হয়
####
13. এজন্য  ExpressBoilerTemplate/backend/**server.js** file এ গিয়ে  একদম শুরুতে  **_process.on()_** method এ  **_uncaughtException_** event use করে  একটা **callback** function input দিব যা প্রয়োজনিয় message **console** করবে, তারপর **process** exit করবে
####

> **server.close()** method কে invoke  করা লাগবে না
####
```http
[[FILENAME : ExpressBoilerTemplate/backend/server.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
//config
dotenv.config({ path: "backend/config/config.env" });
// Connecting to database
connectDatabase();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);  
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
```

####
14. এবার **terminal** এ test  করার জন্য আগে কিছু error create করতে হবে তাই ExpressBoilerTemplate/backend/**server.js** file এ কোণ undefined variable কে  **console** করে দেখা যেতে পারে

####
```http
[[FILENAME : ExpressBoilerTemplate/backend/server.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
console.log(testUncaughtError)
//config
dotenv.config({ path: "backend/config/config.env" });
// Connecting to database
connectDatabase();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);  
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
```

#### 

####
![terminal error screenshot](https://i.ibb.co/7K7Dxv6/xcv.png)
####

####
15. এবং ExpressBoilerTemplate/backend/**server.js* file এর  *undefined variable কে comment out করে দেই

####
```http
[[FILENAME : ExpressBoilerTemplate/backend/server.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
// console.log(testUncaughtError)
//config
dotenv.config({ path: "backend/config/config.env" });
// Connecting to database
connectDatabase();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);  
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
```
#### 

### Handling _castError_ error
<br/>

> **_castError_** error বলতে ,  যদি  mongoDB তে  **_GET req_** করার সময় **id** এর জায়গায় অন্য কিছু দেইয় অথবা **id** shortend হয়ে যায় তখন এই error দেয়

####
16. এজন্য  ExpressBoilerTemplate/backend/middleware/**error.js** file এ গিয়ে  **_errorMiddleware_** এ **_err.stack_** কে console  করে সেখান থেকে **_err.name_** এর উপরে condtion apply করে এই  error টা handle করব
####
```http
[[FILENAME : ExpressBoilerTemplate/backend/middleware/error.js file]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    // console.log(err.stack);
    // Wrong Mongodb Id error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}
module.exports = errorMiddleware;
```

####
![postman screenshot](https://i.ibb.co/pvxZJYg/xcv.png)
####


