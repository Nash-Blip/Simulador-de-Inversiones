import { render, screen } from '@testing-library/react';
import FeaturesInicio from './FeaturesInicio';

describe('Componente FeaturesInicio', () => {
  it('debería renderizar el encabezado promocional del simulador', () => {
    render(<FeaturesInicio />);

    const heading = screen.getByRole('heading', { 
      name: /explora las herramientas del simulador/i 
    });
    expect(heading).toBeInTheDocument();
  });

  it('debería mostrar las tres características clave con sus respectivos títulos y textos descriptivos', () => {
    render(<FeaturesInicio />);

    expect(screen.getByRole('heading', { name: /proyecciones en tiempo real/i })).toBeInTheDocument();
    expect(screen.getByText(/calcula el crecimiento de tu dinero usando datos reales del mercado/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /optimización de portafolio/i })).toBeInTheDocument();
    expect(screen.getByText(/configura tu perfil de inversionista \(conservador, moderado o agresivo\)/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /entorno 100% seguro/i })).toBeInTheDocument();
    expect(screen.getByText(/practica tus estrategias financieras utilizando dinero ficticio/i)).toBeInTheDocument();
  });
});