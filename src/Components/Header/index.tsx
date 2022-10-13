import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Menu } from 'semantic-ui-react';

export default function HeaderApp() {
  return (
    <Menu
      inverted
      style={{
        borderRadius: '0',
        padding: '10px',
        width: '100%',
        fontSize: '1rem',
      }}
    >
      <Menu.Item as="a">
        <Header inverted size="large">
          Projeto PDS
        </Header>
      </Menu.Item>
      <Menu.Item as={Link} to="/" position="right">
        Home
      </Menu.Item>
      <Menu.Item as={Link} to="/customers">
        Cliente
      </Menu.Item>
    </Menu>
  );
}
