import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateLinkDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'Original url must be a URL address' })
  originalUrl: string;
}
