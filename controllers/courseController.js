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
        let data = [];
        let error = undefined;
        try {
            await Course.findOne({_id: req.params.id}).then(courses => {
                if (courses) {
                    data.push(courses);
                    res.render('detail', { data, error });
                } else {
                    res.render('detail', { data, error: 'Lấy danh sách không thành công' })
                }
            })
        } catch (error) {
            res.render('detail', { data, error: 'Lấy danh sách không thành công' })
        }
    }

    async editCourse(req, res, next) {
        let { title, titleDescription, status, type, amount, thumbnail } = req.body
        try {
            await Course.findByIdAndUpdate(req.body.courseId, { _id:req.body.courseId, title, titleDescription, status, type, amount, thumbnail })
            res.redirect(`/course/${req.body.courseId}`);
        } catch (error) {
            res.render('detail', { error: 'Chỉnh sửa khóa học thất bại' })
        }
    }
}

module.exports = new CourseController