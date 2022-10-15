import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import FooterApp from '../../Components/Footer';
import HeaderApp from '../../Components/Header';
import Cliente from '../../types/Cliente';

export default function Customers() {
  const [nome, setNome] = useState('');
  const [end, setEnd] = useState('');
  const [tel, setTel] = useState('');

  const handleFormat = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const notFormatted = e.target.value;

      const formattedPhone = notFormatted
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');

      setTel(formattedPhone);
    },
    [setTel],
  );

  const handleSubmitCustomer = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const obj: Cliente = {
        nome: nome,
        endereco: end,
        telefone: tel,
      };
      const isLista = localStorage.getItem('clientes');

      if (isLista) {
        const lista = [...JSON.parse(isLista), obj];
        localStorage.setItem('clientes', JSON.stringify(lista));
      } else {
        localStorage.setItem('clientes', JSON.stringify([obj]));
      }

      setNome('');
      setEnd('');
      setTel('');
      toast.success('Cadastrado com sucesso');
    },
    [nome, end, tel, setNome, setEnd, setTel],
  );

  return (
    <div>
      <HeaderApp />
      <Grid
        textAlign="center"
        style={{ height: '100vh', width: '100%' }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header size="huge">Cadastro de Clientes</Header>
          <Form onSubmit={handleSubmitCustomer}>
            <Segment stacked>
              <Form.Field required>
                <label>Nome do cliente</label>
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

              <Form.Field required>
                <label>Telefone</label>
                <input
                  placeholder="Telefone"
                  value={tel}
                  onChange={(e) => handleFormat(e)}
                  required
                />
              </Form.Field>

              <Button color="teal" fluid size="large">
                Adicionar Cliente
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
      <FooterApp />
    </div>
  );
}
