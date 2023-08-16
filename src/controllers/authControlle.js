const express = require("express");
const mysqlConnection = require("../database");
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/register', async(request, response)=>{
    try{ 
        const {  use_name, use_email, use_telefone, use_pass} = request.body;

        let sqldate = "SELECT (SELECT COUNT(*) FROM user WHERE use_email = ?) > 0 as num_rows;";
    
        mysqlConnection.query(sqldate, [use_email], (err, results)=>{

            if(results && results.length > 0 && results[0].num_rows > 0){
                return response.status(400).json({
                    message: "Email já existente!"
                })
            }else{
                let sqlreg = "INSERT INTO user( use_name, use_email, use_telefone,  use_pass) VALUES (?,?,?,MD5(?))"

                mysqlConnection.query(sqlreg, [ use_name, use_email, use_telefone,  use_pass], (err, results)=>{
                    if(err){
                        console.log(err);
                        response.status(404).json({
                            message: "Erro ao tentar realizar cadastro no banco de dados. Revise as informações"
                        });

                    }else{
                        if(results){
                            response.status(200).json({
                                message: "Cadastro realizado com sucesso.Faça login para acessar a plataforma!"
                            });
                        }
                    }
                })
            }
        })
    }catch(err){
        response.status(400).json({message: "Falha ao tentar resgistrar"})
    }
})


// router.post("/login", async(request, response)=>{
//     try {
//         let email = request.body?.email || null;
//         let pass = request.body?.password || null;

//         if(email && pass){
//             mysqlConnection.query("SELECT * FROM user WHERE use_email = ? AND use_pass = MD5(?)", [email, pass], function(error, results, fields){
//                 console.log(results);

//                 if(error){
//                     response.status(404).json({
//                         message: "erro ao tentar realizar autenticação no banco de dados!"
//                     });
//                 }else{
//                     if(results.length > 0){
//                         let user = {name: results[0].use_name, wpp: results[0].use_tel, email: results[0].use_email};
                        
//                         const token = jwt.sign({ email: user.email }, 'your_secret_key_here') 
                            
//                         response.cookie('auth_token', token, {
//                             httpOnly: true,
//                             // Add other cookie options like secure, domain, etc. if needed
//                           });

//                         response.status(200).json({
//                             message: "Login efetuado com sucesso!", user, 
//                             token, 
//                             signed:true
//                         });
//                     }else{
//                         response.status(404).json({
//                             message: "Email ou senha Inválidos!", signed: false
//                         });
//                     }

//                 }
//             })
//         }
        
//     } catch (error) {
//       res.status(400).json({message: "erro"})
//     }
// })


router.post("/login", async (request, response) => {
    try {
      let email = request.body?.email || null;
      let pass = request.body?.password || null;
  
      if (email && pass) {
        mysqlConnection.query("SELECT * FROM user WHERE use_email = ? AND use_pass = MD5(?)", [email, pass], function (error, results, fields) {
          console.log(results);
  
          if (error) {
            response.status(404).json({
              message: "Erro ao tentar realizar autenticação no banco de dados!"
            });
          } else {
            if (results.length > 0) {
              let user = { name: results[0].use_name, wpp: results[0].use_tel, email: results[0].use_email };
  
              const token = jwt.sign({ email: user.email }, 'your_secret_key_here');
  
              // Set the JWT as an HTTP-only cookie in the response
              response.cookie('auth_token', token, {
                httpOnly: true,
                // Add other cookie options like secure, domain, etc. if needed
              });
  
              response.status(200).json({
                message: "Login efetuado com sucesso!",
                user,
                signed: true
              });
            } else {
              response.status(404).json({
                message: "Email ou senha Inválidos!",
                signed: false
              });
            }
          }
        });
      }
    } catch (error) {
      response.status(400).json({ message: "erro" });
    }
  });


router.post("/logout", async (request, response) => {
    try {
      return response.status(200).json({ message: "Logout realizado com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro ao tentar realizar o logout." });
    }
  });


  router.get("/isAuthenticated", async (request, response) => {
    try {
      // Get the JWT from the request cookies
      const token = request.cookies.auth_token;
  
      if (token) {
        // Verify the JWT
        jwt.verify(token, 'your_secret_key_here', (err, decoded) => {
          if (err) {
            // JWT verification failed, user is not authenticated
            return response.json(false);
          } else {
            // JWT verification succeeded, user is authenticated
            return response.json(true);
          }
        });
      } else {
        // No token found, user is not authenticated
        return response.json(false);
      }
    } catch (error) {
      response.status(500).json({ message: "Erro ao verificar a autenticação." });
    }
  });

module.exports = app => app.use('/auth', router);