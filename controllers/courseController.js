const Course = require('../models/courses');
const Sections = require('../models/sections')
const mongoose = require('mongoose');
const Joi = require('joi') 

class CourseController {
    // Handle course and render view
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

    async createCourse(req, res, next) {
        let { courseId, courseName, courseDescription } = req.body
        const JoiSchema = Joi.object({
            courseId: Joi.string().required(),
            courseName: Joi.string().regex(/^A-Za-z0-9_./).required(), 
            courseDescription: Joi.string().required()
          }).options({ abortEarly: false });
        
        const { error } = JoiSchema.validate({ courseId, courseName, courseDescription });

        if (error) {
            res.redirect('/course/create?status=fail');
        }

        const newCourse = new Course({ courseName, courseDescription })
        try {
            await newCourse.save()
            res.redirect('/course/create?status=successfull');
        } catch (error) {
            res.redirect('/course/create?status=fail');
        }
    }

    async editCourse(req, res, next) {
        let { courseId, courseName, courseDescription } = req.body

        //Course Name must be A-Z, a-z, 0-9
        const JoiSchema = Joi.object({
            courseId: Joi.string().required(),
            courseName: Joi.string().regex(/^A-Za-z0-9_./).required(), 
            courseDescription: Joi.string().required()
          }).options({ abortEarly: false });          

        const { error } = JoiSchema.validate({ courseId, courseName, courseDescription });

        if (error) {
            res.render('detail', { error: error.details.map(item => item.message) })
            return;
        }

        const objectId = new mongoose.Types.ObjectId(courseId)
        try {
            await Course.findByIdAndUpdate(courseId, { _id: objectId, courseName, courseDescription })
            res.redirect(`/course/${courseId}?status=successfull`);
        } catch (error) {
            res.render('detail', { error: 'Chỉnh sửa khóa học thất bại' })
        }
    }

    async deleteCourse(req, res, next) {
        const courseId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(courseId)
        try {
            await Course.findByIdAndDelete(courseId)
            await Sections.deleteMany({ course: objectId })
            res.redirect(`/course?status=successfull`);
        } catch (error) {
            res.redirect(`/course?status=fail`);
        }
    }

    // Handle request from POSTMAN
    async getApiAll(req, res, next) {
        let data = [];
        let error = undefined;
        try {
            await Course.find().then(async courses => {
                if (courses) {
                    data.push(...courses)
                    data = await this.mappingSection(data);
                    res.status(200).json({ data, error });
                } else {
                    res.status(400).json({ data, error: 'Lấy danh sách không thành công' })
                }
            })
        } catch (error) {
            res.status(400).json({ data, error: 'Lấy danh sách không thành công' })
        }
    }

    async getApiCourseDetail(req, res, next) {
        let data = [];
        let error = undefined;
        try {
            await Course.findOne({_id: req.params.id}).then(async courses => {
                if (courses) {
                    data.push(courses);
                    data = await this.mappingSection(data);
                    res.status(200).json({ data, error });
                } else {
                    res.status(400).json({ data, error: 'Lấy danh sách không thành công' })
                }
            })
        }
        catch (error) {
            res.status(400).json({ data, error: 'Lấy danh sách không thành công' })
        }
    }

    async createApiCourse(req, res, next) {
        let { courseId, courseName, courseDescription } = req.body
        const JoiSchema = Joi.object({
            courseName: Joi.string().regex(/^[A-Z][a-z0-9\s\/]*$/).required(),
            courseDescription: Joi.string().required()
        }).options({ abortEarly: false });

        const { error } = JoiSchema.validate({ courseName, courseDescription });

        if (error) {
            res.status(400).json({ message: error.details.map(item => item.message) });
        } else {
            const newCourse = new Course({ courseName, courseDescription })
            try {
                await newCourse.save()
                res.status(200).json({ message: 'Create course successfull' });
            } catch (error) {
                res.status(400).json({ message: 'Create course fail' });
            }
        }
    }

    async editApiCourse(req, res, next) {
        let { courseName, courseDescription } = req.body
        const courseId = req.params.id;
        //Course Name must be A-Z, a-z, 0-9
        const JoiSchema = Joi.object({
            courseId: Joi.string().required(),
            courseName: Joi.string().regex(/^[A-Z][a-z0-9\s\/]*$/).required(), 
            courseDescription: Joi.string().required()
          }).options({ abortEarly: false });          

        const { error } = JoiSchema.validate({ courseId, courseName, courseDescription });

        if (error) {
            res.status(400).json({  message: error.details.map(item => item.message) })
        } else {
            const objectId = new mongoose.Types.ObjectId(courseId)
            try {
                await Course.findByIdAndUpdate(courseId, { _id: objectId, courseName, courseDescription })
                res.status(200).json({ message: 'Edit course successfull' });
            } catch (error) {
                res.status(400).json({ message: 'Edit course fail' })
            }
        }
    }

    async deleteApiCourse(req, res, next) {
        const courseId = req.params.id;
        const objectId = new mongoose.Types.ObjectId(courseId)
        try {
            await Course.findByIdAndDelete(courseId)
            await Sections.deleteMany({ course: objectId })
            res.status(200).json({ message: 'Delete course successfull' });
        } catch (error) {
            res.status(400).json({ message: 'Delete course fail' });
        }
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