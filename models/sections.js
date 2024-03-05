const moogoose = require('mongoose');
const Schema = moogoose.Schema;

const sectionSchema = new Schema({
    sectionName: { type: String, require: true },
    sectionDescription: { type: String, require: true },
    duration: { type: Number, require: true },
    isMainTask: { type: Boolean, default: false },
    course: { type: moogoose.Schema.Types.ObjectId, ref: "courses", require: true },
},
    { timestamps: true, });

var Sections = moogoose.model('Sections', sectionSchema);
module.exports = Sections;