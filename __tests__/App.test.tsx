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
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
