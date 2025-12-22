import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: '*', // Configure for production
        methods: ['GET', 'POST'],
        credentials: true,
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    🐍 SLITHER.IO SERVER 🐍                     ║
╠═══════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${port}                    ║
║  WebSocket ready for connections                              ║
║                                                               ║
║  Events:                                                      ║
║    → join_game   : { name: string }                           ║
║    → input       : { angle: number, boost: boolean }          ║
║    → respawn     : { name: string }                           ║
║    ← world_update: { snakes, orbs, tick }                     ║
║    ← leaderboard : [{ id, name, score }]                      ║
║    ← player_died : { killerId?, killerName? }                 ║
╚═══════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
