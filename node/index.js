const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'  // Caminho para o arquivo do banco de dados
});

const livro = sequelize.define('Biblioteca', {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    tipo: { type: DataTypes.STRING, allowNull: false },
    genero: { type: DataTypes.STRING, allowNull: false },
    ano: { type: DataTypes.INTEGER, allowNull: false }
});

(async () => {
    await sequelize.sync({ force: true });
    console.log("Modelos sincronizados com o banco de dados.");
})();

app.get('/livros', async (req, res) => {
    const livros = await Livro.findAll();
    res.json(livros);
});
app.get('/Livros/:id', async (req, res) => {
    const { id } = req.params;
    const livro = await Livro.findOne({ where: { id } });
    if (livro) {
        res.json(livro);
    } else {
        res.status(404).json({ message: 'Livro não encontrado.' });
    }
});

app.post('/livros', async (req, res) => {
    const { id, tipo, genero, ano } = req.body;
    try {
        const livro = await Livro.create({ id, tipo, genero, ano });
        res.status(201).json({ message: 'Veículo cadastrado com sucesso.', livro });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/livros/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo, genero, ano } = req.body;
    try {
        const [updated] = await Livro.update({ tipo, genero, ano }, { where: { id } });
        if (updated) {
            const updatedLivro = await Livro.findOne({ where: { id } });
            res.json({ message: 'Informações do Livro atualizadas com sucesso.', Livro: updatedLivro});
        } else {
            res.status(404).json({ message: 'Livro não encontrado.' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/livros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Livro.destroy({ where: { id } });
        if (deleted) {
            res.json({ message: 'Livro excluído com sucesso.' });
        } else {
            res.status(404).json({ message: 'Livro não encontrado.' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
