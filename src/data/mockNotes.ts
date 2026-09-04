import {Note} from '../types/Note';

export const mockNotes: Note[] = [
  {
    id: 1,
    title: 'Shopping list',
    text: 'Milk, bread, eggs, coffee',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Meeting notes',
    text: 'Discuss Q3 roadmap and assign owners for mobile tasks.',
    createdAt: '2026-09-02T14:30:00.000Z',
    updatedAt: '2026-09-03T09:15:00.000Z',
  },
  {
    id: 3,
    title: 'Ideas',
    text: 'Add dark mode, search by title, pin favorite notes.',
    createdAt: '2026-09-03T18:45:00.000Z',
    updatedAt: '2026-09-03T18:45:00.000Z',
  },
  {
    id: 4,
    title: 'Reminders',
    text: 'Call dentist. Pay internet bill. Backup project repo.',
    createdAt: '2026-09-04T08:00:00.000Z',
    updatedAt: '2026-09-04T08:20:00.000Z',
  },
];
