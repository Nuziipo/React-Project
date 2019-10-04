const User = require('../models/user.model')  //เรียกใช้ model ของ user ที่เรำได้สร้ำงไว้ 
const jwt = require('jwt-simple')   //เรียกใช้ jwt-simple เพื่อจะทำการสร้า Json Web Token
const config = require('../config') //ไฟล์ config นี้เราจะเอาตัว secret มาใช้

//ฟังก์ชันสำหรับสร้าง Json Web Token
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    //คืนค่าของ user โดยเข้ารหัสในรูปแบบของ Json Web Token
    return jwt.encode(
        {
            sub: user._id,   //เรียกใช้ _id ได้ด้วย id ก็ได้ครับ
            user_type: user.user_type,
            name: user.name,
            username: user.username,
            iat: timestamp
        },
        config.secret   //ทุกครั้งที่เข้ารหัส JWT ต้องกำนดคีย์ลับไปด้วย
    )
}

//ฟังก์ชันสำหรับ signin โดยจะทำงานเมื่อ service/passport.js ทำการตรวจสอบแล้ว
//ฟังก์ชันนี้จะคืนเป็นค่า Json Web Token
exports.signin = (req, res, next) => {
    res.send({ token: tokenForUser(req.user) })
}

//ฟังก์ชันแสดงข้อมูล user โดย query ตำมตัวแปร term ที่ส่งมำ
exports.findAll = (req, res, next) => {
    var query = req.query.term
    //รูปแบบกำรกรองข้อมูล ถ้ำเปรียบกับ mysql ก็จะเป็น 
    //where(name like '%xxxx%' or username like '%xxx%') 
    User.find({ 
        $or: [{ name: new RegExp(query) }, 
        { username: new RegExp(query) }] 
    }, (err, results) => {
        if (err) { return next(err) }   //ดักจับ error ถ้ำมีก็ส่งให้ middleware ตัวถัดไป 

        res.json(results)   //ส่ง response กลับไปเป็น javascript object ของ user    
    }) 
}

//ฟังก์ชันแสดงข้อมูล user ตาม id ที่ส่งมา
exports.findById = (req, res, next) => {
    //ใช้ findById ค้นหาข้อมูลฟิลด์ _id ตาม id ที่ส่งมาได้เลยครับ
    //ฟิลด์ _id ตัว mongodb สร้างให้อัตโนมัติตอนบันทึกเรานำมาใช้ได้เลยครับ
    //โดยค่าของ id เราจะมั่วๆ ใส่ 1, 2, 3 แบนี้ไม่ได้นะครับเพราะมันเป็น id ที่ hash มาแบบมีรูปแบบ
    //ถ้าไม่พบข้อมูลระบบจะ return ค่า null ออกมาครับ
    User.findById(req.params.id, function (err, results) {
        if (err) { return next(err) }   //ดักจับ error

        res.json(results)   //ส่ง response กลับไปเป็น javascript object ของ user
    })
}

//ฟังก์ชันสร้างข้อมูลผู้ใช้ใหม่
exports.create = (req, res, next) => {
    //ก่อนอื่นค้นหาก่อนว่่า username ที่ส่งมามีข้อมูลอยู่หรือไม่
    User.findOne({ username: req.body.username }, (err, result) => {
        if (err) { return next(err); }

        if (result) {
            //ถ้ามี username นี้อยู่แล้วในระบบก็ให้แจ้งกลับไปจะไม่บันทึก
            res.json({ status: 201, message: 'Username is Duplicate' })
        } else {
            //สร้าง Object user จาก model user แล้วรับค่าที่ request เข้ามา 
            //โดยจะบันทึกตามชื่อของค่าที่ request ที่ต้องตรงกับ Schema ของ User
            const user = new User(req.body)
            user.save(err => {
                //ถ้ามี error ก็โยน error ไปให้ middleware ถัดไป
                if (err) { return next(err) }

                //บันทึกสำเร็จก็ส่ง javascript object ของ user กลับไป
                res.json(user)
            })
        }
    })
}

//ฟังก์ชันปรับปรุงข้อมูลผู้ใช้
exports.update = (req, res, next) => {
    var id = req.params.id  //id ที่ส่งมาเพื่อเอามาค้นหาในการอัพเดท

    //ในการจะปรับปรุงข้อมูลเราต้องเช็คก่อนว่า username ที่สงมาเป็น id เดียวกับที่ส่งมาหรือไม่
    //ถ้า id ที่ findOne หาจาก username ไม่ตรงกับ id ที่ส่งมาแสดงว่า username ไปซ้ำกับรายการอื่น
    User.findOne({ username: req.body.username }, (err, results) => {
        if (err) { return next(err) }   //ดักจับ error

        var isUpdate = false;
        if (results) {
            //ค่า req.params.id ส่งมาเป็น string ดังนั้นการเปรียบเทียบค่าของ results._id
            //จึงต้องแปลงเป็น string ก่อน
            if (results._id.toString() !== id) {
                res.send({ status: 201, message: 'Username is Duplicate' })
            } else {
                isUpdate = true
            }
        } else {
            isUpdate = true
        }

        if (isUpdate) {
            //option {new: true} จะคือค่า user ที่ได้อัพเดทแล้ว ถ้าไม่กำหนดจะคืนค่า user ก่อนอัพเดท
            User.findOneAndUpdate({ _id: id }, req.body, { new: true }, (err, user) => {
                if (err) {
                    return next(err)
                } else {
                    //บันทึกสำเร็จก็ส่ง javascript object ของ user กลับไป
                    res.json(user)
                }
            })
        }
    })
}

exports.delete = (req, res, next) => {
    User.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) {
            return next(err)
        } else {
            //ลบสำเร็จก็ส่ง javascript object ของ user ที่ถูกลบกลับไป
            res.json(result)
        }
    })
}