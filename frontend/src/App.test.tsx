import { render } from '@testing-library/react';
import App from './App';
import { QueryProvider } from './shared/lib/query';

test('renders App without crashing', () => {
  const { container } = render(
    <QueryProvider>
      <App />
    </QueryProvider>,
  );
  expect(container).toBeTruthy();
});
