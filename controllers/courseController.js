const Course = require('../models/courses');
const Sections = require('../models/sections')
const mongoose = require('mongoose');
const Joi = require('joi') 

class CourseController {
    // Handle course and render view
    async getAll(req, res, next) {
        let data = [];
        try {
            await Course.find().then(async courses => {
                if (courses) {
                    data.push(...courses)
                    data = await this.mappingSection(data);
                    res.render('home', { data });
                } else {
                    res.render('home', { data })
                }
            })
        } catch (error) {
            res.render('home', { data })
        }
    }

    async getCourseDetail(req, res, next) {
        let data = [];
        try {
            await Course.findOne({_id: req.params.id}).then(async courses => {
                if (courses) {
                    data.push(courses);
                    data = await this.mappingSection(data);
                    res.render('detail', { data: data[0] });
                } else {
                    res.redirect('/course?status=fail');
                }
            })
        } catch (error) {
            res.redirect('/course?status=fail');
        }
    }

    async createCourse(req, res, next) {
        let { courseId, courseName, courseDescription } = req.body
        const JoiSchema = Joi.object({
            courseId: Joi.string().required(),
            courseName: Joi.string().regex(/[^A-Za-z0-9]/).required(), 
            courseDescription: Joi.string().required()
          }).options({ abortEarly: false });
        
        const { error } = JoiSchema.validate({ courseId, courseName, courseDescription });

        if (error) {
            res.redirect('/course/create?status=fail');
        } else {
            const newCourse = new Course({ courseName, courseDescription })
            try {
                await newCourse.save()
                res.redirect('/course/create?status=successfull');
            } catch (error) {
                res.redirect('/course/create?status=fail');
            }
        }
    }

    async editCourse(req, res, next) {
        let { courseId, courseName, courseDescription } = req.body
        let data = [];
        //Course Name must be A-Z, a-z, 0-9
        const JoiSchema = Joi.object({
            courseId: Joi.string().required(),
            courseName: Joi.string().regex(/[^A-Za-z0-9]/).required(), 
            courseDescription: Joi.string().required()
          }).options({ abortEarly: false });          

        const { error } = JoiSchema.validate({ courseId, courseName, courseDescription });

        if (error) {
            res.redirect(`/course/${courseId}?status=fail`);
            return;
        } else {
            const objectId = new mongoose.Types.ObjectId(courseId)
            try {
                await Course.findByIdAndUpdate(courseId, { _id: objectId, courseName, courseDescription })
                res.redirect(`/course/${courseId}?status=successfull`);
            } catch (error) {
                res.redirect(`/course/${courseId}?status=fail`);
            }
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
        try {
            await Course.find().then(async courses => {
                if (courses) {
                    data.push(...courses)
                    data = await this.mappingSection(data);
                    res.status(200).json({ data });
                } else {
                    res.status(400).json({ data })
                }
            })
        } catch (error) {
            res.status(400).json({ data })
        }
    }

    async getApiCourseDetail(req, res, next) {
        let data = [];
        try {
            await Course.findOne({_id: req.params.id}).then(async courses => {
                if (courses) {
                    data.push(courses);
                    data = await this.mappingSection(data);
                    res.status(200).json({ data });
                } else {
                    res.status(400).json({ message: 'Get course detail fail'})
                }
            })
        }
        catch (error) {
            res.status(400).json({ message: 'Get course detail fail' });
        }
    }

    async createApiCourse(req, res, next) {
        let { courseId, courseName, courseDescription } = req.body
        const JoiSchema = Joi.object({
            courseName: Joi.string().regex(/[^A-Za-z0-9]/).required(),
            courseDescription: Joi.string().required()
        }).options({ abortEarly: false });

        const { error } = JoiSchema.validate({ courseName, courseDescription });

        if (error) {
            res.status(400).json({ message: error.details.map(item => item.message) });
        } else {
            const newCourse = new Course({ courseName, courseDescription })
            try {
                await newCourse.save()
                res.status(200).json({ data: newCourse, message: 'Create course successfull' });
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
            courseName: Joi.string().regex(/[^A-Za-z0-9]/).required(), 
            courseDescription: Joi.string().required()
          }).options({ abortEarly: false });          

        const { error } = JoiSchema.validate({ courseId, courseName, courseDescription });

        if (error) {
            res.status(400).json({  message: error.details.map(item => item.message) })
        } else {
            const objectId = new mongoose.Types.ObjectId(courseId)
            try {
                const course = await Course.findByIdAndUpdate(courseId, { _id: objectId, courseName, courseDescription })
                res.status(200).json({ data: course, message: 'Edit course successfull' });
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