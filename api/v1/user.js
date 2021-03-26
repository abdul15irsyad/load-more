const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const { create, edit, editPassword } = require('../../validators/userValidator')

const User = require('../../models/User')

/*
* @api {get} /api/v1/user
* @apiName getUsers
* @apiPermission public
* @apiDescription get all users
*
* @apiParam {number} page : page number in pagination
* @apiParam {number} limit : limit data per page
* @apiParam {enum['asc','desc']} sort : sort type of data
*/
router.get('/', (req, res) => {
    try {
        let { page, limit, sort, sortKey } = req.query
        let field = ['name', 'username', 'email', 'updatedAt', 'createdAt']
        sort = sort == 'asc' ? 1 : -1
        sortKey = sortKey !== null && field.includes(sortKey) ? sortKey : 'createdAt'
        User.paginate({}, {
            pagination: page == "all" ? false : true,
            // hide the password
            select: "-password",
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
            sort: { [sortKey]: parseInt(sort) }
        }).then(response => {
            res.status(200).json({
                status: true,
                data: response
            })
        })
    } catch (err) {
        res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {get} /api/v1/user/:id
* @apiName getUser
* @apiPermission public
* @apiDescription get one user
*
* @apiParam {number} id : user unique id
*/
router.get('/:id', (req, res) => {
    try {
        let id = req.params.id
        User.findById(id, '-password', (err, doc) => {
            if (doc) {
                res.status(200).json({
                    status: true,
                    data: doc
                })
            } else {
                res.status(200).json({
                    status: false,
                    message: "user not found!",
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {post} /api/v1/user
* @apiName addUser
* @apiPermission public
* @apiDescription add user
*
* @apiParam {string} name : user's name
* @apiParam {string} username : user's username
* @apiParam {string} password : user's password
* @apiParam {string} confirmPassword : confirm password
*/
router.post('/', create, async (req, res) => {
    try {
        // if validation failed
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                message: 'inputs not valid',
                errors: errors.array({ onlyFirstError: true })
            })
        }
        // if validation has been successful
        User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
        }, (err, doc) => {
            // hide password
            doc = { ...doc._doc, password: undefined }
            if (doc) {
                res.status(200).json({
                    status: true,
                    data: doc
                })
            } else {
                res.status(200).json({
                    status: false,
                    message: err.message
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {patch} /api/v1/user/:id
* @apiName editUser
* @apiPermission public
* @apiDescription edit user
*
* @apiParam {number} id : user unique id
* @apiParam {string} name : user's name
* @apiParam {string} username : user's username
*/
router.patch('/:id', edit, async (req, res) => {
    try {
        // if validation failed
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                message: 'inputs not valid',
                errors: errors.array({ onlyFirstError: true })
            })
        }
        // if validation has been successful
        let id = req.params.id
        User.findByIdAndUpdate(id, {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
        }, async (err, doc) => {
            if (doc) {
                res.status(200).json({
                    status: true,
                    data: await User.findById(id, '-password')
                })
            } else {
                res.status(200).json({
                    status: false,
                    message: "user not found!"
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {patch} /api/v1/user/:id/password
* @apiName editUserPassword
* @apiPermission public
* @apiDescription edit user
*
* @apiParam {number} id : user unique id
* @apiParam {string} oldPassword : user's old password
* @apiParam {string} password : user's password
* @apiParam {string} confirmPassword : confirm password
*/
router.patch('/:id/password', editPassword, async (req, res) => {
    try {
        let id = req.params.id
        User.findByIdAndUpdate(id, {
            password: req.body.password
        }, async (err, doc) => {
            if (doc) {
                res.status(200).json({
                    status: true,
                    data: await User.findById(id, '-password')
                })
            } else {
                res.status(200).json({
                    status: false,
                    message: "user not found!"
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

/*
* @api {delete} /api/v1/user
* @apiName deleteUser
* @apiPermission public
* @apiDescription delete user
*
* @apiParam {number} id : user unique id
*/
router.delete('/:id', (req, res) => {
    try {
        let id = req.params.id
        User.findById(id, async (err, doc) => {
            if (doc) {
                res.status(200).json({
                    status: true,
                    message: "success delete user!",
                    data: await User.findByIdAndRemove(id).select('-password')
                })
            } else {
                res.status(200).json({
                    status: false,
                    message: "user not found!",
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'interal server error!',
            error: err.message
        })
    }
})

module.exports = router