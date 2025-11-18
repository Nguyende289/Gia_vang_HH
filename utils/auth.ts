
import { User } from '../types';

const USERS_KEY = 'hoso_users';

// Seed the admin account if no users exist
export const initAuth = () => {
  const storedUsers = localStorage.getItem(USERS_KEY);
  if (!storedUsers) {
    const adminUser: User = {
      id: 'admin-01',
      username: 'admin',
      password: 'Garu@289',
      fullName: 'Quản trị viên',
      role: 'admin',
      area: 'Trung tâm',
      createdAt: Date.now()
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
  }
};

export const login = (username: string, password: string): User | null => {
  const storedUsers = localStorage.getItem(USERS_KEY);
  if (!storedUsers) return null;

  const users: User[] = JSON.parse(storedUsers);
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Return user without password for state security
    const { password, ...safeUser } = user;
    return safeUser as User;
  }
  return null;
};

export const createUser = (
  fullName: string, 
  username: string, 
  phoneNumber: string, 
  area: string,
  password?: string
): { success: boolean; message?: string } => {
  const storedUsers = localStorage.getItem(USERS_KEY);
  const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

  if (users.some(u => u.username === username)) {
    return { success: false, message: 'Tên đăng nhập đã tồn tại' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password: password || 'abc123@', // Default password as requested
    fullName,
    phoneNumber,
    area,
    role: 'staff',
    createdAt: Date.now()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
};

export const getUsers = (): User[] => {
  const storedUsers = localStorage.getItem(USERS_KEY);
  if (!storedUsers) return [];
  const users: User[] = JSON.parse(storedUsers);
  // Remove passwords from listing
  return users.map(({ password, ...u }) => u as User);
};
