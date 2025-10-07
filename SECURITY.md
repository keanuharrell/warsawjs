# Security Architecture

## MQTT/IoT Core Authorization

Ce projet implémente une architecture de sécurité à 3 niveaux pour l'accès aux topics MQTT via AWS IoT Core.

### Niveaux d'accès

#### 1. Read-Only (Lecture seule)
- **Token**: `RealtimeReadOnlyToken` (secret statique)
- **Usage**: Slides, visualisations publiques
- **Permissions**:
  - ✅ Subscribe à tous les topics
  - ❌ Publish interdit
- **Sécurité**: Peut être exposé publiquement (ex: dans les slides locales)

#### 2. Write (Écriture limitée)
- **Token**: `RealtimeWriteToken` (secret statique)
- **Usage**: Application web publique, participants
- **Permissions**:
  - ✅ Subscribe à tous les topics
  - ✅ Publish sur `chat` et `vote` uniquement
  - ❌ Publish sur `control` interdit
- **Sécurité**: Distribué via server-side rendering (Next.js)

#### 3. Admin (Accès complet)
- **Token**: JWT d'OpenAuth
- **Usage**: Panneau d'administration
- **Permissions**:
  - ✅ Subscribe à tous les topics
  - ✅ Publish sur tous les topics (incluant `control`)
- **Sécurité**:
  - Vérifié via JWKS (JSON Web Key Set)
  - Nécessite authentification Cognito
  - Token renouvelé automatiquement

### Configuration des secrets

Pour déployer l'application, configure les secrets suivants :

```bash
# Token read-only (peut être n'importe quelle chaîne)
sst secret set RealtimeReadOnlyToken "read-only-token-$(openssl rand -hex 16)"

# Token write (doit être secret et différent)
sst secret set RealtimeWriteToken "write-token-$(openssl rand -hex 16)"
```

### Fonctionnement de l'authorizer

Le Lambda authorizer ([packages/functions/src/realtime/authorizer.ts](packages/functions/src/realtime/authorizer.ts)) :

1. **Essaie d'abord de valider le token comme JWT** (admin)
   - Utilise JWKS depuis OpenAuth
   - Si valide → accès complet

2. **Vérifie ensuite si c'est le write token**
   - Comparaison avec `RealtimeWriteToken`
   - Si match → accès write (chat/vote)

3. **Vérifie enfin si c'est le read-only token**
   - Comparaison avec `RealtimeReadOnlyToken`
   - Si match → accès lecture seule

4. **Sinon → accès refusé**

### Utilisation dans les slides

Pour connecter Slidev au realtime avec le token read-only :

1. Crée un `.env.local` dans `packages/slides/` :
   ```bash
   PUBLIC_REALTIME_ENDPOINT=wss://your-iot-endpoint.com
   PUBLIC_REALTIME_TOKEN=your-read-only-token
   ```

2. Les composants Vue peuvent alors se connecter en lecture seule

3. **Important**: Ne déploie JAMAIS les slides publiquement avec le token. Exécute-les seulement en local pendant ta présentation.

### Bonnes pratiques

- ✅ Utilise des tokens longs et aléatoires
- ✅ Renouvelle les tokens après chaque événement
- ✅ Garde le read-only token séparé du write token
- ✅ Ne commit jamais les tokens dans le repo
- ✅ Utilise `.env.local` pour les secrets locaux
- ❌ Ne déploie jamais les slides publiquement
- ❌ N'expose jamais le write token côté client
