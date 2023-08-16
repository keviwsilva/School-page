const express = require("express");
const multer = require('multer');
const mysqlConnection = require("../database");
const path = require('path');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, uniquePrefix + path.extname(file.originalname));
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage});




router.get("/findall", function(request, response) {

    let posts = "SELECT * FROM posts";

    mysqlConnection.query(posts, function(err, results) {

        if (err) {
            console.error(err);
            response.status(500).json({ message: "Erro ao buscar posts!" })
        } else {
            console.log(results);
            response.status(200).json({ posts: results });
        }

    });
});


router.post('/create',upload.single('file'), async (req, res) => {
    try {
      const { title, description } = req.body;
      const  file  = req.file;
      if (!file) {
        return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
      }
    
      // Determinar o tipo de arquivo (imagem ou vídeo)
      const fileType = file.mimetype.startsWith('video') ? 'video' : 'image';
    
      // Salvar os dados no banco de dados (MySQL)
      const insertQuery = `INSERT INTO posts(pts_title, pts_description, pts_${fileType}) VALUES (?, ?, ?)`;
      const values = [title, description, file.filename];
  
      await mysqlConnection.query(insertQuery, values);
  
      res.status(201).json({ message: 'Item criado com sucesso!' });
    } catch (err) {
      res.status(500).json({ message: 'Ocorreu um erro ao criar o item.', error: err.message });
    }
  });


  router.put("/update/:pts_id", function (request, response) {
    const { pts_id } = request.params;
    const { title, description, image, video } = request.body;
  
    let updateSql = "UPDATE posts SET pts_title=?, pts_description=?, pts_image=?, pts_video=? WHERE pts_id=?";
  
    mysqlConnection.query(updateSql, [title, description, image, video, pts_id], (err, results) => {
      if (err) {
        console.error(err);
        response.status(500).json({ message: "Erro ao atualizar post" });
      } else {
        response.status(200).json({ message: "Post atualizado com sucesso" });
      }
    });
  });
  
  

router.delete("/delete/:pts_id", function(request, response){
    
    const { pts_id } = request.params;
    console.log(pts_id);
  // First, fetch the filenames of the files associated with the post being deleted
  let getFileNamesSql = "SELECT pts_image, pts_video FROM posts WHERE pts_id=?";
  mysqlConnection.query(getFileNamesSql, [pts_id], (err, results) => {
    if (err) {
      console.error(err);
      response.status(500).json({ message: "Erro ao buscar arquivos associados ao post" });
    } else {
      const { pts_image, pts_video } = results[0] || {};
      // Now, delete the post from the database
      let delSql = "DELETE FROM posts WHERE pts_id=?";
      mysqlConnection.query(delSql, [pts_id], (err, results) => {
        if (err) {
          console.error(err);
          response.status(500).json({ message: "Erro ao deletar post" });
        } else {
          // Delete the associated files from the "uploads/" folder
          if (pts_image) {
            const imagePath = path.join(__dirname, "../../uploads/", pts_image);
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
          if (pts_video) {
            const videoPath = path.join(__dirname, "../../uploads/", pts_video);
            fs.unlink(videoPath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
          response.status(200).json({ message: "Post e arquivos associados deletados com sucesso" });
        }
      });
    }
  });
});

  
module.exports = app => app.use('/post', router);