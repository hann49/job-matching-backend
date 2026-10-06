import { Profile } from "./profile.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProfileService } from "./profile.service"
import { ProfileController } from "./profile.controller"
import { User } from "../users/user.entity"
import { Module } from "@nestjs/common"

@Module({
    controllers: [ProfileController],
    providers: [ProfileService],
    imports: [TypeOrmModule.forFeature([Profile, User])],

})
export class ProfileModule {

}