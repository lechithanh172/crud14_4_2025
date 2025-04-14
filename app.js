require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Kết nối MongoDB thành công'))
.catch(err => console.error('Lỗi kết nối MongoDB:', err));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/search', async (req, res) => {
  try {
    const { searchType, searchTerm } = req.body;
    let query = {};
    
    if (searchTerm && searchTerm.trim() !== '') {
      const searchRegex = new RegExp(searchTerm, 'i'); // KHÔNG PHÂN BIỆT THƯỜNG/HOA
      
      if (searchType === 'hoTen') {
        query.hoTen = searchRegex;
      } else if (searchType === 'diaChi') {
        query.diaChi = searchRegex;
      }
    }
    
    const students = await Student.find(query);
    res.render('results', { students, searchTerm, searchType });
  } catch (err) {
    console.error('Lỗi tìm kiếm:', err);
    res.status(500).send('Đã xảy ra lỗi khi tìm kiếm sinh viên');
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const { searchType, searchTerm } = req.query;
    let query = {};
    
    if (searchTerm && searchTerm.trim() !== '') {
      const searchRegex = new RegExp(searchTerm, 'i');
      
      if (searchType === 'hoTen') {
        query.hoTen = searchRegex;
      } else if (searchType === 'diaChi') {
        query.diaChi = searchRegex;
      }
    }
    
    const students = await Student.find(query);
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    console.error('Lỗi API:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Đã xảy ra lỗi khi tìm kiếm sinh viên' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});