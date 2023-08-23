import http from "http";
import fs from "fs/promises";

const app = http.createServer(async (req, res) => {
    // "/"" : GET
    if (req.url === "/" && req.method === "GET") {
        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        //set the response
        res.write("Node.js Vanilla Users REST API 🎉");
        //end the response
        res.end();
    }
    // "/users" : GET
    else if (req.url === "/users" && req.method === "GET") {
        const data = await fs.readFile("data.json");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
    }

    // "/users" : POST
    else if (req.url === "/users" && req.method === "POST") {
        // get the data sent along
        const newUser = JSON.parse(await getReqData(req));
        // user object with generated dummy id and parsed userData
        const user = {
            id: new Date().getTime(),
            ...newUser
        };
        const data = await fs.readFile("data.json");
        const users = JSON.parse(data);
        users.push(user);
        const usersJSON = JSON.stringify(users);
        await fs.writeFile("data.json", usersJSON);

        // set the status code and content-type
        res.writeHead(200, { "Content-Type": "application/json" });
        //send the user
        res.end(usersJSON);
    }

    // "/users/:id" : PUT
    else if (req.url.match(/\/users\/([0-9]+)/) && req.method === "PUT") {
        // get id from url
        const id = Number(req.url.split("/")[2]);
        const data = await fs.readFile("data.json");
        const users = JSON.parse(data);

        let userToUpdate = users.find(user => user.id === id);
        const userData = JSON.parse(await getReqData(req));
        userToUpdate.image = userData.image;
        userToUpdate.mail = userData.mail;
        userToUpdate.name = userData.name;
        userToUpdate.title = userData.title;

        const usersJSON = JSON.stringify(users);
        fs.writeFile("data.json", usersJSON);
        // set the status code and content-type
        res.writeHead(200, { "Content-Type": "application/json" });
        //send the user
        res.end(usersJSON);
    }

    // "/users/:id" : DELETE
    else if (req.url.match(/\/users\/([0-9]+)/) && req.method === "DELETE") {
        // get id from url
        const id = Number(req.url.split("/")[2]);
        const data = await fs.readFile("data.json");
        const users = JSON.parse(data);

        const newUsers = users.filter(user => user.id !== id);
        const usersJSON = JSON.stringify(newUsers);

        fs.writeFile("data.json", usersJSON);
        // set the status code and content-type
        res.writeHead(200, { "Content-Type": "application/json" });
        //send the user
        res.end(usersJSON);
    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

app.listen(3000, () => {
    console.log(`App running on http://localhost:3000`);
});

async function getReqData(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => resolve(body));
        req.on("error", reject);
    });
}
