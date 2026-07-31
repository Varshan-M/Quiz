const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

const getDataFile = (subjectId) => path.join(DATA_DIR, `${subjectId}.json`);

app.get('/api/questions/:subjectId', (req, res) => {
  const file = getDataFile(req.params.subjectId);
  if (fs.existsSync(file)) {
    try {
      res.json(JSON.parse(fs.readFileSync(file, 'utf8')));
    } catch (e) {
      res.json([]);
    }
  } else {
    res.json([]);
  }
});

app.post('/api/questions/:subjectId', upload.any(), (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const questionsData = JSON.parse(req.body.data || '[]');
    
    // Map uploaded files to their questions
    req.files.forEach(file => {
      // Fieldname will be like image_0, image_1
      const match = file.fieldname.match(/image_(\d+)/);
      if (match) {
        const index = parseInt(match[1]);
        if (questionsData[index]) {
          questionsData[index].image = `/uploads/${file.filename}`;
        }
      }
    });

    fs.writeFileSync(getDataFile(subjectId), JSON.stringify(questionsData, null, 2));
    res.json({ success: true, data: questionsData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
