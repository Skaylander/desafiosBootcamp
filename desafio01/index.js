const express = require ('express');

const server = express();

server.listen(3000);
server.use(express.json());

const projects = [];
let requests = 0;

server.use((req, res, next) => {
  requests++;
  console.log(`${requests} requisições feitas`);
  
  return next();
}) 

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  
  return next();
}

function findProject(id) {
  return projects.find(project => project.id == id);
}

server.get('/projects', (req, res) => {
  res.json(projects);

});

server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body
  projects.push({id, title, tasks});

  return res.json(projects)

});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);
  project.tasks.push(title);

  return res.json(projects);

});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = findProject(id);
  project.title = title;  
  
  return res.json(project);

});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id == id);
  projects.splice(index, 1);
  res.send();

})




