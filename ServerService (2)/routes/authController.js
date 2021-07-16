const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/auth/register", async(req, res) => {
try
{
    let newUser = new User();
    newUser.full_name = req.body.FullName;
    newUser.email = req.body.Email;
    newUser.password = req.body.Password;
    newUser.role=req.body.Role;
    await newUser.save();
    let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
        expiresIn: parseInt(process.env.ACCESS_TOKEN_LIFE) // 1 week
    });
    res.json({
        success: true,
        status_code:  201,
        token: token,
        user:newUser,
        message: "User registered successfully "
    });
}
catch (err) {
    console.log(err);
    res.status(500).json({
    success: false,
    status_code: 500,
    message: err
    });
}
});

/* Profile Route */
router.get("/auth/profile", verifyToken, async (req, res) => {
try
{
    let foundUser = await User.findOne({ _id: req.decoded._id });
    if (foundUser)
    {
    res.json({
        success: true,
        status_code:  201,
        user: foundUser,
        message: "User profile fetched successfully !"
    });
    }
} catch (err) {
    console.log(err);
    res.status(500).json({
    success: false,
    status_code: 500,
    message: err.message
    });
}
});

/* Login Route */
router.post("/auth/login", async (req, res) => {
    try
    {
      let foundUser = await User.findOne({email: req.body.Email});
      if (!foundUser) {
        res.json({
          success: true,
          status_code:  403,
          message: "Authentication failed, Email not registered !"
        });
      }
      if(foundUser.password==req.body.Password)
      {
        let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
            expiresIn:parseInt(process.env.ACCESS_TOKEN_LIFE) // 1 week 7*24*60*60 sec || 3 hour => 3*60*60
        });
        res.json({
            success: true,
            status_code:  201,
            token: token,
            user:foundUser,
            message: "User logged successfully !"
          });
      }
      else{
        res.json({
            success: true,
            status_code:  201,
            message: "User password doesn't matched !"
        });
      }
    }
    catch (err)
    {
      console.log(err);
      res.status(500).json({
        success: false,
        status_code: 500,
        message: err.message
      });
    }
  });

module.exports=router