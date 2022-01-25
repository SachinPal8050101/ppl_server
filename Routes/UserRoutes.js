const express = require("express");
const router = express();
const userSchema = require("../Schema/UserSchema");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

router.get("/", (req, res) => {
	res.redirect("http://localhost:3000");
});

function auth(req, res, next) {
	// console.log("REQ>QUERY", Object.keys(req.req));
	// token = req.query.token;

	// const userVerify = jwt.verify(token, "mynameisvarunsainiofhisarharyana");
	// console.log("USERVERIFY", userVerify);
	// userSchema.findOne({ _id: userVerify.user_id })
	// 	.then((result) => {
	// 		req.userId = result;
	next();
	// 	})
	// 	.catch((err) => {
	// 		console.log("UserRoutes.js>>>middleware(auth)>>>err", err);
	// 	})
}

router.route("/signup").post(async (req, res) => {
	const { userName, password, email, firstName, lastName } = req.body || {};
	const user = new userSchema({
		userName: userName.toLowerCase(),
		password,
		email: email.toLowerCase(),
		firstName,
		lastName,
	});

	const userDetail = await userSchema.findOne({ email: email.toLowerCase() });
	if (userDetail) {
		res.send({
			success: false,
			data: null,
			message: "Email already exists!!!"
		})
		return;
	}

	user
		.save()
		.then((result) => {
			console.log("userRoutes.js>>>SignUp>>>res>>>", result);
			res.send({
				success: true,
				data: result,
				message: "Account created!!"
			})

		})
		.catch((err) => console.log("route>>>signup>>>err>>>", err));
});

router.route("/login").post((req, res) => {
	const { email, password } = req.body || {};

	userSchema.findOne({ email: email.toLowerCase(), password }, async function (err, result) {
		// if (err) throw err;
		// console.log(result);
		if (!result) {
			console.log('Invalid entry');
			res.send({
				data: null,
				success: false
			});
		}
		else {
			console.log('----------------------Login Successful--------------------\n',
				result,
				'\n-----------------------------------------------------------');
			const token = await jwt.sign({
				user_id: result._id
				// email: result.email
			},
				"mynameisvarunsainiofhisarharyana"
			);
			res.send({
				data: result,
				success: true
			});
		}

	});
});

router.route('/forgot').post((req, res) => {
	const { email } = req.body || {};
	userSchema.findOne({ email }, function (err, result) {
		if (!result) {
			console.log("email: ", email, 'Email Not Found');
			console.log(req.body);
			res.send({
				success: false,
				message: "Email Not Found"
			});
		}
		else {
			console.log(email);
			// ------------------------------------------------------------------------------------
			try {

				const token = jwt.sign({
					user_id: result._id
					// email: result.email
				},
					"mynameisvarunsainiofhisarharyana"
				);

				let transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'varun.saini@daffodilsw.com',
						pass: 'b!gb@ngSS12',
					},
				});

				let info = transporter.sendMail({
					from: '"Zeeshan Ahmad" <zeeshan.ahmad@daffodilsw.com>', // sender address
					to: "varun.saini@daffodilsw.com", // list of receivers
					subject: "Happy new year", // Subject line
					html: "<b>http://192.168.43.28:3000/reset/" + token, // html body
				}, (err, res) => {
					if (err) console.log("MAIL ERROR", err);
					else console.log(res);
				});
			}
			catch (err) {
				console.log("FORGOTPW>>>MAIL", err);
			}
			// ------------------------------------------------------------------------------------
			res.send({
				success: true,
				data: {
					email: email
				}
			});
		}
	})
});

router.post('/reset/:token', auth, (req, res) => {
	const { password, passwordAgain } = req.body || {};
	console.log("PARMAS", req.params.token)
	const { email } = req.userId || {};
	console.log(email + ' ' + password);
	console.log(req.userId);

	userSchema.updateOne({ email: email }, { $set: { password: password } }, (err, result) => {
		console.log('Password changed', result);
		res.send('Password Changed');
	})
})

module.exports = router;