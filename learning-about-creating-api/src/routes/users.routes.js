const express = require('express')
const usersRoutes = express()
const UserController = require('../controllers/UsersController') 
const AppError = require('../utils/AppError')
function myMiddleware(req, res, next){
    const person = req.body
    if (person.userName){
        next()
    } else throw new AppError('nome obrigatorio') 
    /* return res.status(401).send('nao foi possivel criar, nome nao passado')/*/
}

const userController = new UserController()

usersRoutes.use(express.json())
usersRoutes.put('/users/:id', userController.updateUser)
/*atualização*/

usersRoutes.put('/userspassword/:id', userController.updatePassword)

usersRoutes.post('/create', myMiddleware, userController.createUser)
/*criacao, lancamento no database*/ 


usersRoutes.get('/', userController.queryParams)

usersRoutes.get('/card/:value', userController.routeParams)

usersRoutes.get('/anothercard/:anotherValue', (req, res)=>{
    const {anotherValue} = req.params
    res.send(`outra card value : ${anotherValue}`)
})

usersRoutes.post('/post-route',  userController.createUser)
module.exports = usersRoutes