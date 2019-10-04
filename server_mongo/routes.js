const passport = require('passport')
const passportService = require('./service/passport')

//เรียกใช้ passport.authenticate แบบ local และกำหนด session เป็น false
const requireSignin = passport.authenticate('local', { session: false })

const user = require('./controllers/user.controller')

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send({ message: 'itService MongoDB' })
    })

    //route สำหรับตรวจสอบการ Login
    //เรียกใช้ตัวแปร requireSignin เป็น middleware ตัวหนึ่งก่อนทำงาน users.signin
    app.post('/signin', requireSignin, user.signin)

    app.get('/users',user.findAll)
    app.post('/users',user.create)
    app.get('/users/:id',user.findById)
    app.put('/users/:id',user.update)
    app.delete('/users/:id',user.delete)
}