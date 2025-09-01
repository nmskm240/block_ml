export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User not found. :id ${userId}`);
  }
}
