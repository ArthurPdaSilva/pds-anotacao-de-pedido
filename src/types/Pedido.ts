import Cliente from './Cliente';
import Produto from './Produto';

type Pedido = {
  id: string;
  cliente: Cliente;
  dataPedido: string;
  compras: Produto[];
  total: number;
  entrega: string;
  statusPedido: string;
};

export default Pedido;
