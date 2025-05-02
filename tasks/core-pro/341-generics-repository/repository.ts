import { DataAccess } from './DataAccess.ts';

interface Identifiable {
  id?: number;
}

export interface User extends Identifiable {
  name: string;
  email: string;
}

export interface Product extends Identifiable {
  name: string;
  price: number;
}

export class Repository<T extends Identifiable> {
  private dataAccess: DataAccess;
  private tableName: string;

  constructor(dataAccess: DataAccess, tableName: string) {
    this.dataAccess = dataAccess;
    this.tableName = tableName;
  }

  async getById(id: number) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const values = [id];
    const res = await this.dataAccess.query<T>(query, values);
    return res.rows[0];
  }

  async getAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    const res = await this.dataAccess.query<T>(query);
    return res.rows;
  }

  async insert(item: T): Promise<T> {
    const columns = Object.keys(item).filter((key) => key !== 'id');
    const values = columns.map((_, i) => `$${i + 1}`);
    const placeholders = columns.map((col) => (item as any)[col]);
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${values.join(', ')})
      RETURNING *
    `;
    const res = await this.dataAccess.query<T>(query, placeholders);
    return res.rows[0];
  }
}
