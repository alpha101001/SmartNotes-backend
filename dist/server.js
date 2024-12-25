"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const AuthRouters_1 = __importDefault(require("./api/Routes/AuthRouters"));
const NotesRouters_1 = __importDefault(require("./api/Routes/NotesRouters"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./api/models/db");
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
// Middlewares
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.get('/hello', (req, res) => {
    res.send('Hello');
});
// Auth routes
app.use('/api/auth', AuthRouters_1.default);
// Notes routes
app.use('/api/notes', NotesRouters_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
