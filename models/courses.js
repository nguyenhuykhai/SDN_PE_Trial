const moogoose = require('mongoose');
const Schema = moogoose.Schema;

const courseSchema = new Schema({
    title: { type: String, require: true },
    titleDescription: { type: String, require: true },
    status: { type: String, require: true },
    type: { type: String, require: true },
    amount: { type: Number, require: true },
    thumbnail: { type: String, require: true }
}, { timestamps: true });

var Course = moogoose.model('Courses', courseSchema);
module.exports = Course;