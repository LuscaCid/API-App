const {hash , compare} = require('bcryptjs')
const AppError = require('../utils/AppError')

const sqliteConection = require('../database/sqlite/index')
class UserController {
        
    async updatePassword(req,res){
        const {id} = req.params
        const {oldPassword, newPassword} = req.body
        const database = await sqliteConection()
        const currentUserPassword = await database.get('select * from users2 where id = (?)',[id])
        
        console.log(currentUserPassword.password)
        if(currentUserPassword.password && oldPassword){
            if(await compare(oldPassword, currentUserPassword.password )){
                const newHashedPassword = await hash(newPassword, 8)
               
                await database.run(`UPDATE users2 SET password = ? where id = ?`,[newHashedPassword, id])
                res.status(200).send('senha alterada com sucesso')
                return
            }
            res.status(301).send('as senhas nao correspondem')
            
        }
        else {
            res.status(403).send('informe o(s) dado(s) solicitado(s)')
        }
    }

    async updateUser(req, res){
        const {id} = req.params
        const database = await sqliteConection()
        const userExists = await database.get('select * from users2 where id = (?)',[id])
        if(!userExists){
            res.status(404).send('usuario inexistente. Não encontrado')
            return
        }
        const {name, email} = req.body
        const alreadyEmailRegistered = await database.get('select * from users2 where email = (?)',[email])
        if(alreadyEmailRegistered && alreadyEmailRegistered.id != id){
            console.log('email ja esta em uso')
            return res.status(401).send('email em uso')
        } 
        userExists.name = name ? name : userExists.name
        userExists.email = email ? email : userExists.email
        await database.run(`
            UPDATE users2 SET 
            name = ?,
            email = ?,
            updated_at = DATETIME('now')
            WHERE id = ?
        `,[userExists.name,userExists.email,id])

        return res.status(200).send(`informacao atualizada na database: ${userExists.email}`)
    }

    async createUser(req ,res){
        const {
            userName,
            email,
            cpf,
            password,
            age,
             
        } = req.body
        const hashedPassoword = await hash(password, 8)
        const database = await sqliteConection()
        const userExists = await database.get('SELECT email FROM users2 WHERE email = (?)',[email])
        if(userExists){
            res.status(401).send('email ja cadastrado no banco de dados')
            return
            /*throw ErrorInApp*/  
        } 
        await database.run('INSERT INTO users2 (name, password,cpf, email) VALUES (?, ?, ?, ?)',[userName,hashedPassoword,cpf,email])
        .then(res.status(201).send(`usuario: ${userName} cadastrado com sucesso!`))
        
        return res.status(201).json()
    
        
    }

    queryParams(req, res){
        const {variable} = req.query
        res.send(`pagina inicial ${variable}`)
    }
    routeParams(req,res){
        const value = req.params.value
        res.send(`a resposta presente no route param é ${value}`)
    }
}
module.exports = UserController