const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  dimensions: Object


}, { timestamps: true });




const Settings = mongoose.model('Settings', settingsSchema);

Settings.find(function (err, settings) {
    if (settings.length) {
        console.log("Settings bereits vorhanden");
        return;
    }
    new Settings({
        dimensions: {
            0: {
                name: "Web Content",
                width: "500px",
                height: "auto"

            },
            1: {
                name: "Web Header",
                width: "1500px",
                height: "auto"

            },
            2: {
                name: "Print",
                width: "1500px",
                height: "auto"

            }
        }

    }).save();

    console.log("Settings hinzugefügt");
});
module.exports = Settings;
