# Real-time Slides avec MQTT

Ce dossier contient des composants Vue pour afficher le chat et les votes en temps réel dans les slides Slidev.

## Configuration

### 1. Installer les dépendances

```bash
cd packages/slides
bun install
```

### 2. Configurer les variables d'environnement

Crée un fichier `.env.local` :

```bash
# Endpoint AWS IoT Core (obtenir depuis sst dev ou sst deploy)
PUBLIC_REALTIME_ENDPOINT=wss://your-iot-endpoint.iot.eu-west-3.amazonaws.com/mqtt

# Token read-only (obtenir depuis sst secret list)
PUBLIC_REALTIME_TOKEN=your-read-only-token-here

# Nom de l'authorizer (par défaut)
PUBLIC_REALTIME_AUTHORIZER=Realtime

# App config (doit matcher avec l'infra)
PUBLIC_APP_NAME=warsawjs
PUBLIC_STAGE=dev
```

### 3. Obtenir les valeurs de configuration

```bash
# Dans le dossier racine du projet
sst dev

# Dans un autre terminal
sst secret list
# Copie la valeur de RealtimeReadOnlyToken

# Pour obtenir l'endpoint IoT
sst shell
# Puis dans le shell :
Resource.Realtime.endpoint
```

## Utilisation dans les slides

### Afficher le chat en direct

Dans ton fichier `slides.md` :

```md
---
layout: two-cols
---

# Chat Demo

<LiveChat :maxMessages="8" />

::right::

Votre contenu ici...
```

### Afficher les résultats de vote en direct

```md
---
layout: center
---

<LiveVote />
```

### Afficher les deux

```md
---
layout: two-cols
---

<LiveChat :maxMessages="5" />

::right::

<LiveVote />
```

## Composants disponibles

### `<LiveChat>`

Affiche les messages de chat en temps réel.

**Props:**
- `maxMessages` (number, optionnel): Nombre maximum de messages à afficher (défaut: 10)

**Exemple:**
```vue
<LiveChat :maxMessages="15" />
```

### `<LiveVote>`

Affiche les résultats du sondage en temps réel avec des barres animées.

**Exemple:**
```vue
<LiveVote />
```

### `<QRCode>`

Génère un QR code (déjà documenté dans le README principal).

## Sécurité

⚠️ **Important** : Le token read-only est exposé dans le code des slides.

**Règles de sécurité :**

✅ **À FAIRE :**
- Exécuter les slides seulement en local (`bun run dev`)
- Utiliser le token read-only (pas de write)
- Renouveler le token après chaque événement

❌ **À NE PAS FAIRE :**
- Déployer les slides publiquement
- Commit le fichier `.env.local`
- Utiliser le write token ou admin token dans les slides

Le token read-only ne permet que de **lire** les messages, pas d'en publier. Même si quelqu'un l'obtient, il ne peut pas publier de faux messages.

## Développement

```bash
# Lancer Slidev
bun run dev

# Les composants se rechargent automatiquement (Hot Module Replacement)
```

## Troubleshooting

### Les messages n'apparaissent pas

1. Vérifie que `PUBLIC_REALTIME_ENDPOINT` et `PUBLIC_REALTIME_TOKEN` sont corrects
2. Ouvre la console du navigateur (F12) pour voir les logs MQTT
3. Vérifie que le token read-only est configuré dans SST :
   ```bash
   sst secret list
   ```

### Erreur de connexion MQTT

- Vérifie que l'endpoint commence par `wss://` (pas `https://`)
- Vérifie que l'authorizer name est correct
- Vérifie que `appName` et `stage` correspondent à ton déploiement

### Les votes ne s'affichent pas correctement

Le composant `LiveVote` compte les votes uniques par utilisateur (le dernier vote gagne). Si tu veux compter tous les votes même si un utilisateur vote plusieurs fois, modifie le composant.

## Architecture technique

```
slides.md
  ↓ utilise
<LiveChat>
  ↓ utilise
useMqttTopic('chat')
  ↓ se connecte à
AWS IoT Core MQTT
  ↓ autorisé par
Lambda Authorizer (RealtimeReadOnlyToken)
```

Voir [SECURITY.md](../../SECURITY.md) pour plus de détails sur l'architecture de sécurité.
