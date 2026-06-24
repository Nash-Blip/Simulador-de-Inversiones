import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GestionFondos from './GestionFondos';

// 1. Cambiamos el alias @/ por la ruta relativa real
import { getPortafolio, ingresarFondosTransferencia, retirarFondos } from '../service/Inversor.service';

// 2. Mockeamos usando la misma ruta relativa exacta
jest.mock('../service/Inversor.service', () => ({
  getPortafolio: jest.fn(),
  ingresarFondosTransferencia: jest.fn(),
  ingresarFondosTarjeta: jest.fn(),
  retirarFondos: jest.fn(),
}));

// ... (Todo el resto del test queda exactamente igual)

describe('Componente GestionFondos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock para el saldo inicial
    (getPortafolio as jest.Mock).mockResolvedValue({ saldoVirtual: 50000 });
  });

  it('debería cargar y mostrar el saldo virtual del inversor al renderizar', async () => {
    render(<GestionFondos />);

    expect(screen.getByText(/cargando saldo\.\.\./i)).toBeInTheDocument();

    // Esperamos a que se resuelva el fetch del saldo formateado (es-AR)
    await waitFor(() => {
      expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument();
    });
  });

  it('debería cambiar entre pestañas modificando los inputs del formulario', async () => {
    render(<GestionFondos />);
    
    await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

    // Cambiamos a la pestaña de Tarjeta
    const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
    fireEvent.click(botonTarjeta);

    // Buscamos los inputs directamente por sus placeholders únicos
    expect(screen.getByPlaceholderText('4517640011223344')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('•••')).toBeInTheDocument();
  });

  it('debería mostrar un error de validación si el CBU tiene un formato incorrecto', async () => {
    render(<GestionFondos />);
    await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

    // Completamos datos erróneos de transferencia
    const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
    const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
    const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
    const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

    fireEvent.change(inputMonto, { target: { value: '1500' } });
    fireEvent.change(inputCbu, { target: { value: '1234' } }); // CBU corto (invalido)
    fireEvent.change(inputTitular, { target: { value: 'Juan Perez' } });

    fireEvent.click(botonSubmit);

    // Esperamos el mensaje de error de tu validador
    expect(await screen.findByText(/cbu inválido\. deben ser exactamente 22 dígitos numéricos\./i)).toBeInTheDocument();
    expect(ingresarFondosTransferencia).not.toHaveBeenCalled();
  });

  it('debería procesar con éxito un ingreso por transferencia válido', async () => {
    (ingresarFondosTransferencia as jest.Mock).mockResolvedValue({});
    render(<GestionFondos />);
    await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

    const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
    const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
    const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
    const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

    fireEvent.change(inputMonto, { target: { value: '10000' } });
    fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
    fireEvent.change(inputTitular, { target: { value: 'Carlos Gardel' } });

    fireEvent.click(botonSubmit);

    await waitFor(() => {
      expect(screen.getByText(/¡operación procesada con éxito!/i)).toBeInTheDocument();
    });

    expect(ingresarFondosTransferencia).toHaveBeenCalledWith(10000, '1234567890123456789012', 'Carlos Gardel');
  });

  it('debería impedir un retiro si el monto supera al saldo disponible', async () => {
    render(<GestionFondos />);
    await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

    // Cambiamos a la pestaña de Retiro
    const botonRetirar = screen.getByRole('button', { name: /retirar fondos/i });
    fireEvent.click(botonRetirar);

    const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
    const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
    const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
    const botonSubmit = screen.getByRole('button', { name: /confirmar retiro/i });

    fireEvent.change(inputMonto, { target: { value: '60000' } }); // Mayor a los 50k mockeados
    fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
    fireEvent.change(inputTitular, { target: { value: 'Carlos Gardel' } });

    fireEvent.click(botonSubmit);

    expect(await screen.findByText(/fondos insuficientes para realizar este retiro\./i)).toBeInTheDocument();
    expect(retirarFondos).not.toHaveBeenCalled();
  });
});