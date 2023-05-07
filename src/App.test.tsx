import "fake-indexeddb/auto";
import fakeIndexedDB from "fake-indexeddb";
import React from 'react';

import { render, screen,act } from '@testing-library/react';
import App from './App';

jest.mock('./workers/WorkerCreator');

beforeEach(()=>{
    fakeIndexedDB.deleteDatabase('worker-demo-db');
})

test('Check that button to create a new user appears', async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(()=>render(<App />))
  const linkElement = screen.getByText(/create new user/i);
  expect(linkElement).toBeInTheDocument();
});
