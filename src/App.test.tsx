import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { MantineProvider } from '@mantine/core';


Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});


const mockLaunches = [
  {
    mission_name: 'Test Mission',
    details: 'Test Details',
    rocket: { rocket_name: 'Falcon 9' },
    links: { mission_patch_small: 'url', mission_patch: 'url' },
  },
];

//Это выражение на просторах инета увидела, не знаю правильное или нет
beforeAll(() => {
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(mockLaunches),
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

it('Renders without crashing', () => {
  render(
    <MantineProvider theme={{}}>
      <App />
    </MantineProvider>
  );
  const linkElement = screen.getByText(/SpaceX Launches 2020/i);
  expect(linkElement).toBeInTheDocument();
});

it('Opens the modal when "See more" button is clicked', async () => {
  render(
    <MantineProvider theme={{}}>
      <App />
    </MantineProvider>
  );
  await waitFor(() => {
    expect(screen.getByText(/Test Mission/i)).toBeInTheDocument();
  });


  const seeMoreButton = screen.getByText(/See more/i);


  fireEvent.click(seeMoreButton);

  
  await waitFor(() => {
    expect(screen.getByText(/Test Details/i)).toBeVisible();
  });
});

it('Closes the modal when clicking the close button', async () => {
  render(
    <MantineProvider theme={{}}>
      <App />
    </MantineProvider>
  );

  
  await waitFor(() => {
    expect(screen.getByText(/Test Mission/i)).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText(/See more/i));

  await waitFor(() => {
    expect(screen.getByText(/Test Details/i)).toBeVisible();
  });

  
  const closeButton = screen.getByText('✕');

 
  fireEvent.click(closeButton);

 
  await waitFor(() => {
    expect(screen.queryByText(/Test Details/i)).not.toBeInTheDocument();
  });
});
