import { describe, it, expect } from 'vitest';
import { 
  signupSchema, 
  loginSchema, 
  communityPostSchema,
  commentSchema 
} from '../lib/validations';

describe('Signup Schema', () => {
  it('should validate correct data', () => {
    const valid = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
    };
    
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalid = {
      name: 'John',
      email: 'notanemail',
      password: 'SecurePass123',
    };
    
    expect(signupSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject short password', () => {
    const invalid = {
      name: 'John',
      email: 'john@example.com',
      password: 'short',
    };
    
    expect(signupSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('Login Schema', () => {
  it('should validate correct data', () => {
    const valid = {
      email: 'john@example.com',
      password: 'password123',
    };
    
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalid = {
      email: 'notanemail',
      password: 'password123',
    };
    
    expect(loginSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('Community Post Schema', () => {
  it('should validate correct post', () => {
    const valid = {
      content: 'This is a valid post',
    };
    
    expect(communityPostSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty content', () => {
    const invalid = {
      content: '',
    };
    
    expect(communityPostSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject too long content', () => {
    const invalid = {
      content: 'a'.repeat(1001),
    };
    
    expect(communityPostSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('Comment Schema', () => {
  it('should validate correct comment', () => {
    const valid = {
      content: 'Valid comment',
    };
    
    expect(commentSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty comment', () => {
    const invalid = {
      content: '',
    };
    
    expect(commentSchema.safeParse(invalid).success).toBe(false);
  });
});
