const express = require("express");
const router = express();
const postSchema = require("../Schema/PostSchema");
const fs = require('fs');

router.get("/", (req, res) => {
	res.redirect("http://localhost:3000");
});

router.route('/upload').post((req, res) => {
	console.log('Req.files => ', req);
	console.log("REQ.BODY>>>", req.body);
	if (!req.files || Object.keys(req.files).length === 0) {
		console.log('No photo selected');
		return res.status(400).send('No files were uploaded.');
	}
	var sampleFile = req.files.image;
	var path =sampleFile.data
	console.log('SampleFile => ', sampleFile);
	// fs.readFile(sampleFile.name, function (err, data) {
		var path = './Routes/post_images/' + sampleFile.name;
		fs.writeFile(path,sampleFile.data, function (err) {
			console.log(err);
		});
	// });

	const date = new Date();
	const { title, category, userName, likes = [] } = req.body || {};
	// console.log(fullName);
	const posts = new postSchema({
		title,
		category,
		userName,
		likes,
		// image: 'post_images/' + sampleFile.name,
		time: new Date().toLocaleTimeString(),
		date: new Date().toLocaleDateString(),
	})
	// res.save("---");

	// posts.save()
	// 	.then((result) => {
	// 		console.log("route>>>post>>>upload>>>", result);
	// 		res.send({
	// 			success: true,
	// 			data: result,
	// 			message: 'Post Uploaded'
	// 		});
	// 	})
	// 	.catch((err) => console.log("route>>>post>>>err>>>", err));

});

// $ git remote set-url origin https://<>:<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>@github.com/path/to/repo.git

// git remote set-url origin https://github.com/varunsaini21/PPL.git
// git remote add origin https://github.com/varunsaini21/ppl_server.git
router.route("/present").get((req, res) => {
	postSchema.find()
		.then(posts => {
			res.json(posts);
			// console.log("route>>>present>>>res", posts);
		})
		.catch(err => console.log("route>>>present>>>error", err));
})

router.route('/filterdata').post((req, res) => {
	postSchema.find({ category: req.body.search }, (err, data) => {
		res.send(data);
	});
});

router.route('/likes').post((req, res) => {
	const { userId, postId } = req.body || {};
	console.log("post like button", userId, postId);
	postSchema.findOne({ '_id': postId })
		.then((result) => {
			const likearr = result.likes;
			let key = false;
			for (x in likearr) {
				if (likearr[x] === userId) {
					key = true;
				}
			}
			if (key === true) {
				postSchema.updateOne({ '_id': postId }, { $pull: { likes: userId } })
					.then((res) => {
						console.log("POST UNLIKED");
					});
			}
			else {
				postSchema.updateOne({ '_id': postId }, { $push: { likes: userId } })
					.then((res) => {
						console.log("POST LIKED");
					});
			}
		})
})

module.exports = router;