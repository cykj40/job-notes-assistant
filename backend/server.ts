import express, { Request, Response } from 'express';
import cors from 'cors';
import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY!,
});

app.post('/generate-notes', async (req: Request, res: Response) => {
    const { rawNotes } = req.body;

const prompt = `
Generate detailed technical job notes based on the following raw notes. If their is not enough data to complete any of the steps in work performed exclude the step in your response.  Do not mention anyone by name. If someone from our company is mentioned, refer to them as "L & D Construction Group". The bottom of the sheet should include this statement automatically "If you require any further clarification or additional details on specific steps taken, L & D Construction Group is happy to provide more information". The notes should be written in a clear, professional format from the first-person perspective of "L & D Construction Group." The structure should include:

Invoice Notes:

Work Performed:
1. **Area Preparation**: Provide detailed descriptions of how we prepared the job site, including protective measures and any initial demolition or equipment setup.
2. **Tasks**: List and describe the major tasks we performed, focusing on key actions like demolition, installation, adjustments, and coordination with other contractors. Ensure that all relevant steps are included, written in a first-person perspective (e.g., "We removed the existing ceiling tiles...").
3. **Final Cleanup**: Describe how we wrapped up the job, including cleanup, removal of protective materials, and final checks.
4. **Coordination**: Mention any interactions with contractors, engineers, or staff (without using names), and summarize how we coordinated the job between teams.

Materials Used:
- Extract and list any materials or equipment mentioned in the raw notes.

Raw Notes: ${rawNote}
`;

    try {
        const response = await cohere.generate({
            model: 'command-xlarge-nightly',
            prompt: prompt,
            maxTokens: 500,
        });

        // Use response.generations[0].text for the output
        const formattedNotes = response.generations[0].text.trim();
        res.json({ formattedNotes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate notes' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

