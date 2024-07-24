
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {User} from '../entity/User'
import path from 'path';


export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database:  path.join(process.cwd(), 'data', 'database.sqlite'),
    synchronize: true,
    logging: false,
    entities: [
    User
    ],
  });

