const express = require('express');
const cors = require('cors');
const {
  Sequelize,
  DataTypes
} = require('sequelize');
const axios = require('axios')



const sequelizeInit = new Sequelize('search-github', 'postgres', '30094561', {  // ORM Sequelize
  host: 'localhost',
  dialect: 'postgres'
})

function launch(port) {
  const application = express(cors());

  
  application.get("/api/users/:username", async (request, response) => {

    let resultAction = false;

    console.log("request.params.username", request.params.username)
    
    let colonnesDB = {}
    let result = await axios.get(`https://api.github.com/users/${request.params.username}`)     //on fetch pour creer la BD et remplir les colonnes
    result = result.data
    const data = Object.keys(result)
    data.forEach(val => {
        if (val === "id") {      // ID sera de type Integer dans la BD
            colonnesDB = {
                ...colonnesDB,
                [val]: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                }
            }
        } else {        // Les autres champs sont de types String dans la BD
            colonnesDB = {    
                ...colonnesDB,
                [val]: {
                    type: Sequelize.STRING
                }
            }
        }
    });

    const users = await sequelizeInit.define("Users", colonnesDB)
    await users.sync()
    const resultat = await users.findAll({
        where: {
            id: result.id
        }
    })
    if (resultat.length > 0) {
      response.send(resultat[0].dataValues, resultAction)   // si les données existent déjà en BD alors on les affiche
      resultAction = true
    } else {
      resultAction = true
        users.create(result)       // si les données ne sont pas encore présente en BD, on les ajoute puis on les affiche
            .then(_ => {
                response.send(result, resultAction)
            })
    }

    response.json({ username: request.params.username, result: resultAction, data: result });
  });

  application.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
}

launch(3000)