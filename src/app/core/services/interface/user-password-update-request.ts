export interface UserPasswordUpdateRequest {
  userId: string;
  newPassword: string;
  oldPassword: string;
}
