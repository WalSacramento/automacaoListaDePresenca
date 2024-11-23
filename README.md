# Projeto de Automação de Lista de Presença

Este projeto tem como objetivo automatizar a lista de presença de alunos utilizando RFID e um sistema web. O projeto é composto por três partes principais: servidor, cliente e Arduino.

## Estrutura do Projeto

- **Servidor**: Implementado com FastAPI, gerencia o banco de dados e fornece uma API para operações CRUD.
- **Cliente**: Interface web desenvolvida com React para interação com o sistema.
- **Arduino**: Utiliza um módulo RFID para leitura de cartões e um módulo ESP-01 para comunicação com o servidor.

## Tecnologias Utilizadas

- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, React Router, Shadcn/UI, Axios
- **Hardware**: Arduino, MFRC522 (RFID), ESP-01 (Wi-Fi)

## Funcionalidades

### Servidor

- CRUD de Alunos
- CRUD de Turmas
- CRUD de Frequências
- Integração com Arduino para leitura de RFID

### Cliente

- Listagem e gerenciamento de alunos
- Listagem e gerenciamento de turmas
- Visualização de frequências

### Arduino

- Leitura de cartões RFID
- Envio de dados para o servidor via ESP-01