import { AuthService } from '../../services/authService';

export const auth = {
  async signUp(_, args) {
    return AuthService.signUp({ ...args });
  },
  async login(_, args) {
    return AuthService.login({ ...args });
  },
  
};
