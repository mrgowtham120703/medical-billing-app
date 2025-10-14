const mongoose = require(mongoose);
const InsurerSchema = new mongoose.Schema({
    name: String,
    rules: [Object]       // very simple; in real app you'd normalize
}, {timestamps: true});

module.exports = mongoose.model('Insurer', InsurerSchema);