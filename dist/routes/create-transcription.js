"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTranscriptionRoute = void 0;
const node_fs_1 = require("node:fs");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const openai_1 = require("../lib/openai");
async function createTranscriptionRoute(app) {
    app.post('/videos/:videoId/transcription', async (req) => {
        const paramsSchema = zod_1.z.object({
            videoId: zod_1.z.string().uuid(),
        });
        const { videoId } = paramsSchema.parse(req.params);
        const bodySchema = zod_1.z.object({
            prompt: zod_1.z.string(),
        });
        const { prompt } = bodySchema.parse(req.body);
        const video = await prisma_1.prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            }
        });
        const videoPath = video.path;
        const audioReadStream = (0, node_fs_1.createReadStream)(videoPath);
        const response = await openai_1.openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt,
        });
        const transcription = response.text;
        await prisma_1.prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                transcription,
            }
        });
        return { transcription };
    });
}
exports.createTranscriptionRoute = createTranscriptionRoute;
