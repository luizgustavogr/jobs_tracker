# Jobflow

Painel pessoal para acompanhar candidaturas, com dados armazenados no Supabase.

## Configuração local

1. Copie `.env.example` para `.env.local`.
2. Preencha `.env.local` com a URL e a chave **publicável** do Supabase.
3. Execute `database/schema.sql` no SQL Editor do Supabase.
4. `npm install` e `npm run dev`. Para produção: `npm run build` (saída em `dist/`).

Se a tabela já existir, execute novamente o `database/schema.sql`: ele adiciona as colunas `origin` e `link`, define `Brasileira` para registros antigos, atualiza as etapas de entrevista e habilita a edição de candidaturas.

`.env.local` está no `.gitignore` e não deve ser commitado. A chave publicável do Supabase não é um segredo administrativo, mas mantê-la fora do repositório evita acoplamento ao projeto e facilita trocar de ambiente.

Nunca use neste projeto:

- `service_role key`;
- senha do banco;
- tokens administrativos.

## Limitação do modo sem login

O modo atual é deliberadamente sem autenticação. As políticas em `database/schema.sql` permitem que qualquer pessoa que encontre o site leia, crie e exclua candidaturas. Isso é aceitável apenas para um painel pessoal não público. Para publicar na internet com privacidade, reative o login e restrinja as políticas por `auth.uid()`.
