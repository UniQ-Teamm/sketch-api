import { BadRequestException, HttpException } from '@nestjs/common';
import { isString } from 'class-validator';

import { I18nService } from '@/components/i18n.service';
import { ErrorCode } from '@/constants/error-code';
import { ErrorMessageCode } from '@/constants/error-message-code';
import { ValidateError } from '@/exceptions/errors';
import { BaseError } from '@/exceptions/errors/base.error';
import { DatabaseError } from '@/exceptions/errors/database.error';

export class BaseController {
  protected i18n: I18nService;

  constructor(i18n: I18nService) {
    this.i18n = i18n;
  }

  /***
   *
   * @param error
   * @param lang
   */
  protected throwErrorProcess(error: unknown, lang: string = 'vi'): void {
    if (error instanceof BaseError) {
      throw new BadRequestException({
        message: this.i18n.lang(error.getMessage(), lang),
        errorCode: error.getErrorCode(),
        cause: error.getMessage(),
      });
    } else if (error instanceof TypeError) {
      // console.error(error)
      throw new ValidateError(
        this.i18n.lang(ErrorMessageCode.SYNTAX_ERROR, lang),
        ErrorCode.SYNTAX_ERROR,
        error,
      );
    } else if (error instanceof HttpException) {
      const response = error.getResponse() as Record<string, unknown>;
      if (isString(response)) {
        throw new BadRequestException(
          {
            message: this.i18n.lang(
              (response.message as string) || 'Unknown error',
            ),
            errorCode: (response.errorCode as number) || ErrorCode.UNKNOWN,
          },
          { cause: error as Error },
        );
      }

      throw new BadRequestException(
        {
          message: this.i18n.lang(
            (response.message as string) || 'Unknown error',
          ),
          errorCode: (response.errorCode as number) || ErrorCode.UNKNOWN,
        },
        { cause: error as Error },
      );
    }

    throw new DatabaseError(
      (error as Error).message,
      // this.i18n.lang(ErrorMessageCode.DATABASE_ERROR, lang),
      ErrorCode.DATABASE_ERROR,
      error as Error,
    );
  }
}
