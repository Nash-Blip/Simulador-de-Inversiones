import { render, screen } from '@testing-library/react';
import HomePage from './page';

jest.mock('@/components/HeroPrincipal', () =>
  jest.fn(() => <div data-testid="hero-principal">HeroPrincipal</div>)
);

jest.mock('@/components/FeaturesInicio', () =>
  jest.fn(() => <div data-testid="features-inicio">FeaturesInicio</div>)
);

jest.mock('@/components/HeroSecundario', () =>
  jest.fn(() => <div data-testid="hero-secundario">HeroSecundario</div>)
);

jest.mock('@/components/PreguntasFrecuentes', () =>
  jest.fn(() => <div data-testid="preguntas-frecuentes">PreguntasFrecuentes</div>)
);

jest.mock('@/components/Equipo', () =>
  jest.fn(() => <div data-testid="equipo">Equipo</div>)
);

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza los 5 componentes de la landing', () => {
    render(<HomePage />);

    expect(screen.getByTestId('hero-principal')).toBeInTheDocument();
    expect(screen.getByTestId('features-inicio')).toBeInTheDocument();
    expect(screen.getByTestId('hero-secundario')).toBeInTheDocument();
    expect(screen.getByTestId('preguntas-frecuentes')).toBeInTheDocument();
    expect(screen.getByTestId('equipo')).toBeInTheDocument();
  });
});
