import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroPrincipal from './HeroPrincipal';

describe('Componente HeroPrincipal', () => {
  it('debería renderizar correctamente el título principal y subtítulos de marketing', () => {
    render(<HeroPrincipal />);

    expect(screen.getByRole('heading', { level: 1, name: /simulador de inversiones/i })).toBeInTheDocument();

    expect(screen.getByText(/entrenamiento financiero/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2, name: /operá mercados en tiempo real/i })).toBeInTheDocument();
  });

  it('debería renderizar el párrafo descriptivo sobre trading y dinero ficticio', () => {
    render(<HeroPrincipal />);

    const parrafo = screen.getByText(/poné a prueba tus estrategias de trading/i);
    expect(parrafo).toBeInTheDocument();
    expect(parrafo).toHaveTextContent(/acciones de wall street/i);
  });

  it('debería incluir la imagen de portada con la URL correcta de Unsplash', () => {
    const { container } = render(<HeroPrincipal />);

    const imagen = container.querySelector('img');
    
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute('src', expect.stringContaining('images.unsplash.com'));
  });
});