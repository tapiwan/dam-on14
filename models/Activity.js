const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: String,
    action: String

}, { timestamps: true });




const Activity = mongoose.model('Activity', activitySchema);

Activity.find(function (err, activities) {
    console.log("Activities will be added when changes occur.");
});
module.exports = Activity;
