const express = require("express");
const mongoose = require("mongoose");
const courses = require("./routes/course");
const subjects = require("./routes/subject");
const user = require("./routes/user");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const { MONGO_URI } = require("./config/config");
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("connected to mongoDB"))
	.catch((err) => console.error("Mongodb not connected"));

app.use(express.json());

app.use("/api/subjects", subjects);
app.use("/api/courses", courses);
app.use("/api/user", user);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App listening on the port: ${port}`);
});
