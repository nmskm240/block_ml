export type ServerActionResult =
  | {
      isSuccess: true;
      message: string;
    }
  | {
      isSuccess: false;
      error: {
        message: string;
      };
    };
