const express = require("express");
const router = express();
const userSchema = require("../Schema/UserSchema");

router.get("/", (req, res) => {
	res.redirect("http://localhost:3000");
});

router.route("/signup").post((req, res) => {
	const { userName, password, email, firstName, lastName } = req.body || {};
	const user = new userSchema({
		userName,
		password,
		email,
		firstName,
		lastName,
	});

	user
		.save()
		.then((result) => {
			console.log("route>>>signup>>>res>>>", result);
			res.send({
				success: true,
				data: result,
			})

		})
		.catch((err) => console.log("route>>>signup>>>err>>>", err));
});

router.route("/login").post((req, res) => {
	const { email, password } = req.body || {};
	const user = new userSchema({
		email,
		password
	});

	userSchema.findOne({ email: email, password: password }, function (err, result) {
		// if (err) throw err;
		// console.log(result);
		if (!result) {
			console.log('Invalid entry');
			res.send("false");
		}
		else {
			console.log('----------------------Login Successful--------------------\n',
				result,
				'\n-----------------------------------------------------------');
			res.send(result);
		}

	});
});

router.route('/forgot').post((req, res) => {
	const { email } = req.body || {};
	userSchema.findOne({ email: email }, function (err, result) {
		if (!result) {
			console.log('Email Not Found');
			res.send("not found");
		}
		else {
			console.log(email);
			res.send(email);
		}
	})
});

router.route('/reset').post((req, res) => {
	const { email, password, passwordAgain } = req.body || {};
	console.log(email + ' ' + password);
	userSchema.updateOne({ email: email }, { $set: { password: password } }, (err, result) => {
		console.log('Password changed', result);
		res.send('Password Changed');
	})
})

module.exports = router;