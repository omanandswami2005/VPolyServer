const mongoose = require('mongoose');

// Connect to MongoDB

const connectToMongoDB = async () => {
    mongoose
  .connect('mongodb+srv://om:omiii@atlascluster.zo09joq.mongodb.net/VPolyServer?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

}

module.exports = connectToMongoDB;