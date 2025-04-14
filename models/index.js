const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  maSinhVien: {
    type: String,
    required: true,
    unique: true
  },
  hoTen: {
    type: String,
    required: true
  },
  ngaySinh: {
    type: Date,
    required: true
  },
  diaChi: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  soDienThoai: {
    type: String,
    required: true
  },
  gioiTinh: {
    type: String,
    required: true
  }
});
studentSchema.index({ hoTen: 'text', diaChi: 'text', email: 'text', maSinhVien: 1 });
module.exports = mongoose.model('Student', studentSchema);