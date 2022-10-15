import React, { useState, useEffect, useCallback } from 'react';
import HeaderApp from '../../Components/Header';
import FooterApp from '../../Components/Footer';
import { toast } from 'react-toastify';
import { Header, Button, Form, Grid, List, Modal } from 'semantic-ui-react';
import Pedido from '../../types/Pedido';
import Produto from '../../types/Produto';
import Cliente from '../../types/Cliente';
import status from '../../types/Opcao';

export default function Home() {
  const [nomeProduto, setNomeProduto] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(1);
  const [clienteEscolhido, setClienteEscolhido] = useState('');
  const [statusEscolhido, setStatusEscolhido] = useState(status[0].value);
  const [data, setData] = useState('');
  const [total, setTotal] = useState(0);
  const [radio, setRadio] = useState('Domicílio');
  const [open, setOpen] = useState(false);
  const [selectPedido, setSelectPedido] = useState<Pedido>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const isPedido = localStorage.getItem('pedidos');
    const isCliente = localStorage.getItem('clientes');
    if (isPedido) setPedidos(JSON.parse(isPedido));
    if (isCliente) setClientes(JSON.parse(isCliente));
  }, [setPedidos, setClientes]);

  useEffect(() => {
    if (clientes.length > 0) setClienteEscolhido(clientes[0].nome);
    return;
  }, [clientes, setClienteEscolhido]);

  const handleModal = useCallback(
    (item: Pedido) => {
      setOpen(true);
      setSelectPedido(item);
    },
    [setSelectPedido],
  );

  const getCliente = useCallback(
    (nome: string) => {
      const c = clientes.filter((item) => item.nome === nome);
      return c[0];
    },
    [clientes],
  );

  const getTotal = (total: number, item: Produto) => {
    return total + item.preco * item.quantidade;
  };

  const handleDelete = useCallback(
    (i: string) => {
      const lista = pedidos.filter((item) => item.cliente.nome !== i);
      setPedidos(lista);
      localStorage.setItem('pedidos', JSON.stringify(lista));
    },
    [pedidos, setPedidos],
  );

  const handleAdd = useCallback(() => {
    if (nomeProduto.length === 0 || preco <= 0) {
      toast.error('Adicione produto e preço válido');
      return;
    }
    const lista = [
      ...produtos,
      { nome: nomeProduto, preco: preco, quantidade: quantidade },
    ];
    setProdutos(lista);
    setTotal(lista.reduce(getTotal, 0));
    setNomeProduto('');
    setPreco(0);
  }, [
    nomeProduto,
    preco,
    produtos,
    setProdutos,
    setNomeProduto,
    setPreco,
    setTotal,
  ]);

  const insertClient = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setClienteEscolhido(e.target.value);
    },
    [setClienteEscolhido],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const clienteEncontrado = getCliente(clienteEscolhido);
      e.preventDefault();
      const obj: Pedido = {
        cliente: clienteEncontrado,
        dataPedido: data,
        total: total,
        compras: produtos,
        entrega: radio,
        statusPedido: statusEscolhido,
      };

      const lista = [...pedidos, obj];

      localStorage.setItem('pedidos', JSON.stringify(lista));
      setPedidos(lista);
      setProdutos([]);
      setPreco(0);
      setTotal(0);
      toast.success('Cadastrado com sucesso!');
    },
    [
      clienteEscolhido,
      data,
      preco,
      radio,
      statusEscolhido,
      produtos,
      total,
      pedidos,
      setPedidos,
      setTotal,
      setProdutos,
      setPreco,
    ],
  );

  return (
    <div className="App">
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header>Pedido de {selectPedido?.cliente.nome}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Cliente: {selectPedido?.cliente.nome}</Header>
            <p>Endereço de entrega: {selectPedido?.cliente.endereco}</p>
            <p>Telefone: {selectPedido?.cliente.telefone}</p>
            Compras:
            <ul>
              {selectPedido?.compras.map((itens) => {
                return (
                  <li key={itens.nome}>
                    Nome: {itens.nome} || preço: R$ {itens.preco.toFixed(2)} ||
                    Quantidade: {itens.quantidade}
                  </li>
                );
              })}
            </ul>
            <p>Data do pedido: {selectPedido?.dataPedido}</p>
            <p>Status do pagamento do pedido: {selectPedido?.statusPedido}</p>
            <p>Tipo da entrega: {selectPedido?.entrega}</p>
            <p>Total: R$ {selectPedido?.total.toFixed(2)}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content="Fechar"
            labelPosition="right"
            icon="checkmark"
            onClick={() => setOpen(false)}
            positive
          />
        </Modal.Actions>
      </Modal>

      <HeaderApp />

      <Grid
        columns={2}
        relaxed="very"
        stackable
        style={{ padding: '10px', minHeight: '100vh' }}
      >
        <Grid.Column>
          <Header size="huge">Cadastro de Pedidos</Header>
          {clientes.length === 0 ? (
            <>
              <Header size="large">Verificando Clientes...</Header>
              <Header size="medium">
                Se não apareceu nada, cadastre algum cliente!
              </Header>
            </>
          ) : (
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Form.Field>
                <label>Escolha o Cliente</label>
                <select
                  placeholder="Clientes"
                  onChange={(e) => insertClient(e)}
                >
                  {clientes.map((item) => {
                    return (
                      <option key={item.nome} value={item.nome}>
                        {item.nome}
                      </option>
                    );
                  })}
                </select>
              </Form.Field>
              <Form.Select
                fluid
                label="Status do Pagamento"
                options={status}
                onChange={(e, data) => setStatusEscolhido(data.value as string)}
                placeholder="Status do pagamento"
              />
              <Form.Field>
                <label>Data do pedido</label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </Form.Field>
              <Form.Group inline>
                <label>Forma de entrega</label>
                <Form.Radio
                  label="Domicílio"
                  value="dm"
                  name="radioGroup"
                  checked={radio === 'Domicílio'}
                  onChange={() => setRadio('Domicílio')}
                />
                <Form.Radio
                  label="Pegar na loja"
                  value="pl"
                  name="radioGroup"
                  checked={radio === 'Pegar na loja'}
                  onChange={() => setRadio('Pegar na loja')}
                />
              </Form.Group>

              <Form.Group widths={'equal'}>
                <Form.Field required>
                  <label>Produto</label>
                  <input
                    placeholder="Nome do Produto"
                    value={nomeProduto}
                    onChange={(e) => setNomeProduto(e.target.value)}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Preço</label>
                  <input
                    placeholder="Preço do Produto"
                    value={preco}
                    type="number"
                    onChange={(e) => setPreco(Number(e.target.value))}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Quantidade</label>
                  <input
                    placeholder="Quantidade do Produto"
                    value={quantidade}
                    type="number"
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                  />
                </Form.Field>
                <Button type="button" color="teal" onClick={handleAdd}>
                  Adicionar na lista
                </Button>
              </Form.Group>

              <List divided verticalAlign="middle">
                {produtos.map((item) => {
                  return (
                    <List.Item key={item.nome}>
                      <List.Content>Nome: {item.nome}</List.Content>
                      <List.Content>
                        Preço Unitário: R$ {item.preco.toFixed(2)}
                      </List.Content>
                      <List.Content>
                        Quantidade: {item.quantidade.toFixed(2)}
                      </List.Content>
                    </List.Item>
                  );
                })}
              </List>
              <Header>Total: R$ {total.toFixed(2)}</Header>
              <Button color="teal" type="submit">
                Cadastrar
              </Button>
            </Form>
          )}
        </Grid.Column>

        <Grid.Column verticalAlign="top">
          <Header size="huge">Pedidos cadastrados</Header>
          <List divided verticalAlign="middle">
            {pedidos.map((item) => {
              return (
                <List.Item key={item.cliente.nome}>
                  <List.Content floated="right">
                    <Button color="green" onClick={() => handleModal(item)}>
                      VER
                    </Button>
                    <Button
                      color="red"
                      onClick={() => handleDelete(item.cliente.nome)}
                    >
                      X
                    </Button>
                  </List.Content>
                  <List.Content>{item.cliente.nome}</List.Content>
                </List.Item>
              );
            })}
          </List>
        </Grid.Column>
      </Grid>

      <FooterApp />
    </div>
  );
}
