import { join } from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { getCompilerDiagnostics } from '../../../utils/ts-utils.ts';
import { MockDataAccess } from './DataAccess.ts';
import { Product, Repository, User } from './repository.ts';

describe('Data Access Layer Tests', () => {
  let dataAccess: MockDataAccess;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;

  beforeEach(() => {
    dataAccess = new MockDataAccess();
    userRepository = new Repository<User>(dataAccess, 'users');
    productRepository = new Repository<Product>(dataAccess, 'products');
  });

  it('should compile without errors', () => {
    const diagnostics = getCompilerDiagnostics(join(__dirname, 'repository.ts'));
    expect(diagnostics).toConfirmCompilation();
  });

  describe('UserRepository Tests', () => {
    it('should insert a new user', async () => {
      const user = await userRepository.insert({
        name: 'Alice',
        email: 'alice@example.com',
      });
      console.log('🚀 ~ it ~ user:', user);
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
    });

    it('should get a user by id', async () => {
      const newUser = await userRepository.insert({
        name: 'Bob',
        email: 'bob@example.com',
      });
      const user = await userRepository.getById(newUser.id!);
      expect(user).toEqual(newUser);
    });

    it('should get all users', async () => {
      await userRepository.insert({ name: 'Charlie', email: 'charlie@example.com' });
      await userRepository.insert({ name: 'Dana', email: 'dana@example.com' });
      const users = await userRepository.getAll();
      expect(users.length).toBe(2);
    });
  });

  describe('ProductRepository Tests', () => {
    it('should insert a new product', async () => {
      const product = await productRepository.insert({ name: 'Laptop', price: 1500 });
      expect(product).toHaveProperty('id');
      expect(product.name).toBe('Laptop');
      expect(product.price).toBe(1500);
    });

    it('should get a product by id', async () => {
      const newProduct = await productRepository.insert({
        name: 'Phone',
        price: 800,
      });
      const product = await productRepository.getById(newProduct.id!);
      expect(product).toEqual(newProduct);
    });

    it('should get all products', async () => {
      await productRepository.insert({ name: 'Tablet', price: 300 });
      await productRepository.insert({ name: 'Monitor', price: 200 });
      const products = await productRepository.getAll();
      expect(products.length).toBe(2);
    });
  });
});
