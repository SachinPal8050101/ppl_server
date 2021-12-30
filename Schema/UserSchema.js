const mongoose = require('mongoose');

const userSchema = {
    userName: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String
}

const userDetail = mongoose.model("UserDetail", userSchema);

module.exports = userDetail;