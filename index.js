const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const strftime = require("strftime");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "host.docker.internal",
  // host: "localhost",
  database: "livraria",
  password: "postgres",
  port: 5432,
});
  
// Health Check
app.get("/", (request, response) => {
    response.json({ info: "API Livaria está UP" });
});

// POST LIVROS
app.post("/livros", (request, response) => {
    const { nome, autor, dataPublicacao, qtdePaginas  } = request.body;
    const { token } = request.headers;
  
    if (nome == "" || nome == null) {
      return response
        .status(400)
        .json({ error: "Nome do livro não pode ser em branco ou nulo" });
    }

    if (!typeof nome === 'string') {
        return response
          .status(400)
          .json({ error: "Nome do livro deve ser string" });
    }

    if (autor == "" || autor == null) {
        return response
          .status(400)
          .json({ error: "Autor do livro não pode ser em branco ou nulo" });
    }
  
    if (!typeof nome === 'string') {
          return response
            .status(400)
            .json({ error: "Autor do livro deve ser string" });
    }

    if (String(qtdePaginas) == "" || qtdePaginas == null) {
        return response
          .status(400)
          .json({ error: "Quantidade de paginas do livro não pode ser em branco ou nulo" });
    }

    if (typeof(qtdePaginas) != 'number') {
        return response
          .status(400)
          .json({ error: "Quantidade de paginas do livro deve ser um número" });
    }
  
    if (qtdePaginas <= 0) {
        return response
        .status(400)
        .json({ error: "Quantidade de paginas do livro deve ser maior que 0" });
    }

    if (dataPublicacao == "" || dataPublicacao == null) {
      return response
        .status(400)
        .json({ error: "Data da publicação do livro não pode ser em branco ou nulo" });
    }
  
    if (/[a-zA-Z]/.test(dataPublicacao)){
      throw response.status(400).json({
        error: "Data da publicação do livro deve ser válida",
      });
    }
  
    const currtendDate = strftime("%Y-%m-%d");
    const currentDateString = Date.parse(currtendDate);
    const dataPublicacaoString = new Date(dataPublicacao);
  
    if(isNaN(dataPublicacaoString)){
      throw response.status(400).json({
        error: "Data da publicação do livro deve ser válida",
      });
    }
  
    const created_on = new Date();
    const update_at = null;
    pool.query(
      "INSERT INTO livros (nome, autor, data_publicacao, qtde_paginas, created_on, update_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nome, autor, dataPublicacao, qtdePaginas, created_on, update_at],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(results.rows[0]);
      }
    );
});

// GET ALL livros
app.get("/livros", (request, response) => {
    pool.query(
      "SELECT * FROM livros ORDER BY id ASC",
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
});

// GET by ID
app.get("/livros/:id", (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(
      "SELECT * FROM livros WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
});

// DELETE by ID
app.delete("/livros/:id", (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(
      "SELECT count(*) FROM livros WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows[0].count == '0'){
          return response.status(404).send({message: "Id do Livro não encontrado"});
        } else {
          pool.query(
            "DELETE FROM livros WHERE id = $1",
            [id],
            (error, results) => {
              if (error) {
                throw error;
              }
              return response.status(200).send({message: "Livro Deletado com sucesso"});
            }
          );
        }
      }
    );

});

// PUT LIVROS
app.put("/livros/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const { nome, autor, dataPublicacao, qtdePaginas  } = request.body;
    const { token } = request.headers;
  
    if (nome == "" || nome == null) {
      return response
        .status(400)
        .json({ error: "Nome do livro não pode ser em branco ou nulo" });
    }

    if (!typeof nome === 'string') {
        return response
          .status(400)
          .json({ error: "Nome do livro deve ser string" });
    }

    if (autor == "" || autor == null) {
        return response
          .status(400)
          .json({ error: "Autor do livro não pode ser em branco ou nulo" });
    }
  
      if (!typeof autor === 'string') {
          return response
            .status(400)
            .json({ error: "Autor do livro deve ser string" });
    }

    if (String(qtdePaginas) == "" || qtdePaginas == null) {
        return response
          .status(400)
          .json({ error: "Quantidade de paginas do livro não pode ser em branco ou nulo" });
    }

    if (typeof(qtdePaginas) != 'number') {
        return response
          .status(400)
          .json({ error: "Quantidade de paginas do livro deve ser um número" });
    }
  
    if (qtdePaginas <= 0) {
        return response
        .status(400)
        .json({ error: "Quantidade de paginas do livro deve ser maior que 0" });
    }

    if (dataPublicacao == "" || dataPublicacao == null) {
      return response
        .status(400)
        .json({ error: "Data da publicação do livro não pode ser em branco ou nulo" });
    }
  
    if (/[a-zA-Z]/.test(dataPublicacao)){
      throw response.status(400).json({
        error: "Data da publicação do livro deve ser válida",
      });
    }
  
    const currtendDate = strftime("%Y-%m-%d");
    const currentDateString = Date.parse(currtendDate);
    const dataPublicacaoString = new Date(dataPublicacao);
  
    if(isNaN(dataPublicacaoString)){
      throw response.status(400).json({
        error: "Data da publicação do livro deve ser válida",
      });
    }

    pool.query(
      "SELECT count(*) FROM livros WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows[0].count == '0'){
          return response.status(404).send({message: "Id do Livro não encontrado"});
        } else {
          const update_at = new Date();
          pool.query(
              "UPDATE livros SET nome = $1, autor = $2, data_publicacao = $3, qtde_paginas = $4, update_at = $5 WHERE id = $6 RETURNING *",
            [nome, autor, dataPublicacao, qtdePaginas, update_at, id],
            (error, results) => {
              if (error) {
                throw error;
              }
              response.status(200).send(results.rows[0]);
            }
          );
        }
      });
});

app.patch("/livros/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const fields = Object.keys(request.body);
    console.log(request.body);
    console.log(fields);
    fields.map(val => {
        if (val === 'nome') {
            if (request.body.nome == "" || request.body.nome == null) {
              throw response
                  .status(400)
                  .json({ error: "Nome do livro não pode ser em branco ou nulo" })
              }
          
              if (!typeof request.body.nome === 'string') {
                throw response
                    .status(400)
                    .json({ error: "Nome do livro deve ser string" });
              }
        } else if (val === 'autor') {
            if (request.body.autor == "" || request.body.autor == null) {
              throw response
                  .status(400)
                  .json({ error: "Autor do livro não pode ser em branco ou nulo" });
            }
          
              if (!typeof request.body.autor === 'string') {
                throw response
                    .status(400)
                    .json({ error: "Autor do livro deve ser string" });
            }
        }
        else if (val === 'dataPublicacao') {
            if (request.body.dataPublicacao == "" || request.body.dataPublicacao == null) {
              throw response
                  .status(400)
                  .json({ error: "Data da publicação do livro não pode ser em branco ou nulo" });
              }

              if (request.body.dataPublicacao == "" || request.body.dataPublicacao == null) {
                throw response
                    .status(400)
                    .json({ error: "Data da publicação do livro não pode ser em branco ou nulo" });
                }
            
              if (/[a-zA-Z]/.test(request.body.dataPublicacao)){
                throw response.status(400).json({
                  error: "Data da publicação do livro deve ser válida",
                });
              }
            
              const currtendDate = strftime("%Y-%m-%d");
              const currentDateString = Date.parse(currtendDate);
              const dataPublicacaoString = new Date(request.body.dataPublicacao);
            
              if(isNaN(dataPublicacaoString)){
                throw response.status(400).json({
                  error: "Data da publicação do livro deve ser válida",
                });
              }
        }
        else if (val === 'qtdePaginas') {
            if (String(request.body.qtdePaginas) == "" || request.body.qtdePaginas == null) {
              throw response
                  .status(400)
                  .json({ error: "Quantidade de paginas do livro não pode ser em branco ou nulo" });
            }
        
            if (typeof(request.body.qtdePaginas) != 'number') {
              throw response
                  .status(400)
                  .json({ error: "Quantidade de paginas do livro deve ser um número" });
            }
          
            if (request.body.qtdePaginas <= 0) {
              throw response
                .status(400)
                .json({ error: "Quantidade de paginas do livro deve ser maior que 0" });
            }
        }
    });

    const newFields = fields.map(val => {
    if (val === 'dataPublicacao') {
        return 'data_publicacao';
    } else if (val === 'qtdePaginas') {
        return 'qtde_paginas';
    }
    else {
        return val;
    }
    });

    pool.query(
      "SELECT count(*) FROM livros WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows[0].count == '0'){
          return response.status(404).send({message: "Id do Livro não encontrado"});
        } else {
          const update_at = new Date();
          const values = fields.map(field => request.body[field]);
          values.push(update_at);
          values.push(id);
          const query = `UPDATE livros SET ${newFields.map((field, i) => `${field} = $${i + 1}`).join(', ')}, update_at = $${values.length - 1} WHERE id = $${values.length} RETURNING *`
          pool.query(query,
          values,
            (error, results) => {
              if (error) {
                throw error;
              }
              response.status(200).send(results.rows[0]);
            }
          );
        }
      });
});