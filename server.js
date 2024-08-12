const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const path = require('path');
const fs = require('fs');
const lockfile = require('lockfile');

const app = express();
const server = createServer(app);
const rawDataPath = 'rawData.json';
const lockFilePath = 'rawData.lock';

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://quiz-client-10.onrender.com"]
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send("hamza's server");
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, rawDataPath));
});

io.on("connection", (socket) => {
    console.log("User connected");
    console.log(socket.id);

    socket.emit("welcome", "hello");

    socket.on("message", (data) => {
        console.log(`${socket.id} sent message: ${JSON.stringify(data)}`);
        
        socket.emit("recieved", "response recieved!")

        // Acquire the lock
        lockfile.lock(lockFilePath, { retries: 10, retryWait: 100 }, (err) => {
            if (err) {
                console.log("Could not acquire lock:", err);
                return;
            }

            // Critical section: read and update the JSON file
            fs.readFile(rawDataPath, "utf-8", (err, fileData) => {
                if (err) {
                    console.log(err);
                    // Release the lock in case of error
                    lockfile.unlock(lockFilePath, (unlockErr) => {
                        if (unlockErr) console.log("Could not release lock:", unlockErr);
                    });
                    return;
                }

                const json = JSON.parse(fileData);
                json.push(data);

                fs.writeFile(rawDataPath, JSON.stringify(json), (err) => {
                    if (err) {
                        console.log(err);
                    }
                    // Release the lock after writing
                    lockfile.unlock(lockFilePath, (unlockErr) => {
                        if (unlockErr) console.log("Could not release lock:", unlockErr);
                    });
                });
            });
        });
    });
});

server.listen(process.env.PORT || 3000, () => {
    if (!fs.existsSync(rawDataPath)) {
        console.log("No rawData found..creating one");
        fs.writeFileSync(rawDataPath, "[]");
    }
    console.log("Server is running on " + (process.env.PORT || 3000));
});
