import { render, screen } from '@testing-library/react';
import Privacidad from './page';

describe('Privacidad', () => {
  it('muestra el título y secciones principales', () => {
    render(<Privacidad />);

    expect(screen.getByText('Política de Privacidad')).toBeInTheDocument();
    expect(screen.getByText('1. Información que Recopilamos')).toBeInTheDocument();
    expect(screen.getByText('2. Uso de la Información')).toBeInTheDocument();
    expect(screen.getByText('3. Seguridad de los Datos')).toBeInTheDocument();
    expect(screen.getByText('4. Uso de Cookies')).toBeInTheDocument();
    expect(screen.getByText('5. Derechos del Usuario (Acceso, Rectificación y Eliminación)')).toBeInTheDocument();
    expect(screen.getByText('6. Contacto')).toBeInTheDocument();
  });
});
