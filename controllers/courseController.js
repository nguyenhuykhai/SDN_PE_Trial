const Course = require('../models/courses');
const Sections = require('../models/sections')

class CourseController {
    async getAll(req, res, next) {
        let data = [];
        let error = undefined;
        try {
            await Course.find().then(async courses => {
                if (courses) {
                    data.push(...courses)
                    data = await this.mappingSection(data);
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
            await Course.findOne({_id: req.params.id}).then(async courses => {
                if (courses) {
                    data.push(courses);
                    data = await this.mappingSection(data);
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
        let { courseId, courseName, courseDescription } = req.body
        try {
            await Course.findByIdAndUpdate(courseId, { _id: courseId, courseName, courseDescription })
            res.redirect(`/course/${courseId}`);
        } catch (error) {
            res.render('detail', { error: 'Chỉnh sửa khóa học thất bại' })
        }
    }

    async deleteCourse(req, res, next) {
        
    }

    async mappingSection(data) {
        let newData = []
        try {
            if (data !== undefined && data.length > 0) {
                await Promise.all(data.map(async (item) => {
                    newData.push({_id: item._id, courseName: item.courseName, courseDescription: item.courseDescription, sections: await Sections.find({ course: item._id })})
                }));
                return newData;
            } else {
                console.log('Mapping Sections: data === undefined or length = 0 // Data: ', data);
                return data;
            }   
        } catch(error) {
            console.log('Mapping Sections: Error // Detail: ', error);
            return data;
        }
    }
    
}

module.exports = new CourseController