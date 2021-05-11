const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const users = require('./routes/users');
const posts = require('./routes/posts');

//Setup the environment
dotenv.config();

//Connect to the MongoDB
mongoose
    .connect(process.env.MONGODB_URL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connected to the MongoDB!'))
    .catch(err => console.log(err));

const app = express();

//Add middleware to the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//Add passport
app.use(passport.initialize());
require('./config/passport')(passport);

//Add API calls
app.use('/api/users', users);
app.use('/api/posts', posts);

//Run the app on the specified PORT or 5000 if PORT not defined
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
