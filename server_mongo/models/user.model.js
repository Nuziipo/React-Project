const mongoose = require('mongoose');   //เรียกใช้ mongose 
const Schema = mongoose.Schema;//สร้ำงตัวแปรชื่อ Schema เพื่อเรียกใช้ฟังก์ชันในกำรสร้ำง Schema ของ mongoose

/* สร้ำงโครงสร้ำงของ user โดยกำหนด ชื่อฟิลด์: ประเภท field ดูเพิ่มเติมได้ที่ http://mongoosejs.com/docs/schematypes.html */
const userSchema = new Schema({    
    user_type: Number, //ประเภทผู้ใช้0=ทั่วไป, 1=ผู้ดูแลระบบ
    name: String, //ชื่อ-สกุล

    // สำมำรถกำหนดประเภทในรูปแบบของ Object เพิ่มเติมได้ จำกตัวอย่ำง username กำหนด unique    
    // หมำยถึงห้ำมซ้ำกัน และ index คือให้ทำ index ไว้เวลำค้นหำจะได้รวดเร็ว
    username: { type: String, unique: true, index: true },  //ชื่อเข้ำใช้ระบบ
    password: String    //รหัสผ่ำน 
})

//สร้ำงตัวแปร ModelClass เพื่อสร้ำง model ชื่อ user โดยใช้โครงสร้ำงของ userSchema 
//โดย mogoose จะสร้ำง collection ชื่อ users ให้อัตโนมัติเมื่อมีกำรบันทึกข้อมูล 
const ModelClass = mongoose.model('user', userSchema)

module.exports = ModelClass //สุดท้ำยก็ส่งออก ModelClass ให้ไฟล์อื่นเรียกใช้ได้