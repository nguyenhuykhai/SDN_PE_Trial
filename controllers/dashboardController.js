const Course = require('../models/courses');
const mongoose = require('mongoose');
const Joi = require('joi') 

class DashboardController {
    // Handle render dashboard view
    async getAll(req, res, next) {
        try {
            await Course.find().then(async items => {
                if (items) {
                    res.render('dashboard', { data: items });
                } else {
                    res.redirect('/course?status=fail');
                }
            })
        } catch (error) {
            res.redirect('/course?status=fail');
        }
    }

    async getDetail(req, res, next) {
        try {
            await Course.findOne({_id: req.params.id}).then(async item => {
                if (item) {
                    res.render('dashboardDetail', { data: item });
                } else {
                    res.redirect('/course?status=fail');
                }
            })
        } catch (error) {
            res.redirect('/course?status=fail');
        }
    }

    async createItem(req, res, next) {
        let { name, description } = req.body
        const JoiSchema = Joi.object({
            name: Joi.string().regex(/[^A-Za-z0-9]/).required(), 
            description: Joi.string().required()
          }).options({ abortEarly: false });
        
        const { error } = JoiSchema.validate({ name, description });

        if (error) {
            res.redirect('/course/create?status=fail');
        } else {
            const newItem = new Course({ courseName: name, courseDescription: description })
            try {
                await newItem.save()
                res.redirect('/course?status=successfull');
            } catch (error) {
                res.redirect('/course?status=fail');
            }
        }
    }

    async editItem(req, res, next) {
        let { id, name, description } = req.body
        //Item Name must be A-Z, a-z, 0-9
        const JoiSchema = Joi.object({
            id: Joi.string().required(),
            name: Joi.string().regex(/[^A-Za-z0-9]/).required(), 
            description: Joi.string().required()
          }).options({ abortEarly: false });          

        const { error } = JoiSchema.validate({ id, name, description });

        if (error) {
            res.redirect(`/course?status=fail`);
            return;
        }

        const objectId = new mongoose.Types.ObjectId(id)
        try {
            await Course.findByIdAndUpdate(id, { _id: objectId, courseName: name, courseDescription: description })
            res.redirect(`/course?status=successfull`);
        } catch (error) {
            res.redirect(`/course?status=fail`);
        }
    }

    async deleteItem(req, res, next) {
        const id = req.params.id;
        const objectId = new mongoose.Types.ObjectId(id)
        try {
            await Course.findByIdAndDelete(id)
            await Sections.deleteMany({ course: objectId })
            res.redirect(`/course?status=successfull`);
        } catch (error) {
            res.redirect(`/course?status=fail`);
        }
    }
}

module.exports = new DashboardController