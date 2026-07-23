const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: [true, 'Please provide username'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
    },
    email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
},
    password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
},
    role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
},
    isActive: {
    type: Boolean,
    default: true
}
}, {
        timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);