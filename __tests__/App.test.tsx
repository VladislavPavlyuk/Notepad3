/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/database/db', () => ({
  initDatabase: jest.fn(async () => undefined),
}));

jest.mock('../src/database/notesRepository', () => ({
  getAllNotes: jest.fn(async () => []),
  createNote: jest.fn(async () => undefined),
}));

jest.mock('../src/database/notesTransfer', () => ({
  exportNotesToJson: jest.fn(async () => false),
  importNotesFromJson: jest.fn(async () => null),
}));

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
