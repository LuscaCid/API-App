const knex = require('../database/knex/index')

class TagsController  { 
    async testingApplication(req, res){
        res.status(201).send('its working')
    }

    async showAllTags(req, res){
        const {tittle, user_id} = req.query
        let allTags
        let tagID65
        if(tittle){
            allTags = await knex("tags")
            .where({user_id})
            .whereLike("name", `%${tittle}%`)
        
        } else {
            allTags = await knex("tags")
            .where({user_id})
            tagID65 = allTags.filter(tag => tag.user_id === Number(user_id))
            console.log(tagID65)
        }
        const tags = allTags
        res.json(tagID65)
    }
}
module.exports = TagsController


/**
 * quando as colunas dentro do banco de dados tem o mesmo nome que a variavel
 * nao precisa passar como argumento para o where (user_id : user_id) por exemplo
 * 
 */