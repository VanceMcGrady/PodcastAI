import { users, type User, type InsertUser, podcasts, type Podcast, type InsertPodcast } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPodcast(id: number): Promise<Podcast | undefined>;
  getAllPodcasts(): Promise<Podcast[]>;
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private podcasts: Map<number, Podcast>;
  private userCurrentId: number;
  private podcastCurrentId: number;

  constructor() {
    this.users = new Map();
    this.podcasts = new Map();
    this.userCurrentId = 1;
    this.podcastCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPodcast(id: number): Promise<Podcast | undefined> {
    return this.podcasts.get(id);
  }

  async getAllPodcasts(): Promise<Podcast[]> {
    return Array.from(this.podcasts.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async createPodcast(insertPodcast: InsertPodcast): Promise<Podcast> {
    const id = this.podcastCurrentId++;
    const podcast: Podcast = { 
      ...insertPodcast, 
      id, 
      createdAt: new Date() 
    };
    this.podcasts.set(id, podcast);
    return podcast;
  }
}

export const storage = new MemStorage();
