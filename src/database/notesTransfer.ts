import {
  createDocument,
  openDocument,
  readFile,
} from '@joplin/react-native-saf-x';
import {Platform} from 'react-native';
import {Note} from '../types/Note';
import {getAllNotes, replaceAllNotes} from './notesRepository';

function assertAndroid() {
  if (Platform.OS !== 'android') {
    throw new Error('File picker is only available on Android');
  }
}

function parseNotes(raw: string): Note[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('JSON must be an array of notes');
  }

  return parsed.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid note at index ${index}`);
    }

    const row = item as Record<string, unknown>;
    const id = Number(row.id);
    if (!Number.isFinite(id)) {
      throw new Error(`Invalid note id at index ${index}`);
    }

    return {
      id,
      title: String(row.title ?? ''),
      text: String(row.text ?? ''),
      createdAt: String(row.createdAt ?? ''),
      updatedAt: String(row.updatedAt ?? ''),
    };
  });
}

export async function exportNotesToJson(): Promise<boolean> {
  assertAndroid();
  const notes = await getAllNotes();
  const result = await createDocument(JSON.stringify(notes, null, 2), {
    encoding: 'utf8',
    initialName: 'notes.json',
    mimeType: 'application/json',
  });
  return result != null;
}

export async function importNotesFromJson(): Promise<Note[] | null> {
  assertAndroid();
  const docs = await openDocument({persist: false, multiple: false});
  const doc = Array.isArray(docs) ? docs[0] : docs;
  if (!doc?.uri) {
    return null;
  }

  const content = await readFile(doc.uri, {encoding: 'utf8'});
  const notes = parseNotes(content);
  await replaceAllNotes(notes);
  return getAllNotes();
}
