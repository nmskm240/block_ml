export class UserAlreadySignUpEmailError extends Error {
  constructor(email: string) {
    super(`Already sign up. Email: ${email}`);
  }
}
