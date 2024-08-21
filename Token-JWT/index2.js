const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Database Connection
mongoose.connect('mongodb://127.0.0.1/expert', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('DB connected successfully'))
.catch((err) => console.log('Error', err));

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// JWT Secret Key
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Profile Schema
const ProfileSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
});

const Profile = mongoose.model('Profile', ProfileSchema);

// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        next();
    });
};

// Routes
// Register a new user
app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Profile({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
        console.log(newUser)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Profile.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
app.post('/auth/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Read Profile
app.get('/profile/:id', authMiddleware, async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Profile
app.put('/profile/:id', authMiddleware, upload.single('profileImage'), async (req, res) => {
    try {
        const { username, email } = req.body;
        const updateData = { username, email };

        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(updatedProfile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Profile
app.delete('/profile/:id', authMiddleware, async (req, res) => {
    try {
        const deletedProfile = await Profile.findByIdAndDelete(req.params.id);

        if (!deletedProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Search Profiles
app.get('/profile/search', authMiddleware, async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const profiles = await Profile.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        });

        if (profiles.length === 0) {
            return res.status(404).json({ message: 'No profiles found' });
        }

        res.json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start the Server
app.listen(port, () => console.log(`App is running on port ${port}`));

// const express = require('express')
// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const cors = require('cors')
// const jwt = require('jsonwebtoken')
// const app = express();


// const port = 3000
// mongoose.connect("mongodb://127.0.0.1/expert")
// .then(()=> console.log('DB connected successfully'))
// .catch((err)=> console.log('Error', err))

// app.use(express.json())
// app.use(cors())


// app.listen(()=> console.log(`app is running ${port}`))