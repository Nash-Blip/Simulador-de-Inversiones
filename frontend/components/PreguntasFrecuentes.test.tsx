import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PreguntasFrecuentes from './PreguntasFrecuentes';

describe('Componente PreguntasFrecuentes', () => {
  it('debería renderizar el titulo principal', () => {
    render(<PreguntasFrecuentes />);

    expect(screen.getByRole('heading', { level: 1, name: /faq - preguntas frecuentes/i })).toBeInTheDocument();
  });

  it('debería renderizar las 6 preguntas frecuentes', () => {
    render(<PreguntasFrecuentes />);

    expect(screen.getByText(/cuales son los costos/i)).toBeInTheDocument();
    expect(screen.getByText(/puedo operar sin tener experiencia/i)).toBeInTheDocument();
    expect(screen.getByText(/necesito cumplir algun requisito/i)).toBeInTheDocument();
    expect(screen.getByText(/que instrumentos se pueden operar/i)).toBeInTheDocument();
    expect(screen.getByText(/puedo ingresar dinero/i)).toBeInTheDocument();
    expect(screen.getByText(/hay algun registro de mis operaciones/i)).toBeInTheDocument();
  });

  it('debería renderizar las respuestas de cada pregunta', () => {
    render(<PreguntasFrecuentes />);

    expect(screen.getByText(/no hay ningun tipo de costos/i)).toBeInTheDocument();
    expect(screen.getByText(/herramienta de aprendizaje/i)).toBeInTheDocument();
    expect(screen.getByText(/mayores de 18 años/i)).toBeInTheDocument();
    expect(screen.getByText(/acciones de empresas nacionales e internacionales/i)).toBeInTheDocument();
    expect(screen.getByText(/ingresar dinero ficticio/i)).toBeInTheDocument();
    expect(screen.getByText(/seccion de "transacciones"/i)).toBeInTheDocument();
  });
});
