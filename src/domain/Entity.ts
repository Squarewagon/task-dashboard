/**
 * Base Entity Class
 * Provides common functionality for all domain entities
 */
export abstract class Entity {
  protected id: string;
  protected createdAt: Date;
  protected updatedAt: Date;

  constructor(id?: string) {
    this.id = id || this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  protected generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }
}
