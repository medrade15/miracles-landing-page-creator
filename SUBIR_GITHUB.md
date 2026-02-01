# Como subir o projeto para o GitHub (corrigir o erro de push)

O Git já está configurado e o repositório está em: **https://github.com/medrade15/miracles-landing-page-creator**

O erro acontece porque o GitHub **não aceita mais senha da conta** no `git push`. É preciso usar um **Personal Access Token (token de acesso)**.

---

## Passo a passo

### 1. Criar um Personal Access Token no GitHub

1. Entre no GitHub e clique na sua **foto** (canto superior direito) → **Settings**.
2. No menu da esquerda, vá em **Developer settings** (bem no final).
3. Clique em **Personal access tokens** → **Tokens (classic)**.
4. Clique em **Generate new token** → **Generate new token (classic)**.
5. Dê um nome (ex: "miracles-landing") e marque a permissão **repo** (acesso a repositórios).
6. Clique em **Generate token**.
7. **Copie o token** e guarde em um lugar seguro (ele só aparece uma vez).

---

### 2. Fazer o push no terminal

No terminal, na pasta do projeto:

```bash
cd "/home/fernando-santos/Transferências/miracles-landing-page-creator"
git push origin main
```

Quando o Git pedir:

- **Username:** seu usuário do GitHub (ex: `medrade15`)
- **Password:** **cole o token** que você criou (não use a senha da conta)

Se der certo, o push termina e o código sobe para o GitHub.

---

### 3. (Opcional) Guardar o token para não digitar sempre

No terminal:

```bash
git config --global credential.helper store
```

Na próxima vez que você fizer `git push` e colar o token, o Git guarda. Depois não pede de novo (até o token expirar ou você trocar de máquina).

---

## Se ainda der erro

- **"Authentication failed"** → Confira se o token está correto e se marcou a permissão **repo**.
- **"Permission denied"** → Confira se o usuário `medrade15` é dono do repositório ou tem permissão de escrita.
- **"Branch diverged"** de novo → Rode antes: `git pull --rebase origin main` e depois `git push origin main`.

---

## Resumo rápido

| O que fazer | Comando / ação |
|-------------|-----------------|
| Criar token | GitHub → Settings → Developer settings → Personal access tokens → Generate |
| Subir o código | `git push origin main` (usar token quando pedir senha) |
| Guardar token | `git config --global credential.helper store` (opcional) |
