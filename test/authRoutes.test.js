const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../index"); // Importe aqui o arquivo onde as rotas foram definidas.

describe("Testes das rotas de autenticação", () => {
  // Teste da rota de registro ("/register")
  describe("POST /auth/register", () => {
    it("Deve retornar status 200 e mensagem de sucesso para um novo usuário", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          use_name: "Administrador",
          use_email: "admin@teste.com",
          use_telefone: "999999999",
          use_pass: "admin2023"
        });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal(
        "Cadastro realizado com sucesso.Faça login para acessar a plataforma!"
      );
    });

  });
})