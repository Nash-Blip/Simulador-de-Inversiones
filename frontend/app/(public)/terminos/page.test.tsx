import { render, screen } from '@testing-library/react';
import Terminos from './page';

describe('Terminos', () => {
  it('muestra el título y secciones principales', () => {
    render(<Terminos />);

    expect(screen.getByText('Términos y Condiciones de Servicio')).toBeInTheDocument();
    expect(screen.getByText('1. Aceptación de los Términos')).toBeInTheDocument();
    expect(screen.getByText('2. EXENCIÓN DE RESPONSABILIDAD FINANCIERA (AVISO IMPORTANTE)')).toBeInTheDocument();
    expect(screen.getByText('3. Registro y Seguridad de la Cuenta')).toBeInTheDocument();
    expect(screen.getByText('4. Propiedad Intelectual')).toBeInTheDocument();
    expect(screen.getByText('5. Modificaciones del Servicio y de los Términos')).toBeInTheDocument();
    expect(screen.getByText('6. Limitación de Responsabilidad')).toBeInTheDocument();
  });
});
