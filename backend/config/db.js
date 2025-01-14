// server/db.js
const mongoose = require('mongoose');

const database = () =>{
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))
}


module.exports = database;
