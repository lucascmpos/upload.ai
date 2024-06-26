"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPromptsRoute = void 0;
const prisma_1 = require("../lib/prisma");
async function getAllPromptsRoute(app) {
    app.get('/prompts', async () => {
        const prompts = await prisma_1.prisma.prompt.findMany();
        return prompts;
    });
}
exports.getAllPromptsRoute = getAllPromptsRoute;
