export type TypedException = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [httpCode: number]: { code: string; statusCode: number; entity: Function };
};

export type BaseErrorBody = {
  success: boolean;
  code: string;
  statusCode?: number;
  message: string;
  data?: any;
};

export type BaseToJSON = {
  code: string;
  statusCode?: number;
  message: string;
  err?: any;
};

export class Base extends Error {
  private _statusCodeBase: number;
  private _code: string;
  private _body: BaseErrorBody;
  private _returnStatusCodeInBody: boolean;
  private static typedExceptions: {
    [httpCode: number]: { code: string; statusCode: number; entity: any };
  };
  public readonly err?: any;

  constructor(
    message: string,
    code?: string,
    err?: any,
    statusCode?: number,
    returnStatusCodeInBody?: boolean,
  ) {
    super(message);
    this._code = code;
    this.err = err;
    this._statusCodeBase = statusCode;
    this._returnStatusCodeInBody = returnStatusCodeInBody;
  }

  private static getTypedExceptions(): {
    [httpCode: number]: { code: string; entity: any };
  } {
    if (!Base.typedExceptions) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
      const typedExceptions = require('./Exceptions');
      Base.typedExceptions = Object.keys(typedExceptions).reduce(
        (acc: TypedException, e: string) => {
          // saves the exception class in 'entity' property
          const entity = (<any>typedExceptions)[e];
          const statusCode = new entity().statusCode;
          acc[statusCode] = {
            // removing the word 'Exception' from each error name. Eg: 'InternalServerErrorExeption' to 'InternalServerError'
            code: e.slice(0, -9),
            statusCode: statusCode,
            entity,
          };

          return acc;
        },
        {},
      );
    }

    return Base.typedExceptions;
  }

  public get statusCodeBase(): number {
    return this._statusCodeBase || 500;
  }

  public get code(): string {
    if (!this._code) {
      const typedExceptions = Base.getTypedExceptions();
      this._code = typedExceptions[this.statusCodeBase]
        ? typedExceptions[this.statusCodeBase].code
        : 'InternalError';
    }
    return this._code;
  }

  public get body() {
    if (!this._body) {
      this._body = Object.assign(
        {
          success: false,
          code: this.code,
          message: this.message,
        },
        this.err ? { ...this.err } : null,
        this._returnStatusCodeInBody
          ? { statusCode: this.statusCodeBase }
          : null,
      );
    }

    return this._body;
  }

  public static fromHttpCode(
    httpCode: number,
    message: string,
    code?: string,
    err?: any,
    statusCodeInBody?: boolean,
  ): Base {
    const typedExceptions = Base.getTypedExceptions();

    // fetch a typedException based on http code
    if (Object.prototype.hasOwnProperty.call(typedExceptions, code)) {
      return new typedExceptions[httpCode].entity();
    }

    // else create and return a base exception
    const exception = new Base(message, code, err, httpCode, statusCodeInBody);
    if (typeof httpCode === 'number') {
      exception._statusCodeBase = httpCode;
    }
    return exception;
  }

  public toJSON(): BaseToJSON {
    return this.body;
  }
}
