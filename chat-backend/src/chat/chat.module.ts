import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [PrismaModule],
  providers: [ChatService, ChatResolver],
})
export class ChatModule {}
