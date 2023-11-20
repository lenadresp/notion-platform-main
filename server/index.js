const express = require("express");
const app = express();
const PORT = 4000;
const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require('socket.io')(http, {
    cors:{
        origin: "http://localhost:3000",
    },
})

const{ Novu } = require("@novu/node");
const novu = new Novu("<fdec25b576f182dd4eb4cf30e8e68130>");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let allUsers = [];

const sendUsersNotification = (users, sender) => {
    users.forEach(function (user) {
        novuNotify(user, sender);
    });
};

const novuNotify = async (user, sender) => {
    try{
        await novu
            .trigger("<TEMPLATE_ID>", {
                to: {
                    subscriberId: user.id,
                    firstName: user.text,
                },
                payload: {
                    sender: sender,
                },
            })
            .then((res) => console.log("Response >>", res));
    } catch (err) {
        console.error("Error >>>>", { err });
    }
};

socketIO.on('connection', (socket) => {
    console.log(`⚡ : ${socket.id} user just connected!`);

    socket.on("findPost", (postID) => {
        let result = notionPosts.filter((post) => post.id === postID);
        socket.emit("postDetails", result[0]);
    });

    socket.on("createPost", (data) => {
        const { postTitle, postContent, username, timestamp, tags } = data;
        notionPosts.unshift({
            id: fetchID(),
            title: postTitle,
            author: username,
            createdAt: timestamp,
            content: postContent,
            comments: [],
        });
        sendUsersNotification(tags, username);
        socket.emit("updatePosts", notionPosts);
    });
    
    socket.on("newComment", (data) => {
		const { postID, user, comment } = data;
		let result = blogPosts.filter((post) => post.id === postID);
		result[0].comments.unshift({
			id: fetchID(),
			user,
			message: comment,
		});
		socket.emit("postDetails", result[0]);
	});

    socket.on("addUser", (user) => {
        allUsers.push(user);
    });

    socket.on('disconnect', () => {
        socket.disconnect()
        console.log(`🔥 : A user disconnected`);
    });
});

app.get("/api", (req, res) => {
    res.json(notionPosts);
});

app.get("/users", (req, res) => {
    res.json(allUsers);
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

