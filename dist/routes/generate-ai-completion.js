"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAICompletionRoute = void 0;
const zod_1 = require("zod");
const ai_1 = require("ai");
const prisma_1 = require("../lib/prisma");
const openai_1 = require("../lib/openai");
async function generateAICompletionRoute(app) {
    app.post('/ai/complete', async (req, reply) => {
        const bodySchema = zod_1.z.object({
            videoId: zod_1.z.string().uuid(),
            prompt: zod_1.z.string(),
            temperature: zod_1.z.number().min(0).default(0.5),
        });
        const { videoId, prompt, temperature } = bodySchema.parse(req.body);
        const video = await prisma_1.prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            }
        });
        if (!video.transcription) {
            return reply.status(400).send({ error: 'Video transcription was not generated yet.' });
        }
        const promptMessage = prompt.replace('{transcription}', video.transcription);
        const response = await openai_1.openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            temperature,
            messages: [
                { role: 'user', content: promptMessage }
            ],
            stream: true,
        });
        const stream = (0, ai_1.OpenAIStream)(response);
        (0, ai_1.streamToResponse)(stream, reply.raw, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST',
            }
        });
    });
}
exports.generateAICompletionRoute = generateAICompletionRoute;
