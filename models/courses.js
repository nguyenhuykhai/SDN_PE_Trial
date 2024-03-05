const moogoose = require('mongoose');
const Schema = moogoose.Schema;

const courseSchema = new Schema({
    courseName: { type: String, require: true },
    courseDescription: { type: String, require: true }
}, { timestamps: true });

var Course = moogoose.model('Courses', courseSchema);
module.exports = Course;