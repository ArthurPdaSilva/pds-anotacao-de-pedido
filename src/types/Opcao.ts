type Opcao = {
  key: string;
  text: string;
  value: string;
};

const status: Opcao[] = [
  { key: 'a', text: 'Em andamento', value: 'andamento' },
  { key: 'e', text: 'Em aguardo', value: 'aguardo' },
  { key: 'p', text: 'Problema no pagamento', value: 'problema ao pagar' },
  { key: 'f', text: 'Finalizado', value: 'finalizado' },
];

export default status;
