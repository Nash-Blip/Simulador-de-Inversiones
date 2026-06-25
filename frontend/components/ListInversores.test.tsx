import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListInversores from './ListInversores';
import { getInversores } from '../service/ListInversores.service';

jest.mock('../service/ListInversores.service', () => ({
  getInversores: jest.fn(),
}));

describe('Componente ListInversores', () => {
  const mockInversores = [
    { id: 1, nombre: 'Carlos Perez', email: 'carlos@test.com', rol: 'admin' },
    { id: 2, nombre: 'Ana Gomez', email: 'ana@test.com', rol: 'user' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar el spinner o texto de carga al inicializar', () => {
    (getInversores as jest.Mock).mockReturnValue(new Promise(() => {}));
    
    render(<ListInversores />);
    expect(screen.getByText(/cargando\.\.\./i)).toBeInTheDocument();
  });

  it('debería renderizar la tabla con los datos de los inversores correctamente', async () => {
    (getInversores as jest.Mock).mockResolvedValue(mockInversores);
    
    render(<ListInversores />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { level: 1, name: /listado de inversores/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Nombre' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Rol' })).toBeInTheDocument();

    expect(screen.getByText('Carlos Perez')).toBeInTheDocument();
    expect(screen.getByText('carlos@test.com')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();

    expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
    expect(screen.getByText('ana@test.com')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('debería mostrar el mensaje correspondiente si la lista viene vacía', async () => {
    (getInversores as jest.Mock).mockResolvedValue([]);
    
    render(<ListInversores />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/no hay inversores registrados\./i)).toBeInTheDocument();
  });

  it('debería capturar el error de la API silenciosamente si el servicio falla', async () => {
    (getInversores as jest.Mock).mockRejectedValue(new Error('Conexion rechazada'));
    const spyConsole = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ListInversores />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/no hay inversores registrados\./i)).toBeInTheDocument();
    expect(spyConsole).toHaveBeenCalled();
    
    spyConsole.mockRestore();
  });
});