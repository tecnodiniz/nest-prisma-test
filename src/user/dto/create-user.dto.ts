import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmpty()
  @IsNotEmpty()
  email: string;

  @IsString()
  password: string;
}
