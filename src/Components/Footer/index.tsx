import React from 'react';
import { Container, Grid, Header, Segment } from 'semantic-ui-react';

export default function FooterApp() {
  return (
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
  );
}
