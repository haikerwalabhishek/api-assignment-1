import express from "express";

const app = express();
app.use(express.json());

// Users in memory
let users = [
    { id: "1", firstName: "Anshika", lastName: "Agarwal", hobby: "Teaching" }
];

// Middleware to log details
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
});

// Middleware to validate user data
const validateUser = (req, res, next) => {
    const { firstName, lastName, hobby } = req.body;
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ message: "First name, last name, or hobby are missing in the body" });
    }
    next();
};

// Fetch all users
app.get("/users", (req, res) => {
    res.status(200).json(users);
});

// Fetch user by id
app.get("/users/:id", (req, res) => {
    const userId = req.params.id;

    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
});

// Add a new user
app.post("/user", validateUser, (req, res) => {
    const { firstName, lastName, hobby } = req.body;

    const newUser = {
        id: (users.length + 1).toString(), // Ensure unique ID generation
        firstName,
        lastName,
        hobby
    };

    users.push(newUser);
    res.status(201).json(users);
});

// Update existing user
app.put("/user/:id", validateUser, (req, res) => {
    const { firstName, lastName, hobby } = req.body;
    const userId = req.params.id;

    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.hobby = hobby;

    res.status(200).json(user);
});

// Delete existing user
app.delete("/user/:id", (req, res) => {
    const userId = req.params.id;

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users.splice(userIndex, 1);
    res.status(200).json({ message: "User deleted successfully", users });
});

app.listen(5100, () => {
    console.log("Server is running on http://localhost:5100/");
});
