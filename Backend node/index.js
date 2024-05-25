const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Twilio = require("twilio");
require("dotenv").config();

// Import routes
const story = require("./routes/StoryRoute");
const uploadRouter = require("./routes/upload");
const downloadRouter = require("./routes/download");

const app = express();

const PORT = process.env.PORT || 5001;

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioApiKeySid = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

const client = new Twilio(twilioAccountSid, twilioAuthToken);

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.post('/token', (req, res) => {
    const { identity } = req.body;

    const AccessToken = Twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKeySid,
        twilioApiKeySecret,
        { identity }
    );

    token.addGrant(new VideoGrant());

    res.send({
        token: token.toJwt()
    });
});

app.use("/api", uploadRouter);
app.use("/api", downloadRouter);
app.use("/api/story", story);

app.listen(PORT, () => console.log(`Listening at ${PORT}...`));
