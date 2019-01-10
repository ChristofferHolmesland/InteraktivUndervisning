const path = require("path");
const fs = require("fs");
const locales = {"localeList": []};
const langPath = path.join(__dirname, "/locales");

// Get files in langPath
const files = fs.readdirSync(langPath)

// Check if there are 0 files
if(files.length == 0){
    // TODO add info to logger
    return;
}

// Goes through every file
files.forEach(function(file) {
    const data = fs.readFileSync(langPath + "/" + file);
    const lang = file.split(".")[0];

    const fileData = JSON.parse(data);
    locales[lang] = fileData;
    locales.localeList.push(lang);
});

// Exports locales
module.exports.locales = locales;