import { MessageCode } from '@/constants/message-code';

export class BaseResponseDto<T = any> {
  statusCode: number;
  message: string;
  data: T | T[] | unknown | any;

  constructor(
    data: T | T[] | null = null,
    message = MessageCode.SUCCESS,
    statusCode = 200,
  ) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static ok<T>(
    data: T | T[] | null = null,
    message = MessageCode.SUCCESS,
    statusCode = 200,
  ) {
    return new BaseResponseDto(data, message, statusCode);
  }
}
