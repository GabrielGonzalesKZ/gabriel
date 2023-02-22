import express, { Application } from "express"
import { startDatabase } from "./database"
import { createDeveloper, createDeveloperInfo, deleteDeveloper, listAllDevelopers, listDeveloper, listDeveloperProjects, updateDeveloper } from "./logics/developer.logic"
import { createProject, listProjects, listProjectById, createProjectTech, deleteProject, deleteProjectTech, updateProject } from "./logics/projects.logic"
import { ensureDeveloperExists } from "./middlewares/developers.middlewares"

const app: Application = express()
app.use(express.json())

app.post('/developers', createDeveloper)
app.post('/developers/:id/infos', ensureDeveloperExists, createDeveloperInfo)
app.get('/developers/:id', ensureDeveloperExists, listDeveloper)
app.get('/developers/:id/projects', ensureDeveloperExists, listDeveloperProjects)
app.get('/developers', listAllDevelopers)
app.delete('/developers/:id', ensureDeveloperExists, deleteDeveloper)
app.patch('/developers/:id', ensureDeveloperExists, updateDeveloper)

app.post('/projects', createProject)
app.get('/projects', listProjects)
app.get('/projects/:id', ensureDeveloperExists, listProjectById)
app.patch('/projects/:id', ensureDeveloperExists, updateProject)
app.delete('/projects/:id', ensureDeveloperExists, deleteProject)
app.post('/projects/:id/technologies', ensureDeveloperExists, createProjectTech)
app.delete('/projects/:id/technologies/:techname',ensureDeveloperExists,deleteProjectTech)

app.listen(3000, async () => {
    await startDatabase()
    console.log(`Server is running!`)
})