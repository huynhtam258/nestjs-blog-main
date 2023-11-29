import { Request } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";

export interface CommonRequest extends Request {
  user_data: User
  fileValidationError?: string
}