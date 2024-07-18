const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const consultationRoute = require("./routes/consultation");
const supplementRoute = require("./routes/supplement");
const storyRoute = require("./routes/story");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const contentVideoRoute = require("./routes/contentVideo");
const dietPdfRoute = require("./routes/dietPdf");
const updateRoute = require("./routes/update");
const ytContentVideoRoutes = require("./routes/ytContentVideo");
const subscriberVideoRoutes = require("./routes/subscriberVideo");
const serviceQuestionsRoutes = require("./routes/serviceQuestions");
const depressionQuestionsRoutes = require("./routes/depressionQuestions");
const IBSquestionsRoutes = require("./routes/IBSquestions");
const DiabetesQuestionRoutes = require("./routes/diabetesQuestions");

const cloudinary = require("cloudinary");

//select port
const PORT = process.env.PORT || 5001;

//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//databse connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connection successfull!");
  })
  .catch((err) => {
    console.log(err);
  });

//allow to send json
app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/consultation", consultationRoute);
app.use("/api/supplement", supplementRoute);
app.use("/api/story", storyRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/contentVideo", contentVideoRoute);
app.use("/api/dietPdf", dietPdfRoute);
app.use("/api/update", updateRoute);
app.use("/api/ytContentVideo", ytContentVideoRoutes);
app.use("/api/serviceQuestions", serviceQuestionsRoutes);
app.use("/api/subscriberVideo", subscriberVideoRoutes);
app.use("/api/depressionQuestions", depressionQuestionsRoutes);
app.use("/api/IBSquestions", IBSquestionsRoutes);
app.use("/api/diabetesQuestion", DiabetesQuestionRoutes);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
