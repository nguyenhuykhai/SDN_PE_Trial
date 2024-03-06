const Sections = require('../models/sections');
const mongoose = require('mongoose');

class SectionController {
    
    async createSection(req, res, next) {
        const convertIsMainTask = req.body.isMainTask === 'true' ? true : false
        const convertObject = {
            sectionName: req.body.sectionName,
            sectionDescription: req.body.sectionDescription,
            duration: new Number(req.body.sectionDuration),
            isMainTask: convertIsMainTask,
            course: req.body.course
        }
        try {
            const section = new Sections({
                sectionName: convertObject.sectionName,
                sectionDescription: convertObject.sectionDescription,
                duration: convertObject.duration,
                isMainTask: convertObject.isMainTask,
                course: convertObject.course
            })
            await section.save()
            res.redirect(`/course/${convertObject.course}?status=successfull`)
        } catch (error) {
            res.redirect(`/course/${convertObject.course}?status=fail`)
        }
    }

    async editSection(req, res, next) {
        const convertIsMainTask = req.body.isMainTask === 'true' ? true : false
        const convertObject = {
            sectionId: new mongoose.Types.ObjectId(req.body.sectionId),
            sectionName: req.body.sectionName,
            sectionDescription: req.body.sectionDescription,
            duration: new Number(req.body.sectionDuration),
            isMainTask: convertIsMainTask,
            course: req.body.course
        } 
        try {
            await Sections.findByIdAndUpdate(convertObject.sectionId, {
                _id: convertObject.sectionId,
                sectionName: convertObject.sectionName,
                sectionDescription: convertObject.sectionDescription,
                duration: convertObject.sectionDuration,
                isMainTask: convertObject.isMainTask,
                course: convertObject.course
            })
            res.redirect(`/course/${convertObject.course}?status=successfull`)
        } catch (error) {
            res.redirect(`/course/${convertObject.course}?status=fail`)
        }
    }

    async deleteSection(req, res, next) {
        const sectionId = req.params.id;
        try {
            if (sectionId) {
                await Sections.findByIdAndDelete(sectionId);
                res.redirect('/course?status=successfull')
            } else {
                res.redirect(`/course?status=fail`)
            }
        } catch (error) {
            res.redirect('/course?status=fail')
        }
    }
}

module.exports = new SectionController