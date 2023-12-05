const express = require('express');
const { adminLoginHandler, adminLoginView } = require('../controller/controlpanel');

const controlpanel_api = express.Router()

.get('/login', adminLoginView)
.post('/login', adminLoginHandler)

.get('/testport', (req, res) => {
    return res
    .json({message: process.env.PORT})
})

.get('/data/projects', (req, res) => {
    return res
    .render('control/data/projects/projects')
})

.get('/data/projects/edit', async (req, res) => {
    const data = {
        id: 'test'
    }
    return res
    .render('control/data/projects/projects_edit', { data });
})

.get('/test', (req, res) => {
    return res
    .render('control/tester/test');
})  



.get('/data/user', (req, res) => {
    return res
    .render('control/data/user/user');
})


// UI

.get('/ui', (req, res) => {
    return res
    .render('control/ui/menu');
})

.get('/ui/freelancer', (req, res) => {
    return res
    .redirect('/control/ui')
})

.get('/ui/user', (req, res) => {
    return res
    .redirect('/control/ui')
})

.get('/ui/freelancer/home', (req, res) => {
    return res
    .render('control/ui/freelancer/home');
})

.get('/ui/freelancer/projects', (req, res) => {
    return res
    .render('control/ui/freelancer/projects');
})

.get('/ui/freelancer/profile', (req, res) => {
    return res
    .render('control/ui/freelancer/profile');
})

.get('/ui/user/projects', (req, res) => {
    return res
    .render('control/ui/user/projects')
})

.get('/*', (req, res) => {
    res.json({message: "test"})
})



module.exports = controlpanel_api;