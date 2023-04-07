const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const dataFile = path.join(__dirname, "data.json");
const userFile = path.join(__dirname, "/users");

let today = new Date();
let finalDate = new Date();
let totalPeopleVoted = 0;
finalDate.setDate(today.getDate() + 5);

// Support POSTing form data with URL encoded
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
});

app.get("/poll", (req, res) => {
    let data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const totalVotes = Object.values(data).reduce((total, n) => total += n, 0);

    data = Object.entries(data).map(([label, votes]) => {
        return {
            label,
            percentage: (((100 * votes) / totalVotes) || 0).toFixed(0),
            totalVotes: votes
        }
    });
    res.json(data);
});

app.post("/poll", (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    let userInfo = JSON.parse(Object.keys(req.body));
    let tierResults = userInfo.votes;
    totalPeopleVoted = userInfo.peopleVoted;

    for (const property in tierResults) {
        if (Object.hasOwnProperty.bind(data)(property)) {
            data[property] += tierResults[property];
        }
    }

    fs.writeFileSync(dataFile, JSON.stringify(data));

    const emailSplit = userInfo.email.split('@')[0];
    fs.unlinkSync(`${userFile}/${emailSplit}.json`);
    fs.writeFileSync(`${userFile}/${emailSplit}.json`, JSON.stringify(userInfo));

    res.end();
});

app.get("/peopleVoted", (req, res) => {
    let data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const totalVotes = Object.values(data).reduce((total, n) => total += n, 0);
    res.json({totalPeopleVoted, totalVotes});
});

app.post("/register", (req, res) => {
    const data = JSON.parse(Object.keys(req.body));
    data.votes = [];
    const emailUser = data.email.split('@')[0];
    const pathUser = `./users/${emailUser}.json`;
    fs.writeFileSync(pathUser, JSON.stringify(data));

    res.end();
});

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
  

app.listen(3000, () => console.log("Server is running..."));