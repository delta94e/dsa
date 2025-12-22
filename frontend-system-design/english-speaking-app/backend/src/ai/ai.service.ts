import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AIChatRequest, AIMessageDto, Level } from '../types';

@Injectable()
export class AIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'demo-key',
        });
    }

    private getSystemPrompt(topic: string, level: Level): string {
        const levelDescriptions: Record<Level, string> = {
            A1: 'Use very simple words and short sentences. Speak slowly and clearly.',
            A2: 'Use basic vocabulary and simple grammar. Keep sentences short.',
            B1: 'Use everyday language. You can use more complex sentences.',
            B2: 'Use a wide range of vocabulary. Discuss abstract topics naturally.',
            C1: 'Use sophisticated language and nuanced expressions. Be articulate.',
            C2: 'Speak as you would to a native speaker. Use idioms and complex structures.',
        };

        return `You are a friendly English teacher helping a student practice speaking.

Topic: ${topic}
Student Level: ${level} - ${levelDescriptions[level]}

Guidelines:
- Ask open-ended questions to encourage speaking
- Gently correct grammar mistakes when appropriate
- Give positive feedback to build confidence
- Keep the conversation natural and engaging
- Adjust your language complexity to match the student's level
- When correcting, explain briefly why it's incorrect

Start by greeting the student and introducing the topic.`;
    }

    async chat(request: AIChatRequest): Promise<AIMessageDto> {
        const { topic, level, messages } = request;

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: this.getSystemPrompt(topic, level) },
                    ...messages.map((m) => ({
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                    })),
                ],
                temperature: 0.8,
                max_tokens: 500,
            });

            const content = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';

            return {
                role: 'assistant',
                content,
            };
        } catch (error) {
            console.error('OpenAI API error:', error);

            // Fallback response for demo
            return {
                role: 'assistant',
                content: this.getFallbackResponse(topic, messages.length),
            };
        }
    }

    private getFallbackResponse(topic: string, messageCount: number): string {
        const responses = [
            `That's a great point! Can you tell me more about your experience with ${topic}?`,
            `Interesting! Your English is improving. Let's continue practicing. What else can you share?`,
            `Good job! I noticed you used some complex sentences there. Keep it up!`,
            `That's a thoughtful response. Can you elaborate on that a bit more?`,
            `Excellent! You're making great progress. Let me ask you another question about ${topic}.`,
        ];
        return responses[messageCount % responses.length];
    }
}
