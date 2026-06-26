import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Componente Footer', () => {
  it('debería renderizar el logo principal con redirección al inicio', () => {
    const { container } = render(<Footer />);

    const linkLogo = screen.getByRole('link', { name: '' }); 
    expect(linkLogo).toHaveAttribute('href', '/');
    
    const imgLogo = container.querySelector('img[src="/logo-simulador.png"]');
    expect(imgLogo).toBeInTheDocument();
  });

  it('debería contener los enlaces de navegación interna correctos', () => {
    render(<Footer />);

    const linkPrivacidad = screen.getByRole('link', { name: /privacidad/i });
    const linkTerminos = screen.getByRole('link', { name: /terminos y condiciones/i });
    const linkContacto = screen.getByRole('link', { name: /contacto/i });

    expect(linkPrivacidad).toHaveAttribute('href', '/privacidad');
    expect(linkTerminos).toHaveAttribute('href', '/terminos');
    expect(linkContacto).toHaveAttribute('href', '/contacto');
  });

  it('debería renderizar los links externos a las entidades financieras con seguridad', () => {

    const { container } = render(<Footer />);

    const linkByma = container.querySelector('a[href="https://www.byma.com.ar/"]');
    const linkCnv = container.querySelector('a[href="https://www.argentina.gob.ar/cnv"]');
    const linkRofex = container.querySelector('a[href="https://www.matbarofex.com.ar/"]');

    expect(linkByma).toBeInTheDocument();
    expect(linkCnv).toBeInTheDocument();
    expect(linkRofex).toBeInTheDocument();

    expect(linkByma).toHaveAttribute('target', '_blank');
    expect(linkByma).toHaveAttribute('rel', 'noopener noreferrer');

    expect(linkCnv).toHaveAttribute('target', '_blank');
    expect(linkCnv).toHaveAttribute('rel', 'noopener noreferrer');

    expect(linkRofex).toHaveAttribute('target', '_blank');
    expect(linkRofex).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('debería mostrar el texto de copyright actualizado', () => {
    render(<Footer />);

    const copyright = screen.getByText(/© copyright 2026 \| todos los derechos reservados\./i);
    expect(copyright).toBeInTheDocument();
  });
});