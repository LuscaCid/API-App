require('express-async-errors')

const AppError = require('./utils/AppError')
const migrationsRun = require('./database/sqlite/migrations/index')
const express = require("express");
const usersRoutes = require('./routes/users.routes')
const notesRoutes = require('./routes/notes.routes')
const tagsRoutes = require('./routes/tags.routes')
const app = express();
migrationsRun()

app.use(usersRoutes)
app.use(notesRoutes)
app.use(tagsRoutes)

const PORT = 3333;

app.use(express.json())

app.use((error, request, response, next)=>{
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status : "error",
            message : error.message
        })
    }
    console.error(error)
    return response.status(500).json({
        status : "500",
        message : "internal server error"
    })
})

app.listen(PORT, ()=> console.log(`A porra ta rodando na PORT: ${PORT}`))