import { Repository } from 'typeorm';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user || !(await user.validatePassword(password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new AppError(401, 'Account is deactivated');
    }

    const jwtSecret: Secret = process.env.JWT_SECRET as Secret;
    const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
} 