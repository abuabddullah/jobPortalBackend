```http
[[[FileName: D:\projectsACC\Node-Mongo Advanced Crash Course\ACC_assignment_01\backend\controllers\usersController.js]]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""


// update multiple users information based on given id and information through body
exports.updateMultipleUsers = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const users = await userModel.updateMany(
        { _id: { $in: req.body.ids } },
        { $set: { name: req.body.name } }
    );
    res.status(200).json({
        success: true,
        message: "updateMultipleUsers route is working",
        users,
    });
})

```
<br/>
<br/>
<br/>
<br/>


```http
[[[FileName: D:\projectsACC\Node-Mongo Advanced Crash Course\ACC_assignment_01\backend\routes\usersRoutes.js]]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""


const express = require("express");
const { getAllUsers, createUser, updateUser, deleteUser, getUserDetails, getRandomUser, updateMultipleUsers } = require("../controllers/usersController");



const router = express.Router();



router.route("/bulk-update").patch(updateMultipleUsers);



module.exports = router;

```
<br/>
<br/>
<br/>
<br/>


```http
[[[Postman or Thunderclient request]]]
""""""""""""""""""""""""""""""""""""""

http://localhost:5000/user/bulk-update




Body(JSON):
"""""""""""
{
  "ids": ["6312b45df5838d8f835baf90","6312b466f5838d8f835baf94"],
  "name": "Bangladeshi"
}



```
<br/>
<br/>
<br/>
<br/>