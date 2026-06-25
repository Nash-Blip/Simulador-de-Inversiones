import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GraficoActivo from './GraficoActivo';
import { getActivoById } from '../service/Activo.service';

jest.mock('../service/Activo.service', () => ({
  getActivoById: jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart">Gráfico de Línea Renderizado</div>,
}));

describe('Componente GraficoActivo', () => {
  const propsDefecto = {
    id: 1,
    ticker: 'AL30',
    precioActual: 1200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar el estado de carga al inicializar', () => {
    (getActivoById as jest.Mock).mockReturnValue(new Promise(() => {}));
    
    render(<GraficoActivo {...propsDefecto} />);

    expect(screen.getByText(/cargando historial\.\.\./i)).toBeInTheDocument();
  });

  it('debería renderizar el gráfico correctamente tras resolver la data del backend', async () => {
    (getActivoById as jest.Mock).mockResolvedValue({
      transacciones: [
        { precioEjecutado: 2000, cantidad: 2 },
        { precioEjecutado: 3300, cantidad: 3 },
      ],
    });

    render(<GraficoActivo {...propsDefecto} />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando historial\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    expect(getActivoById).toHaveBeenCalledWith(1);
  });

  it('debería usar el precio actual como fallback si el backend falla o viene vacío', async () => {

    (getActivoById as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const spyConsole = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<GraficoActivo {...propsDefecto} />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando historial\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    
    spyConsole.mockRestore();
  });
});