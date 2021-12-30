// const { json } = require('express/lib/response');
const mongoose = require('mongoose');

const PostSchema = {
    title: String,
    category: String,
    date: String,
    userName: String,
    image: String,
    time: String,
    likes: Array
}

const postDetail = mongoose.model("postDetail", PostSchema);

module.exports = postDetail;