var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema ({
    fullName: {
        type: String,
        required: [true, "Full Name not provided"],
    },
    email: {
        type: String,
        unique: [true, "Email already exists. Please use a new email."],
        lowercase: true,
        trim: true,
        required: [true, "Email not provided"],
        validate: {
            validator: function (v) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    password: {
        type: String,
        required: true
    },
    preferences: {
        type: String,
        enum: ["business","entertainment","general","health","science","sports","technology"],
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);