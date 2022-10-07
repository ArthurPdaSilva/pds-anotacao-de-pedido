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
  compras: string;
  total: number;
  entrega: string;
  statusPedido: string;
};

export default function App() {
  const status = [
    { key: 'a', text: 'Em andamento', value: 'andamento' },
    { key: 'e', text: 'Em aguardo', value: 'aguardo' },
    { key: 'f', text: 'Finalizado', value: 'finalizado' },
  ];
  const [nome, setNome] = useState('');
  const [end, setEnd] = useState('');
  const [statusEscolhido, setStatusEscolhido] = useState(status[0].value);
  const [data, setData] = useState('');
  const [preco, setPreco] = useState(0);
  const [radio, setRadio] = useState('Domicílio');
  const [itens, setItens] = useState('');
  const [selectPedido, setSelectPedido] = useState<Pedido>();
  const [open, setOpen] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

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

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const obj = {
        nome: nome,
        endereco: end,
        dataPedido: data,
        total: preco,
        compras: itens,
        entrega: radio,
        statusPedido: statusEscolhido,
      };
      const lista = [...pedidos, obj];
      localStorage.setItem('pedidos', JSON.stringify(lista));
      setPedidos(lista);
      setNome('');
      setEnd('');
      setItens('');
      setPreco(0);

      toast.success('Cadastrado com sucesso!');
    },
    [
      nome,
      end,
      data,
      preco,
      radio,
      statusEscolhido,
      itens,
      pedidos,
      setPedidos,
      setNome,
      setEnd,
      setItens,
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
            <Header>Cliente {selectPedido?.nome}</Header>
            <p>
              Compras: <br /> {selectPedido?.compras}
            </p>
            <p>Status do pedido: {selectPedido?.statusPedido}</p>
            <p>Data do pedido: {selectPedido?.dataPedido}</p>
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

      <Grid
        columns={2}
        relaxed="very"
        stackable
        style={{ padding: '10px', height: '100vh' }}
      >
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
              <label>Endereço</label>
              <input
                placeholder="Endereço"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </Form.Field>
            <Form.Select
              fluid
              label="Status do Pedido"
              options={status}
              onChange={(e, data) => setStatusEscolhido(data.value as string)}
              placeholder="Status do pedido"
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

            <Form.TextArea
              label="Itens"
              placeholder="Digite os itens, quantidade e o preço..."
              style={{ resize: 'none' }}
              value={itens}
              onChange={(e) => setItens(e.target.value)}
              required
            />
            <Form.Field>
              <label>Preço Total</label>
              <input
                placeholder="Preço"
                type="number"
                value={preco}
                onChange={(e) => setPreco(Number(e.target.value))}
              />
            </Form.Field>
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
