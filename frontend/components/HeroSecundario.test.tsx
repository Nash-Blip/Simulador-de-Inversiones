import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSecundario from './HeroSecundario';

describe('Componente HeroSecundario', () => {
  it('debería renderizar los títulos de las secciones informativas', () => {
    render(<HeroSecundario />);

    expect(screen.getByRole('heading', { level: 3, name: /estrategia/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /indicadores/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /mercado cripto/i })).toBeInTheDocument();
  });

  it('debería renderizar los links externos con sus textos y atributos de seguridad correctos', () => {
    render(<HeroSecundario />);

    // 1. Enlace de Apple
    const linkApple = screen.getByRole('link', { name: /¿es momento de comprar cedears de apple\?/i });
    expect(linkApple).toBeInTheDocument();
    expect(linkApple).toHaveAttribute('href', expect.stringContaining('bloomberglinea.com'));
    expect(linkApple).toHaveAttribute('target', '_blank');
    expect(linkApple).toHaveAttribute('rel', 'noopener noreferrer');

    // 2. Enlace del RSI
    const linkRsi = screen.getByRole('link', { name: /guía práctica para usar el rsi/i });
    expect(linkRsi).toBeInTheDocument();
    expect(linkRsi).toHaveAttribute('href', expect.stringContaining('admiralmarkets.com'));
    expect(linkRsi).toHaveAttribute('target', '_blank');
    expect(linkRsi).toHaveAttribute('rel', 'noopener noreferrer');

    // 3. Enlace de Stablecoins
    const linkCripto = screen.getByRole('link', { name: /qué son las stablecoins/i });
    expect(linkCripto).toBeInTheDocument();
    expect(linkCripto).toHaveAttribute('href', expect.stringContaining('launchpad.ripio.com'));
    expect(linkCripto).toHaveAttribute('target', '_blank');
    expect(linkCripto).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('debería incluir la imagen lateral de Unsplash de forma segura', () => {
    const { container } = render(<HeroSecundario />);

    const imagen = container.querySelector('img');
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute('src', expect.stringContaining('images.unsplash.com'));
  });
});