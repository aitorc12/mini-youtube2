const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);  // Nombre único para el archivo
    }
});
const upload = multer({ storage: storage });

// Middleware para servir archivos estáticos
app.use('/uploads', express.static('uploads'));  // Esto asegura que los archivos .mp4 sean accesibles

// Middleware para servir archivos estáticos en la carpeta 'public'
app.use(express.static('public'));

// Configuración para parsear los datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta para obtener los videos (simulación de una base de datos)
app.get('/videos', (req, res) => {
    if (fs.existsSync('./videos.json')) {
        const videos = JSON.parse(fs.readFileSync('./videos.json'));
        res.json(videos);
    } else {
        res.json([]);
    }
});

// Ruta para manejar la subida de videos
app.post('/upload', upload.single('video'), (req, res) => {
    const { title, description } = req.body;
    const videoFile = req.file;

    if (!title || !description || !videoFile) {
        return res.status(400).send('Faltan datos en el formulario.');
    }

    const newVideo = {
        title: title,
        description: description,
        filename: videoFile.filename,
        path: `/uploads/${videoFile.filename}`
    };

    // Leer los videos existentes
    let videos = [];
    if (fs.existsSync('./videos.json')) {
        videos = JSON.parse(fs.readFileSync('./videos.json'));
    }

    // Agregar el nuevo video
    videos.push(newVideo);

    // Guardar el archivo JSON con la información de los videos
    fs.writeFileSync('./videos.json', JSON.stringify(videos, null, 2));

    res.redirect('/'); // Redirigir a la página principal después de subir
});

// Inicializa el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
