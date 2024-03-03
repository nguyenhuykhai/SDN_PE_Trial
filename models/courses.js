const moogoose = require('mongoose');
const Schema = moogoose.Schema;

const courseSchema = new Schema({
    courseName: { String, require: true },
    courseDescription: { String, require: true }
}, { timestamps: true, });

var Courses = moogoose.model('Courses', courseSchema);
module.exports = Courses;