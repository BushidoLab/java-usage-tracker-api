import { AuthService } from '../../services/authService';

export const auth = {
  async userInfo(_, args) {
    return AuthService.userInfo({ ...args });
  },
};
