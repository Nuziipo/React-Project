const User = require('../models/user.model')  //เรียกใช้ model ของ user ที่เราได้สร้างไว้
const passport = require('passport');   //เรียกใช้ module passport
const LocalStrategy = require('passport-local') //เรียกใช้ module passport-local

//LocalStrategy จะใช้สำหรับการตรวจสอบการ Login
//รูปแบบการใช้ LocalStrategy จะรับ parameter 3 ตัว
//หาก parameter ที่ส่งไม่ใช่ชื่อ username, password จะต้องกำหนด option
//ดูเพิ่มเติมได้ที่ https://github.com/jaredhanson/passport-local
const localLogin = new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, result) => {
        if (err) return next(err)   //กรณีมี error ก็ส่งให้ miidleware ตัวต่อไป
        if (!result) return done(null, false)   //ไม่พบ username ให้คืนค่า false

        //ตรวจสอบว่ารหัสผ่านตรงกับในฐานข้อมูลหรือไม่
        if (result.password !== password) {
            return done(null, false)    //ถ้ารหัสผ่านไม่ตรงกันให้  return false
        } else {
            return done(null, result)   //ถ้ารหัสผ่านตรงให้ return ข้อมูลของ user
        }
    })
})

passport.use(localLogin) ////passport เรียกใช้ localLogin
 