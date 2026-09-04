import type {Scalar} from '@op-engineering/op-sqlite';
import {Note} from '../types/Note';
import {getDb} from './db';

export type NoteDraft = {
  title: string;
  text: string;
};

function rowToNote(row: Record<string, Scalar>): Note {
  return {
    id: Number(row.id),
    title: String(row.title ?? ''),
    text: String(row.text ?? ''),
    createdAt: String(row.createdAt ?? ''),
    updatedAt: String(row.updatedAt ?? ''),
  };
}

export async function getAllNotes(): Promise<Note[]> {
  const {rows} = await getDb().execute(
    'SELECT id, title, text, createdAt, updatedAt FROM notes ORDER BY datetime(updatedAt) DESC',
  );
  return rows.map(rowToNote);
}

export async function getNoteById(id: number): Promise<Note | null> {
  const {rows} = await getDb().execute(
    'SELECT id, title, text, createdAt, updatedAt FROM notes WHERE id = ?',
    [id],
  );
  const row = rows[0];
  return row ? rowToNote(row) : null;
}

export async function createNote(draft: NoteDraft): Promise<Note> {
  const now = new Date().toISOString();
  const result = await getDb().execute(
    'INSERT INTO notes (title, text, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
    [draft.title, draft.text, now, now],
  );

  if (result.insertId == null) {
    throw new Error('Failed to insert note');
  }

  return {
    id: result.insertId,
    title: draft.title,
    text: draft.text,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateNote(
  id: number,
  draft: NoteDraft,
): Promise<Note | null> {
  const now = new Date().toISOString();
  await getDb().execute(
    'UPDATE notes SET title = ?, text = ?, updatedAt = ? WHERE id = ?',
    [draft.title, draft.text, now, id],
  );
  return getNoteById(id);
}

export async function deleteNote(id: number): Promise<void> {
  await getDb().execute('DELETE FROM notes WHERE id = ?', [id]);
}
