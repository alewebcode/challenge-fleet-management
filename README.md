# API de Gestão de Frota

API REST para gestão de frota de veículos, com autenticação JWT, CRUD de marcas, modelos e veículos, auditoria de operações e cache de respostas.

Desenvolvida com arquitetura hexagonal (ports & adapters), separando claramente as regras de domínio das camadas de infraestrutura.

---

## Tecnologias Utilizadas

- **Node.js 22**
- **NestJS 11**
- **TypeScript 5.7**
- **SQL Server** (TypeORM)
- **MongoDB** (Mongoose)
- **Redis**
- **RabbitMQ** (amqplib)
- **JWT + Passport**
- **Jest**
- **Docker**

---

## Arquitetura

O projeto segue a arquitetura hexagonal, onde cada módulo de domínio é organizado em três camadas:

```
modules/<dominio>/
├── domain/
│   ├── entities/          # Entidades de domínio
│   └── ports/             # Interfaces de repositório
├── application/
│   ├── dto/               # Data Transfer Objects
│   └── use-cases/         # Casos de uso (regras de negócio)
└── adapters/
    ├── http/controllers/  # Controladores REST
    └── typeorm/           # Implementações ORM
```

## Pré-requisitos

- [Node.js 22+](https://nodejs.org/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Aplicação
PORT=3000

# SQL Server
DB_HOST=sqlserver
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=SuaSenhaForte@123
DB_NAME=fleet_management_db
DB_ENCRYPT=false

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL=300

# MongoDB
MONGO_URI=mongodb://root:mongo_password@mongodb:27017/audit_db?authSource=admin
MONGO_USERNAME=root
MONGO_PASSWORD=mongo_password
MONGO_DATABASE=audit_db
MONGO_PORT=27017

# JWT
JWT_SECRET=seu_jwt_secret_aqui

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq
RABBITMQ_QUEUE_AUDIT=audit_logs
```

---

## Como Executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o arquivo `.env`

Crie o arquivo `.env` na raiz do projeto conforme o exemplo acima.

### 3. Subir os containers

```bash
docker compose up -d
```

### 4. Executar as migrations

```bash
npm run migration:run
```

### 5. Executar o seed de usuário

```bash
npm run seed:users
```

Isso cria o usuário administrador padrão para acesso inicial à API.

---

## Como Testar

### Testes unitários

```bash
npm run test
```
