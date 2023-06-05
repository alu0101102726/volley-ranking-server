const express = require("express");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));
const userDirectoryPath = path.join(__dirname, '/users');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for JSONPlaceholder',
        version: '1.0.0',
        description:
          'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
        contact: {
          name: 'JSONPlaceholder',
          url: 'https://jsonplaceholder.typicode.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
};
  
const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function writeUserInformation(values, filePath) {
    const idDirectoryPath = path.join(userDirectoryPath, `/${values.id}`);
    if (!fs.existsSync(idDirectoryPath))
        fs.mkdirSync(idDirectoryPath);
    if(!fs.existsSync(filePath))
        fs.writeFileSync(filePath, JSON.stringify(values, null, 2));
}

function reWriteFile(infoPath, data) {
    const filePath = path.join(userDirectoryPath, infoPath);
    if(fs.existsSync(filePath))
        fs.unlinkSync(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data));
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Support POSTing form data with URL encoded
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
});

app.post("/register", (req, res) => {
    const body = Object.keys(req.body)[0] + "\"}";
    const data = JSON.parse(body);
    const userFilePath = path.join(userDirectoryPath, `/${data.id}/info.json`);
    writeUserInformation(data, userFilePath);
    res.end();
});

app.post("/vote", (req, res) => {
    const body = Object.keys(req.body);
    const data = JSON.parse(body);
    reWriteFile(`/${data.id}/votes.json`, data);
    res.end()
})

app.post("/profile", (req, res) => {
    const body = Object.keys(req.body)[0] + "\"}";
    const data = JSON.parse(body);
    data.photo = data.photo.replaceAll(' ', '+');
    reWriteFile(`/${data.id}/info.json`, data);
    res.end()

})

app.get("/votes", (req, res) => {
    const files = [];
    fs.readdirSync(userDirectoryPath).forEach(folderName => {
        const file = path.parse(folderName);
        const filePath = path.join(userDirectoryPath, `${file.name}`);
        files.push(fs.readFileSync(`${filePath}/votes.json`, 'utf8'));
    })
    res.json(files);

})

app.get("/:id", (req, res) => {
    const filePath = path.join(userDirectoryPath, `${req.params.id}/info.json`);
    const file = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(file);
    res.json(data);
})

/*
app.get("/login", (req, res) => {
    let allUsersJSON = {};
    let pathUser = './users';
    const dataFiles = fs.readdirSync(pathUser, "utf-8")
    dataFiles.forEach(userJSON => {
        const userEmail = userJSON.split('.')[0];
        allUsersJSON[`${userEmail}`] = JSON.parse(fs.readFileSync(`${pathUser}/${userJSON}`, "utf-8"));

    })  
    res.json(allUsersJSON);
});

app.get("/votes", (req, res) => { 

    let currentDay = new Date();
    let dateDifference = (finalDate.getTime() - currentDay.getTime()) / 1000;
    if (dateDifference < 1) {
        const dataFiles = fs.readdirSync(dataFile, "utf-8")
        dataFile = path.join(__dirname, `votes_${currentDay.getTime()}.json`);
        finalDate.setDate(currentDay.getDate() + 5);
        res.json({endVote: finalDate,changed: true, previousData:dataFiles});
    } 
    res.json({endVote: finalDate,changed: false});
});
*/
app.listen(3000, () => console.log("Server is running..."));
