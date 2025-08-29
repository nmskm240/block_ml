export interface IUserStorage {
  uploadUserIcon(userId: string, file: File): Promise<string>;
}
