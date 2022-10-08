import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  Header,
  Button,
  Form,
  Grid,
  Container,
  List,
  Menu,
  Segment,
  Modal,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

type Pedido = {
  nome: string;
  endereco: string;
  dataPedido: string;
  compras: Produto[];
  total: number;
  entrega: string;
  statusPedido: string;
};

type Produto = {
  nome: string;
  preco: number;
};

export default function App() {
  const status = [
    { key: 'a', text: 'Em andamento', value: 'andamento' },
    { key: 'e', text: 'Em aguardo', value: 'aguardo' },
    { key: 'p', text: 'Problema no pagamento', value: 'problema ao pagar' },
    { key: 'f', text: 'Finalizado', value: 'finalizado' },
  ];
  const [nome, setNome] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [end, setEnd] = useState('');
  const [statusEscolhido, setStatusEscolhido] = useState(status[0].value);
  const [data, setData] = useState('');
  const [preco, setPreco] = useState(0);
  const [total, setTotal] = useState(0);
  const [radio, setRadio] = useState('Domicílio');
  const [selectPedido, setSelectPedido] = useState<Pedido>();
  const [open, setOpen] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const isPedido = localStorage.getItem('pedidos');
    if (isPedido) setPedidos(JSON.parse(isPedido));
  }, [setPedidos]);

  const handleModal = useCallback(
    (item: Pedido) => {
      setOpen(true);
      setSelectPedido(item);
    },
    [setSelectPedido],
  );

  const handleDelete = useCallback(
    (i: string) => {
      const lista = pedidos.filter((item) => item.nome !== i);
      localStorage.setItem('pedidos', JSON.stringify(lista));
      setPedidos(lista);
    },
    [pedidos, setPedidos],
  );

  const handleAdd = useCallback(() => {
    if (nomeProduto.length === 0 || preco <= 0) {
      toast.error('Adicione produto e preço válido');
      return;
    }
    const lista = [...produtos, { nome: nomeProduto, preco: preco }];
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

  const getTotal = (total: number, item: Produto) => {
    return total + item.preco;
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const obj = {
        nome: nome,
        endereco: end,
        dataPedido: data,
        total: total,
        compras: produtos,
        entrega: radio,
        statusPedido: statusEscolhido,
      };

      const lista = [...pedidos, obj];
      localStorage.setItem('pedidos', JSON.stringify(lista));
      setPedidos(lista);
      setNome('');
      setEnd('');
      setProdutos([]);
      setPreco(0);
      setTotal(0);
      toast.success('Cadastrado com sucesso!');
    },
    [
      nome,
      end,
      data,
      preco,
      radio,
      statusEscolhido,
      produtos,
      total,
      pedidos,
      setPedidos,
      setNome,
      setEnd,
      setTotal,
      setProdutos,
      setPreco,
    ],
  );

  return (
    <Container style={{ width: '100%' }}>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header>Pedido de {selectPedido?.nome}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Cliente: {selectPedido?.nome}</Header>
            <p>Endereço de entrega: {selectPedido?.endereco}</p>
            Compras:
            <ul>
              {selectPedido?.compras.map((itens) => {
                return (
                  <li key={itens.nome}>
                    {itens.nome}
                    Preço: R$ {itens.preco}
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

      <Menu
        inverted
        style={{
          borderRadius: '0',
          padding: '10px',
          fontSize: '1.5em',
        }}
      >
        <Container>
          <Menu.Item as="a" header>
            Projeto PDS
          </Menu.Item>
          <Menu.Item as="a" position="right">
            Home
          </Menu.Item>
        </Container>
      </Menu>

      <Grid columns={2} relaxed="very" stackable style={{ padding: '10px' }}>
        <Grid.Column>
          <Header size="huge">Cadastro de Pedidos</Header>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Field required>
              <label>Cliente</label>
              <input
                placeholder="Nome do Cliente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Field required>
              <label>Endereço de entrega</label>
              <input
                placeholder="Endereço"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
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
              <Button type="button" onClick={handleAdd}>
                Adicionar na lista
              </Button>
            </Form.Group>

            <List divided verticalAlign="middle">
              {produtos.map((item) => {
                return (
                  <List.Item key={item.nome}>
                    <List.Content>Nome: {item.nome}</List.Content>
                    <List.Content>
                      Preço: R$ {item.preco.toFixed(2)}
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
            <Header>Total: R$ {total.toFixed(2)}</Header>
            <Button type="submit">Cadastrar</Button>
          </Form>
        </Grid.Column>

        <Grid.Column verticalAlign="top">
          <Header size="huge">Pedidos cadastrados</Header>
          <List divided verticalAlign="middle">
            {pedidos.map((item) => {
              return (
                <List.Item key={item.nome}>
                  <List.Content floated="right">
                    <Button color="green" onClick={() => handleModal(item)}>
                      VER
                    </Button>
                    <Button color="red" onClick={() => handleDelete(item.nome)}>
                      X
                    </Button>
                  </List.Content>
                  <List.Content>{item.nome}</List.Content>
                </List.Item>
              );
            })}
          </List>
        </Grid.Column>
      </Grid>

      <Segment
        inverted
        vertical
        style={{ margin: '5em 0em 0em', padding: '5em 0em', width: '100%' }}
      >
        <Container textAlign="center">
          <Grid divided inverted stackable>
            <Grid.Column>
              <Header inverted as="h4" content="PROJETO CADASTRO DE PEDIDOS" />
              <p>
                Utilização do Semantic Ui e React TS para a construção desse
                projeto by: Arthur Pereira da Silva
              </p>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
      <ToastContainer theme="colored" autoClose={3000} />
    </Container>
  );
}
