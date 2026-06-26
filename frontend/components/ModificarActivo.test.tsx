import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModificarActivoPage from './ModificarActivo';
import { getActivo, ModificarActivo } from '../service/Activo.service';

jest.mock('../service/Activo.service', () => ({
  getActivo: jest.fn(),
  ModificarActivo: jest.fn(),
}));

const mockActivos = [
  {
    id: 1,
    ticker: 'AAPL',
    nombre: 'Apple Inc.',
    precioActual: 150,
  },
  {
    id: 2,
    ticker: 'TSLA',
    nombre: 'Tesla Motors',
    precioActual: 200,
  },
];

describe('ModificarActivoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el título y carga los activos', async () => {
    (getActivo as jest.Mock).mockResolvedValue(mockActivos);

    render(<ModificarActivoPage />);

    expect(
      screen.getByRole('heading', { name: /modificar activo/i })
    ).toBeInTheDocument();

    expect(await screen.findByText(/aapl/i)).toBeInTheDocument();
    expect(await screen.findByText(/tsla/i)).toBeInTheDocument();

    expect(getActivo).toHaveBeenCalledTimes(1);
  });

  test('muestra el formulario al seleccionar un activo', async () => {
    (getActivo as jest.Mock).mockResolvedValue(mockActivos);

    const user = userEvent.setup();

    render(<ModificarActivoPage />);

    const select = await screen.findByRole('combobox');

    await waitFor(() => {
      expect(screen.getByText(/aapl/i)).toBeInTheDocument();
    });

    await user.selectOptions(select, '1');

    const inputs = await screen.findAllByRole('textbox');

    expect(inputs[0]).toHaveValue('Apple Inc.');
    expect(inputs[1]).toHaveValue('AAPL');

    expect(
      screen.getByRole('button', { name: /modificar activo/i })
    ).toBeInTheDocument();
  });

  test('modifica un activo correctamente', async () => {
    (getActivo as jest.Mock)
      .mockResolvedValueOnce(mockActivos)
      .mockResolvedValueOnce([
        {
          id: 1,
          ticker: 'AAPL_MOD',
          nombre: 'Apple Modificado',
          precioActual: 150,
        },
        {
          id: 2,
          ticker: 'TSLA',
          nombre: 'Tesla Motors',
          precioActual: 200,
        },
      ]);

    (ModificarActivo as jest.Mock).mockResolvedValue({});

    const user = userEvent.setup();

    render(<ModificarActivoPage />);

    const select = await screen.findByRole('combobox');

    await waitFor(() => {
    expect(
        screen.getByRole('option', {
        name: /apple inc/i,
        })
    ).toBeInTheDocument();
    });

    await user.selectOptions(select, '1');

    const inputs = await screen.findAllByRole('textbox');

    await user.clear(inputs[0]);
    await user.type(inputs[0], 'Apple Modificado');

    await user.clear(inputs[1]);
    await user.type(inputs[1], 'AAPL_MOD');

    await user.click(
      screen.getByRole('button', {
        name: /modificar activo/i,
      })
    );

    await waitFor(() => {
      expect(ModificarActivo).toHaveBeenCalledWith(
        1,
        'Apple Modificado',
        'AAPL_MOD'
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/aapl_mod/i)).toBeInTheDocument();
    });
    expect(getActivo).toHaveBeenCalledTimes(2);
  });

  test('muestra mensaje de error cuando falla la modificación', async () => {
    (getActivo as jest.Mock).mockResolvedValue(mockActivos);

    (ModificarActivo as jest.Mock).mockRejectedValue(
      new Error('Error de conexión con el servidor')
    );

    const user = userEvent.setup();

    render(<ModificarActivoPage />);

    const select = await screen.findByRole('combobox');

    await waitFor(() => {
      expect(
        screen.getByRole('option', {
          name: /apple inc/i,
        })
      ).toBeInTheDocument();
    });

    await user.selectOptions(select, '1');

    await user.click(
      screen.getByRole('button', {
        name: /modificar activo/i,
      })
    );

    expect(
      await screen.findByText('Error de conexión con el servidor')
    ).toBeInTheDocument();
   });

  test('limpia el mensaje al seleccionar otro activo', async () => {
    (getActivo as jest.Mock).mockResolvedValue(mockActivos);

    (ModificarActivo as jest.Mock).mockRejectedValue(
      new Error('Error de conexión con el servidor')
    );

    const user = userEvent.setup();

    render(<ModificarActivoPage />);

    const select = await screen.findByRole('combobox');

    await waitFor(() => {
    expect(
        screen.getByRole('option', {
        name: /apple inc/i,
        })
    ).toBeInTheDocument();
    });

    await user.selectOptions(select, '1');

    await user.click(
      screen.getByRole('button', {
        name: /modificar activo/i,
      })
    );

    expect(
      await screen.findByText('Error de conexión con el servidor')
    ).toBeInTheDocument();

    await user.selectOptions(select, '2');

    expect(
      screen.queryByText('Error de conexión con el servidor')
    ).not.toBeInTheDocument();
  });
});