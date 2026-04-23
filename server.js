const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// ✅ MongoDB Atlas - الرابط الصح (اتصال واحد فقط)
mongoose.connect('mongodb://127.0.0.1:27017/cvly_pro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ================== Schemas ==================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const cvSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    data: Object,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const CV = mongoose.model('CV', cvSchema);

// ================== Auth ==================
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashed });
        await user.save();

        res.json({ msg: 'User created' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid email' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: 'Wrong password' });

        const token = jwt.sign({ id: user._id }, 'secretkey');

        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// ================== CV ==================
app.post('/cv', async (req, res) => {
    try {
        const cv = new CV(req.body);
        await cv.save();
        res.json(cv);
    } catch (err) {
        res.status(500).json({ msg: 'Error saving CV' });
    }
});

// ================== Server ==================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});