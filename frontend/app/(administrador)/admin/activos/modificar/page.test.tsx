import { render, screen } from '@testing-library/react';
import ModificarPage from './page';

jest.mock('@/components/ModificarActivo', () =>
  jest.fn(() => <div data-testid="modificar-activo">ModificarActivo</div>)
);

describe('ModificarPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza ModificarActivo correctamente', () => {
    render(<ModificarPage />);

    expect(screen.getByTestId('modificar-activo')).toBeInTheDocument();
  });
});
