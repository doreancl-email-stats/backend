import { CacheModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register(),
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger],
  exports: [UsersService],
})
export class UsersModule {}
