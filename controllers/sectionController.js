const Sections = require('../models/sections')

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
        const { sectionId, sectionName, sectionDescription, duration, isMainTask, course } = req.body
        try {
            await Sections.findByIdAndUpdate(sectionId, { _id: sectionId, sectionName, sectionDescription, duration, isMainTask, course })
            res.redirect(`/`);
        } catch (error) {
            res.render('error', { error })
        }
    }

    async deleteSection(req, res, next) {
        const sectionId = req.params.id;
        try {
            if (sectionId) {
                await Sections.findByIdAndDelete(sectionId, function (err, docs) {
                    if (err) {
                        console.log('Delete section: Error // Detail: ', err);
                        res.render('error', { error: err })
                    } else {
                        console.log("Deleted: ", docs);
                        res.redirect('/');
                    }
                })
            } else {
                console.log('SectionId not find: ', sectionId);
                res.redirect('/');
            }
        } catch (error) {
            console.log('Delete section: Error // Detail: ', error);
            res.render('error', error)
        }
    }
}

module.exports = new SectionController