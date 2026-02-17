import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateLinkDto {
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
