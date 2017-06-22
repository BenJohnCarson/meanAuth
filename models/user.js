const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const config = require('../config/database');

// User Schema
const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


UserSchema.statics.getUserById = function(id, cb) {
    this.findById(id, cb);
};

UserSchema.statics.getUserByUsername = function(username, cb) {
    const query = {username: username};
    this.findOne(query, cb);
};

UserSchema.statics.addUser = function(newUser, cb) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(cb);
        });
    });
};

UserSchema.statics.comparePassword = function (candidatePassword, hash, cb) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        cb(null, isMatch);
    });
}

module.exports = mongoose.model('User', UserSchema);
