const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // ou o caminho correto para o arquivo onde você definiu o `router`
const path = require('path');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Testes de integração da API', () => {
  it('Deve criar um novo post', async () => {
    const post = {
      title: 'Novo Post',
      description: 'Descrição do novo post',
      image: 'test/download.jpg', // Caso queira testar com uma imagem, você precisará enviar o arquivo corretamente aqui
      video: 'test/Pokedex-API.mp4', // Caso queira testar com um vídeo, você precisará enviar o arquivo corretamente aqui
    };
  
    const res = await chai
      .request(app)
      .post('/post/create')
      .field('title', post.title)
      .field('description', post.description)
      .attach('image', 'test/test/download.jpg') // Caso queira testar com uma imagem
      .attach('video', 'test/test/Pokedex-API.mp4'); // Caso queira testar com um vídeo
  
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message', 'Item criado com sucesso!');
  });
  
  it('Deve buscar todos os posts', (done) => {
    chai
      .request(app)
      .get('/post/findall')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('posts');
        expect(res.body.posts).to.be.an('array');
        done();
      });
  });
  
  it('Deve deletar um post', (done) => {
    const postId = 21; // Defina o ID do post que deseja deletar aqui
  
    chai
      .request(app)
      .delete(`/post/delete/${postId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Post e arquivos associados deletados com sucesso');
        done();
      });
  });
  
  
  const postData = {
    title: 'Updated Post Title',
    description: 'Updated Post Description',
    image: 'test/new-image.jpg', // Provide the path to the updated image for testing
    video: 'test/new-video.mp4', // Provide the path to the updated video for testing
  };

  it('Should update a post', (done) => {
    chai
      .request(app)
      .put('/post/update/17') // Replace '1' with the ID of the post you want to update
      .send(postData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Post atualizado com sucesso');
        done();
      });
  });

});