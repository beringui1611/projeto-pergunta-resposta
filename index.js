const express = require("express");

const app = express();

const bodyParser = require("body-parser")
const connection = require("./database/database")
const pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")
//database

connection.
    authenticate()
    .then(() => {
        console.log("conexão feita com sucesso")
    }).catch((msgErr) => {
        console.log(msgErr);
    })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get("/", (req, res) => {
    pergunta.findAll({
        raw: true, order: [
        ['id','DESC']
    ]}).then(perguntas => {
        res.render("index.ejs", {
    perguntas: perguntas
        })
    })
 
});

app.get("/perguntar", (req, res) => {
 res.render("perguntar")
  
})

app.post("/save-asks", (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
  

    pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
        
    
});

app.get("/pergunta/:id", (req, res) => {
    const id = req.params.id;

    pergunta.findOne({
      
        where: {id: id}
        
    }).then(pergunta => {
        if (pergunta == undefined) {
            console.log("pergunta não encontrada")
            res.redirect("/")
        } else {

            Resposta.findAll({
                order: [
                    ['id','DESC']
                ],
                where: {perguntaId: pergunta.id}
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            })
         
    }
    })
})

app.post("/responder", (req, res) => {
    const corpo = req.body.corpo
    const perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`)
    });

});

app.listen(8080, () => {
    if (app) {
        console.log("server init 🚀")
    } else {
        console.log("server off")
    }
});