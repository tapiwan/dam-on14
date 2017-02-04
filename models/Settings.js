const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    dimensions: [
        {
            name: String,
            width: String,
            height: String

        }
    ]


}, { timestamps: true });




const Settings = mongoose.model('Settings', settingsSchema);

Settings.find(function (err, settings) {
    if (settings.length) {
        console.log("Settings bereits vorhanden");
        return;
    }

    new Settings({
        dimensions: [
            {
                name: "Web content",
                width: "500",
                height: "auto"
            },
            {
                name: "Web header",
                width: "1500",
                height: "auto"
            }]

    }).save();



    console.log("Settings hinzugefügt");
});
module.exports = Settings;
