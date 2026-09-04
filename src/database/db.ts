import {open, type DB} from '@op-engineering/op-sqlite';
import {mockNotes} from '../data/mockNotes';

const DB_NAME = 'notepad.db';

let db: DB | null = null;

export function getDb(): DB {
  if (!db) {
    db = open({name: DB_NAME});
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = getDb();

  await database.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      text TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  const {rows} = await database.execute(
    'SELECT COUNT(*) AS count FROM notes',
  );
  const count = Number(rows[0]?.count ?? 0);

  if (count === 0) {
    for (const note of mockNotes) {
      await database.execute(
        `INSERT INTO notes (id, title, text, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?)`,
        [note.id, note.title, note.text, note.createdAt, note.updatedAt],
      );
    }
  }
}
