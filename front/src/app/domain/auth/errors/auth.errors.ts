export class InvalidCredentialsError extends Error {
  constructor(message: string = 'Invalid email or password.') {
    super(message);
  }
}

export class AuthServerError extends Error {
  constructor(message: string = 'Something went wrong. Please try again.') {
    super(message);
  }
}