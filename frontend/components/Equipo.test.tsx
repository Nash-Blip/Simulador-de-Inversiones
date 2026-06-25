import { render, screen } from '@testing-library/react';
import Equipo from './Equipo';

describe('Componente Equipo', () => {
  it('debería renderizar el título principal y la descripción del proyecto', () => {
    render(<Equipo />);

    const titulo = screen.getByRole('heading', { name: /nosotros/i });
    expect(titulo).toBeInTheDocument();

    const descripcion = screen.getByText(/este simulador forma parte del proyecto de la materia programacion iii/i);
    expect(descripcion).toBeInTheDocument();
  });

  it('debería renderizar correctamente a los 5 integrantes del equipo con sus iniciales y rol', () => {
    render(<Equipo />);

    const integrantes = [
      { nombre: /agustin/i, apellido: /begue/i, iniciales: 'AB' },
      { nombre: /pablo/i, apellido: /duval/i, iniciales: 'PD' },
      { nombre: /matias/i, apellido: /fernandez/i, iniciales: 'MF' },
      { nombre: /ramiro/i, apellido: /gomez rivelli/i, iniciales: 'RG' },
      { nombre: /alejo/i, apellido: /suarez/i, iniciales: 'AS' },
    ];

    integrantes.forEach((integrante) => {
      expect(screen.getByText(integrante.nombre)).toBeInTheDocument();
      expect(screen.getByText(integrante.apellido)).toBeInTheDocument();
      
      expect(screen.getByText(integrante.iniciales)).toBeInTheDocument();
    });

    const roles = screen.getAllByText(/^developer$/i);
    expect(roles).toHaveLength(5);
  });
});