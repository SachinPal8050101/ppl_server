const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./Routes/UserRoutes");
const postRoutes = require("./Routes/PostRoutes");
const formData = require("express-form-data");
const fileupload = require("express-fileupload");

app.use(fileupload());

// const bodyParser = require('body-parser')
// const multer = require('multer');
app.use(express.urlencoded());
// app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(formData.parse());

var path = require('path');
app.use(express.static(path.join(__dirname, 'Routes')));

mongoose
	.connect(
		"mongodb://127.0.0.1:27017/pplDB",

		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("connection done !!");
	})
	.catch((err) => {
		console.log("Error ", err);
	});

app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.listen(3001, '192.168.43.28', function () {
	console.log("Express server is running on 3001");
});
