import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GestionFondos from './GestionFondos';

import { getPortafolio, ingresarFondosTransferencia, retirarFondos, ingresarFondosTarjeta } from '../service/Inversor.service';

jest.mock('../service/Inversor.service', () => ({
  getPortafolio: jest.fn(),
  ingresarFondosTransferencia: jest.fn(),
  ingresarFondosTarjeta: jest.fn(),
  retirarFondos: jest.fn(),
}));

describe('Componente GestionFondos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getPortafolio as jest.Mock).mockResolvedValue({ saldoVirtual: 50000 });
  });

  it('debería cargar y mostrar el saldo virtual del inversor al renderizar', async () => {
    render(<GestionFondos />);

    expect(screen.getByText(/cargando saldo\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument();
    });
  });

  it('debería cambiar entre pestañas modificando los inputs del formulario', async () => {
    render(<GestionFondos />);
    
    await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

    const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
    fireEvent.click(botonTarjeta);

    expect(screen.getByPlaceholderText('4517640011223344')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('•••')).toBeInTheDocument();
  });

  it('debería mostrar un error de validación si el CBU tiene un formato incorrecto', async () => {
    render(<GestionFondos />);
    await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

    const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
    const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
    const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
    const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

    fireEvent.change(inputMonto, { target: { value: '1500' } });
    fireEvent.change(inputCbu, { target: { value: '1234' } });
    fireEvent.change(inputTitular, { target: { value: 'Juan Perez' } });

    fireEvent.click(botonSubmit);

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

    const botonRetirar = screen.getByRole('button', { name: /retirar fondos/i });
    fireEvent.click(botonRetirar);

    const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
    const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
    const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
    const botonSubmit = screen.getByRole('button', { name: /confirmar retiro/i });

    fireEvent.change(inputMonto, { target: { value: '60000' } });
    fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
    fireEvent.change(inputTitular, { target: { value: 'Carlos Gardel' } });

    fireEvent.click(botonSubmit);

    expect(await screen.findByText(/fondos insuficientes para realizar este retiro\./i)).toBeInTheDocument();
    expect(retirarFondos).not.toHaveBeenCalled();
  });

  describe('Validaciones del formulario', () => {

    it('debería rechazar monto cero o negativo', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
      const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);

      fireEvent.change(inputMonto, { target: { value: '' } });
      fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
      fireEvent.change(inputTitular, { target: { value: 'Juan Perez' } });

      const formulario = screen.getByRole('button', { name: /confirmar ingreso/i }).closest('form')!;
      fireEvent.submit(formulario);

      expect(await screen.findByText(/el monto debe ser un número positivo\./i)).toBeInTheDocument();
      expect(ingresarFondosTransferencia).not.toHaveBeenCalled();
    });

    it('debería rechazar titular demasiado corto', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
      const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
      const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

      fireEvent.change(inputMonto, { target: { value: '1000' } });
      fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
      fireEvent.change(inputTitular, { target: { value: 'A' } });
      fireEvent.click(botonSubmit);

      expect(await screen.findByText(/nombre del titular inválido/i)).toBeInTheDocument();
      expect(ingresarFondosTransferencia).not.toHaveBeenCalled();
    });

    it('debería rechazar titular con números', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
      const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
      const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

      fireEvent.change(inputMonto, { target: { value: '1000' } });
      fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
      fireEvent.change(inputTitular, { target: { value: 'Juan 123' } });
      fireEvent.click(botonSubmit);

      expect(await screen.findByText(/nombre del titular inválido/i)).toBeInTheDocument();
    });
  });

  describe('Ingreso por tarjeta', () => {

    it('debería rechazar monto cero o negativo también en tarjeta', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputNumero = screen.getByPlaceholderText('4517640011223344');
      const inputVencimiento = screen.getByPlaceholderText('MM/AA');
      const inputCvv = screen.getByPlaceholderText('•••');

      fireEvent.change(inputMonto, { target: { value: '' } });
      fireEvent.change(inputNumero, { target: { value: '4517640011223344' } });

      for (let i = 0; i < 5; i++) {
        fireEvent.change(inputVencimiento, { target: { value: '12/28' } });
      }
      fireEvent.change(inputCvv, { target: { value: '123' } });

      const formulario = screen.getByRole('button', { name: /confirmar ingreso/i }).closest('form')!;
      fireEvent.submit(formulario);

      expect(await screen.findByText(/el monto debe ser un número positivo\./i)).toBeInTheDocument();
      expect(ingresarFondosTarjeta).not.toHaveBeenCalled();
    });

    it('debería rechazar número de tarjeta inválido (menos de 16 dígitos)', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputNumero = screen.getByPlaceholderText('4517640011223344');
      const inputVencimiento = screen.getByPlaceholderText('MM/AA');
      const inputCvv = screen.getByPlaceholderText('•••');
      const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

      fireEvent.change(inputMonto, { target: { value: '5000' } });
      fireEvent.change(inputNumero, { target: { value: '123456789012345' } });
      fireEvent.change(inputVencimiento, { target: { value: '12/28' } });
      fireEvent.change(inputCvv, { target: { value: '123' } });
      fireEvent.click(botonSubmit);

      expect(await screen.findByText(/número de tarjeta inválido\. deben ser 16 dígitos\./i)).toBeInTheDocument();
      expect(ingresarFondosTarjeta).not.toHaveBeenCalled();
    });

    it('debería rechazar formato de vencimiento inválido', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputNumero = screen.getByPlaceholderText('4517640011223344');
      const inputVencimiento = screen.getByPlaceholderText('MM/AA');
      const inputCvv = screen.getByPlaceholderText('•••');
      const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

      fireEvent.change(inputMonto, { target: { value: '5000' } });
      fireEvent.change(inputNumero, { target: { value: '4517640011223344' } });

      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputVencimiento, { target: { value: '99/99' } });
      }

      fireEvent.change(inputCvv, { target: { value: '123' } });
      fireEvent.click(botonSubmit);

      expect(await screen.findByText(/formato de vencimiento inválido\. use mm\/aa/i)).toBeInTheDocument();
      expect(ingresarFondosTarjeta).not.toHaveBeenCalled();
    });

    it('debería rechazar CVV inválido (menos de 3 dígitos)', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputNumero = screen.getByPlaceholderText('4517640011223344');
      const inputVencimiento = screen.getByPlaceholderText('MM/AA');
      const inputCvv = screen.getByPlaceholderText('•••');
      const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

      fireEvent.change(inputMonto, { target: { value: '5000' } });
      fireEvent.change(inputNumero, { target: { value: '4517640011223344' } });
      fireEvent.change(inputVencimiento, { target: { value: '12/28' } });
      fireEvent.change(inputCvv, { target: { value: '12' } });
      fireEvent.click(botonSubmit);

      expect(await screen.findByText(/código cvv inválido\. deben ser 3 o 4 dígitos\./i)).toBeInTheDocument();
      expect(ingresarFondosTarjeta).not.toHaveBeenCalled();
    });

    it('debería procesar ingreso por tarjeta exitosamente', async () => {
      (ingresarFondosTarjeta as jest.Mock).mockResolvedValue({});
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputNumero = screen.getByPlaceholderText('4517640011223344');
      const inputVencimiento = screen.getByPlaceholderText('MM/AA');
      const inputCvv = screen.getByPlaceholderText('•••');
      const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

      fireEvent.change(inputMonto, { target: { value: '2500' } });
      fireEvent.change(inputNumero, { target: { value: '4517640011223344' } });

      for (let i = 0; i < 5; i++) {
        fireEvent.change(inputVencimiento, { target: { value: '12/28' } });
      }
      fireEvent.change(inputCvv, { target: { value: '123' } });
      fireEvent.click(botonSubmit);

      await waitFor(() => {
        expect(screen.getByText(/¡operación procesada con éxito!/i)).toBeInTheDocument();
      });

      expect(ingresarFondosTarjeta).toHaveBeenCalledWith(2500, '4517640011223344', '123', '12/28');
    });
  });

  describe('Cambio de pestañas', () => {

    it('debería activar la pestaña Ingresar (Transf.) al hacer clic incluso si ya está visible', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonRetirar = screen.getByRole('button', { name: /retirar fondos/i });
      fireEvent.click(botonRetirar);

      const botonTransf = screen.getByRole('button', { name: /ingresar \(transf\.\)/i });
      fireEvent.click(botonTransf);

      expect(screen.getByPlaceholderText('0000000000000000000000')).toBeInTheDocument();
    });
  });

  describe('Retiro de fondos', () => {

    it('debería procesar un retiro exitosamente', async () => {
      (retirarFondos as jest.Mock).mockResolvedValue({});
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const botonRetirar = screen.getByRole('button', { name: /retirar fondos/i });
      fireEvent.click(botonRetirar);

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
      const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
      const botonSubmit = screen.getByRole('button', { name: /confirmar retiro/i });

      fireEvent.change(inputMonto, { target: { value: '5000' } });
      fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
      fireEvent.change(inputTitular, { target: { value: 'Carlos Gardel' } });
      fireEvent.click(botonSubmit);

      await waitFor(() => {
        expect(screen.getByText(/¡operación procesada con éxito!/i)).toBeInTheDocument();
      });

      expect(retirarFondos).toHaveBeenCalledWith(5000, '1234567890123456789012', 'Carlos Gardel');
    });
  });

  describe('Manejo de errores', () => {

    it('debería mostrar el error del servidor si la API falla en transferencia', async () => {
      (ingresarFondosTransferencia as jest.Mock).mockRejectedValue(new Error('CBU inexistente'));
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
      const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
      const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

      fireEvent.change(inputMonto, { target: { value: '1000' } });
      fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
      fireEvent.change(inputTitular, { target: { value: 'Juan Perez' } });
      fireEvent.click(botonSubmit);

      expect(await screen.findByText('CBU inexistente')).toBeInTheDocument();
    });

    it('debería mostrar error genérico si la API rechaza sin mensaje', async () => {
      (ingresarFondosTarjeta as jest.Mock).mockRejectedValue('string error');
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputNumero = screen.getByPlaceholderText('4517640011223344');
      const inputVencimiento = screen.getByPlaceholderText('MM/AA');
      const inputCvv = screen.getByPlaceholderText('•••');
      const botonSubmit = screen.getByRole('button', { name: /confirmar ingreso/i });

      fireEvent.change(inputMonto, { target: { value: '500' } });
      fireEvent.change(inputNumero, { target: { value: '4517640011223344' } });

      for (let i = 0; i < 5; i++) {
        fireEvent.change(inputVencimiento, { target: { value: '12/28' } });
      }
      fireEvent.change(inputCvv, { target: { value: '123' } });
      fireEvent.click(botonSubmit);

      expect(await screen.findByText(/error al procesar la transacción\./i)).toBeInTheDocument();
    });

    it('debería mostrar error del servidor si retirarFondos falla', async () => {
      (retirarFondos as jest.Mock).mockRejectedValue(new Error('Fondos congelados'));
      render(<GestionFondos />);
      await waitFor(() => expect(screen.getByText(/\$50\.000,00/)).toBeInTheDocument());

      const botonRetirar = screen.getByRole('button', { name: /retirar fondos/i });
      fireEvent.click(botonRetirar);

      const inputMonto = screen.getAllByPlaceholderText('0.00')[0];
      const inputCbu = screen.getByPlaceholderText('0000000000000000000000');
      const inputTitular = screen.getByPlaceholderText(/nombre completo del titular/i);
      const botonSubmit = screen.getByRole('button', { name: /confirmar retiro/i });

      fireEvent.change(inputMonto, { target: { value: '1000' } });
      fireEvent.change(inputCbu, { target: { value: '1234567890123456789012' } });
      fireEvent.change(inputTitular, { target: { value: 'Juan Perez' } });
      fireEvent.click(botonSubmit);

      expect(await screen.findByText('Fondos congelados')).toBeInTheDocument();
    });

    it('debería manejar error de conexión al obtener el saldo sin romper la UI', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (getPortafolio as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<GestionFondos />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      expect(screen.getByText(/cargando saldo\.\.\./i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirmar ingreso/i })).toBeDisabled();

      consoleSpy.mockRestore();
    });
  });

  describe('Restricciones de input', () => {

    it('handleTransfChange debería ignorar letras en CBU', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const inputCbu = screen.getByPlaceholderText('0000000000000000000000') as HTMLInputElement;
      fireEvent.change(inputCbu, { target: { value: 'abcd1234' } });

      expect(inputCbu.value).toBe('');
    });

    it('handleTarjetaChange debería ignorar letras en número de tarjeta', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputNumero = screen.getByPlaceholderText('4517640011223344') as HTMLInputElement;
      fireEvent.change(inputNumero, { target: { value: 'abcd' } });

      expect(inputNumero.value).toBe('');
    });

    it('handleTarjetaChange debería ignorar input si supera 16 dígitos en número de tarjeta', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputNumero = screen.getByPlaceholderText('4517640011223344') as HTMLInputElement;
      fireEvent.change(inputNumero, { target: { value: '12345678901234567890' } });

      expect(inputNumero.value).toBe('');
    });

    it('handleTarjetaChange debería ignorar letras en CVV', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputCvv = screen.getByPlaceholderText('•••') as HTMLInputElement;
      fireEvent.change(inputCvv, { target: { value: 'abc' } });

      expect(inputCvv.value).toBe('');
    });

    it('handleTarjetaChange debería ignorar input si supera 4 dígitos en CVV', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputCvv = screen.getByPlaceholderText('•••') as HTMLInputElement;
      fireEvent.change(inputCvv, { target: { value: '123456' } });

      expect(inputCvv.value).toBe('');
    });
  });

  describe('handleVencimientoChange', () => {

    it('debería auto-agregar "/" después de escribir 2 dígitos', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputVencimiento = screen.getByPlaceholderText('MM/AA') as HTMLInputElement;
      fireEvent.change(inputVencimiento, { target: { value: '12' } });

      expect(inputVencimiento.value).toBe('12/');
    });

    it('debería remover la "/" si el usuario borra el tercer carácter', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputVencimiento = screen.getByPlaceholderText('MM/AA') as HTMLInputElement;

      fireEvent.change(inputVencimiento, { target: { value: '1' } });
      fireEvent.change(inputVencimiento, { target: { value: '12' } });
      expect(inputVencimiento.value).toBe('12/');

      fireEvent.change(inputVencimiento, { target: { value: '12' } });
      expect(inputVencimiento.value).toBe('12/');
    });

    it('debería quitar la barra si el usuario escribe y borra hasta dejar "12/"', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputVencimiento = screen.getByPlaceholderText('MM/AA') as HTMLInputElement;

      fireEvent.change(inputVencimiento, { target: { value: '12/' } });

      expect(inputVencimiento.value).toBe('12');
    });

    it('debería ignorar si se superan los 5 caracteres', async () => {
      render(<GestionFondos />);
      await waitFor(() => expect(screen.queryByText(/cargando saldo\.\.\./i)).not.toBeInTheDocument());

      const botonTarjeta = screen.getByRole('button', { name: /ingresar \(tarjeta\)/i });
      fireEvent.click(botonTarjeta);

      const inputVencimiento = screen.getByPlaceholderText('MM/AA') as HTMLInputElement;
      fireEvent.change(inputVencimiento, { target: { value: '12/288' } });

      expect(inputVencimiento.value).toBe('');
    });
  });
});
