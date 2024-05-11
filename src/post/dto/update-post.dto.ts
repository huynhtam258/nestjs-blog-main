export class UpdatePostDto {
  title: string;

  description: string;

  thumbnail: string;

  status: number;

  content: string;

  publish: boolean;

  publish_date: Date;

  is_deleted?: boolean;
}