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

## Login com Google

O app usa o Supabase Auth com o provedor Google, e as políticas de RLS em `database/schema.sql` restringem cada candidatura ao seu dono (`auth.uid() = user_id`).

1. No [Google Cloud Console](https://console.cloud.google.com/apis/credentials), crie um **OAuth client ID** do tipo *Web application*.
   - **Authorized redirect URI**: `https://<seu-projeto>.supabase.co/auth/v1/callback`
2. No Supabase, em **Authentication → Providers → Google**, ative o provedor e informe o Client ID e o Client Secret.
3. Em **Authentication → URL Configuration**, defina o **Site URL** e adicione em **Redirect URLs** `http://localhost:5173` e a URL de produção.
4. Execute `database/schema.sql` no SQL Editor.
5. Candidaturas antigas ficam sem dono (e invisíveis). Depois do primeiro login, atribua-as a você com o `update` comentado no `schema.sql`.
