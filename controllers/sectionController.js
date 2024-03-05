const Sections = require('../models/sections');
const mongoose = require('mongoose');

class SectionController {
    // async getAll(req, res, next) {
    //     let data = [];
    //     let error = undefined;
    //     try {
    //         await Sections.find().then(async sections => {
    //             if (sections) {
    //                 data.push(...sections)
    //                 res.render('home', { data, error });
    //             } else {
    //                 res.render('home', { data, error: 'Lấy danh sách không thành công' })
    //             }
    //         })
    //     } catch (error) {
    //         res.render('home', { data, error: 'Lấy danh sách không thành công' })
    //     }
    // }

    // async getSectionDetail(req, res, next) {
    //     let data = [];
    //     let error = undefined;
    //     try {
    //         await Sections.findOne({_id: req.params.id}).then(async sections => {
    //             if (sections) {
    //                 data.push(sections);
    //                 res.render('detail', { data, error });
    //             } else {
    //                 res.render('detail', { data, error: 'Lấy danh sách không thành công' })
    //             }
    //         })
    //     } catch (error) {
    //         res.render('detail', { data, error: 'Lấy danh sách không thành công' })
    //     }
    // }

    async editSection(req, res, next) {
        const convertObject = {
            sectionId: new mongoose.Types.ObjectId(req.body.sectionId),
            sectionName: req.body.sectionName,
            sectionDescription: req.body.sectionDescription,
            duration: new Number(req.body.sectionDuration),
            isMainTask: new Boolean(req.body.isMainTask),
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
        const objectId = new mongoose.Types.ObjectId(sectionId)
        try {
            if (sectionId) {
                await Sections.findByIdAndDelete(objectId, function (err, docs) {
                    if (err) {
                        console.log('Delete section: Error // Detail: ', err);
                        res.render('error', { error: err })
                    } else {
                        console.log("Deleted: ", docs);
                        res.redirect('/course', { message: 'Xóa section thành công' })
                    }
                })
            } else {
                console.log('SectionId not find: ', sectionId);
                res.redirect('/course', { error: 'Xóa section thất bại' })
            }
        } catch (error) {
            console.log('Delete section: Error // Detail: ', error);
            res.redirect('/course', { error: 'Xóa section thất bại' })
        }
    }
}

module.exports = new SectionController