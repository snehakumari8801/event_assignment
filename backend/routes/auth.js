const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();
require('dotenv').config()

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Log the hashed password

    // Create a new user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // Remove password from response
    user.password = undefined;

    return res.status(201).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error during registration:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);
    

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please sign up.",
      });
    }

    console.log("Hashed user Password:", user.password); // Log the hashed password


    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Create JWT payload
    const payload = {
      email: user.email,
      id: user._id,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    // Remove password from user object
    user.password = undefined;

    // Set token in cookies
    const options = {
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "User login successful",
    });
  } catch (error) {
    console.error("Error during login:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "Login failure. Please try again.",
    });
  }
});

module.exports = router;


// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // Register a new user
// router.post("/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).send({
//         success: false,
//         message: "All Fields are required",
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists. Please sign in to continue.",
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//     });

//     return res.status(201).json({
//       success: true,
//       user,
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "User cannot be registered. Please try again.",
//     });
//   }
// });

// // Login a user
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(email,password);

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill in all required fields.",
//       });
//     }

//     const user = await User.findOne({ email });

//     console.log("user after login ", user)
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User is not registered. Please sign up.",
//       });
//     }

//     const payload = {
//       email: user.email,
//       id: user._id,
//     };

//     console.log("payload ", payload)

//     // Compare the provided password with the stored hashed password
//     if (await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign(payload, process.env.SECRET_KEY, {
//         expiresIn: "24h",
//       });

//       // Set the token in the cookie and send response
//       user.token = token;
//       user.password = undefined;

//       const options = {
//         expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production", // Only set secure flag in production
//       };

//       return res.cookie("token", token, options).status(200).json({
//         success: true,
//         token,
//         user,
//         message: "User login successful",
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Password is incorrect",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Login failure. Please try again.",
//     });
//   }
// });

// module.exports = router;

// // const bcrypt = require("bcryptjs");
// // const User = require("../models/User");
// // const jwt = require("jsonwebtoken");
// // const express = require("express");

// // require("dotenv").config();

// // const router = express.Router();

// // router.post("/register", async (req, res) => {
// //   try {
// //     const {  email, password } = req.body;
// //     if ( !email || !password ) {
// //       return res.status(403).send({
// //         success: false,
// //         message: "All Fields are required",
// //       });
// //     }

// //     // const existingUser = await User.findOne({ email });
// //     // if (existingUser) {
// //     //   return res.status(400).json({
// //     //     success: false,
// //     //     message: "User already exists. Please sign in to continue.",
// //     //   });
// //     // }

// //     // Hash the password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const user = await User.create({
// //       password: hashedPassword,
// //       email,
// //     });

// //     return res.status(200).json({
// //       success: true,
// //       user,
// //       message: "User registered successfully",
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "User cannot be registered. Please try again.",
// //     });
// //   }
// // });

// // // Login controller for authenticating users
// // router.post("/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     //console.log(email,password)

// //     if (!email || !password) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please fill in all required fields.",
// //       });
// //     }

// //     const user = await User.findOne({ email });

// //     //console.log("FIndOne user is " ,user)

// //     if (!user) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "User is not registered. Please sign up.",
// //       });
// //     }

// //     const payload = {
// //       email: user.email,
// //       id: user._id,
// //       role: user.role,
// //     };

// //     if (await bcrypt.compare(password, user.password)) {
// //       const token = jwt.sign(payload, process.env.SECRET_KEY, {
// //         expiresIn: "24h",
// //       });

// //       //user = user.toObject();
// //       user.token = token;
// //       user.password = undefined;

// //       const options = {
// //         expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
// //         httpOnly: true,
// //       };

// //       res.cookie("token", token, options).status(200).json({
// //         success: true,
// //         token,
// //         user,
// //         message: "User login successful",
// //       });
// //     } else {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Password is incorrect",
// //       });
// //     }
// //   } catch (error) {
// //     console.error(error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Login failure. Please try again.",
// //     });
// //   }
// // });

// // module.exports = router;
