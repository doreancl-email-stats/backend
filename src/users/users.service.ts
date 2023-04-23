import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Profile } from '../auth/google/interfaces/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto) {
    const createdCat = new this.userModel(createUserDto);
    return await createdCat.save();
  }

  async findOne(id): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findOneBy(filter): Promise<User> {
    console.log(22, {filter})
    return await this.userModel.findOne(filter).exec();
  }

  async findAll(filter = {}): Promise<User[]> {
    console.log({ filter });
    return await this.userModel.find(filter).exec();
  }

  async update(id, updateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async remove(id) {
    const res: DeleteResult = await this.userModel
      .deleteOne({
        _id: id,
      })
      .exec();

    return res.deletedCount > 0;
  }

  async findOrCreate(
    id: string,
    provider: string,
    accessToken,
    refreshToken,
    profile: Profile,
  ) {
    let user = await this.findOneBy({ user_id: id });

    if (user) {
      user = await this.update(user._id, {
        access_token: accessToken,
        refresh_token: refreshToken,
        last_check_date: new Date(),
      });
    }
    if (!user) {
      user = await this.create({
        user_id: profile.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        profile,
        last_check_date: new Date(),
      });
    }

    return user;
  }
}
