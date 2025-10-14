const mongoose = require('mongoose');

module.exports = async function connectDB() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/medbilling';
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (error) {
        console.log('MongoDB connection error', error)
        process.exit(1);
    }
}
