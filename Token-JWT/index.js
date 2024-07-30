const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

mongoose.connect('mongodb://127.0.0.1/college', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const classSchema = new mongoose.Schema({
  name: String,
  age: Number,
  sub: String
});

const dbmodel = mongoose.model("class", classSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);
const app = express();
app.use(express.json());
app.use(cors());

const mykey = 'shivampandey';

// User registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username: user.username }, mykey, { expiresIn: '1m' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

// Middleware to check JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Split "Bearer" and token
    jwt.verify(token, mykey, (err, user) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Create a new class entry
app.post("/postt", authenticateJWT, async (req, res) => {
  try {
    let data = new dbmodel(req.body);
    let result = await data.save();
    console.log('Created new class:', data);
    res.send(result);
  } catch (err) {
    console.error('Error creating entry:', err);
    res.status(500).send('Error creating entry');
  }
});

// Get all class entries
app.get("/gett", authenticateJWT, async (req, res) => {
  try {
    let data = await dbmodel.find();
    res.send(data);
    console.log('Fetched classes:', data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
});

// Delete a class entry
app.delete('/delete/:_id', authenticateJWT, async (req, res) => {
  try {
    let data = await dbmodel.deleteOne({ _id: req.params._id });
    res.send(data);
    console.log('Deleted class with id:', req.params._id);
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).send('Error deleting entry');
  }
});

// Update a class entry
app.put("/update/:_id", authenticateJWT, async (req, res) => {
  try {
    let data = await dbmodel.updateOne(
      { _id: req.params._id },
      { $set: req.body }
    );
    res.send(data);
    console.log('Updated class with id:', req.params._id);
  } catch (err) {
    console.error('Error updating entry:', err);
    res.status(500).send('Error updating entry');
  }
});

const port = 4000;
app.listen(port, () => console.log(`App is working on port ${port}`));





// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const app = express();
// const port = 3000;

// const User = require('./model/User');
// const Blog = require('./model/Blog');




// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/blogDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// // Middleware to check JWT
// const authenticateJWT = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (token) {
//     jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

// // User registration
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = new User({ username, password: hashedPassword });
//   await newUser.save();
//   res.status(201).send('User registered');
// });

// // User login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (user && await bcrypt.compare(password, user.password)) {
//     const token = jwt.sign({ username: user.username }, 'your_jwt_secret_key');
//     res.json({ token });
//   } else {
//     res.status(401).send('Invalid credentials');
//   }
// });

// // Create a new blog post
// app.post('/blogs', authenticateJWT, async (req, res) => {
//   const { title, content } = req.body;
//   const newBlog = new Blog({ title, content, author: req.user.username });
//   await newBlog.save();
//   res.status(201).send('Blog created');
// });

// // Get all blog posts
// app.get('/blogs', async (req, res) => {
//   const blogs = await Blog.find();
//   res.json(blogs);
// });

// // Update a blog post
// app.put('/blogs/:id', authenticateJWT, async (req, res) => {
//   const { id } = req.params;
//   const { title, content } = req.body;
//   const blog = await Blog.findById(id);
//   if (blog.author !== req.user.username) {
//     return res.sendStatus(403);
//   }
//   blog.title = title;
//   blog.content = content;
//   await blog.save();
//   res.send('Blog updated');
// });

// // Delete a blog post
// app.delete('/blogs/:id', authenticateJWT, async (req, res) => {
//   const { id } = req.params;
//   const blog = await Blog.findById(id);
//   if (blog.author !== req.user.username) {
//     return res.sendStatus(403);
//   }
//   await blog.remove();
//   res.send('Blog deleted');
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });















// const express = require("express");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const userMiddleware  = require("./middleware/auth.middleware");
// const authRouter = require("./router/routes");

// dotenv.config();

// const app = express();
// const port = process.env.PORT;

// //middleware provided by Express to parse incoming JSON requests.
// app.use(express.json()); 

// mongoose.connect(process.env.MONGODB_URL).then(() => {
//   console.log("MongoDB is connected!");
// });

// app.use('/auth', authRouter);

// app.get("/protected", userMiddleware, (req, res) => {
//   const { username } = req.user;
//   res.send(`This is a Protected Route. Welcome ${username}`);
// });

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });











// const express = require("express");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");

// dotenv.config();

// const app = express();
// const port = process.env.PORT;

// //middleware provided by Express to parse incoming JSON requests.
// app.use(express.json()); 

// mongoose.connect(process.env.MONGODB_URL).then(() => {
//   console.log("MongoDB is connected!");
// });

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
