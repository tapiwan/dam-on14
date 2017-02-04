const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: String,
    action: String

}, { timestamps: true });




const Activity = mongoose.model('Activity', activitySchema);

Activity.find(function (err, activities) {
    if (activities.length) {
        console.log("Activities Demo bereits vorhanden");
        return;
    }
    new Activity({
        user: "Dirk Englert",
        action: "updated XYZ.png"
    }).save();

    new Activity({
        user: "Dirk Englert",
        action: "updated XYZ.png"
    }).save();

    new Activity({
        user: "Dirk Englert",
        action: "updated XYZ.png"
    }).save();

    console.log("Activities will be added when changes occur.");
});
module.exports = Activity;
