/**
 * IRepository Interface
 * Defines contract for data persistence operations
 */
export interface IRepository<T> {
  save(item: T): void;
  saveAll(items: T[]): void;
  getAll(): T[];
  getById(id: string): T | null;
  delete(id: string): void;
  deleteAll(): void;
}
