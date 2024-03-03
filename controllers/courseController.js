const Course = require('../models/courses');

class CourseController {
    async getAll(req, res, next) {
        let data = [];
        let error = undefined;
        try {
            Course.find().then(courses => {
                if (courses) {
                    data.push(...courses)
                    res.render('home', { data, error });
                } else {
                    res.render('home', { data, error: 'Lấy danh sách không thành công' })
                }
            })
        } catch (error) {
            res.render('home', { data, error: 'Lấy danh sách không thành công' })
        }
    }

    async getCourseDetail(req, res, next) {
        let data = {};
        let error = undefined;
        try {
            Course.findOne({_id: req.body.courseId}).then(courses => {
                if (courses) {
                    data  = courses;
                    console.log("DATA: ", data.title !== undefined);
                    res.render('detail', { data, user: req.user, error });
                } else {
                    res.render('detail', { data, user: req.user, error: 'Lấy danh sách không thành công' })
                }
            })
        } catch (error) {
            res.render('detail', { data, user: req.user, error: 'Lấy danh sách không thành công' })
        }
    }
}

module.exports = new CourseController