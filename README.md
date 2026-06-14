# Todo Benchmark 📊

Comparaison des performances DOM entre React, Vue et Svelte.

## Frameworks testés

| Framework | Version | Port local |
|---|---|---|
| React | 18 | 5173 |
| Vue | 3 | 5174 |
| Svelte | 5 | 5175 |

## Résultats clés

| Opération | React | Vue | Svelte |
|---|---|---|---|
| Rendu 100 tâches | 0.400 ms | 0.400 ms | 0.300 ms |
| Rendu 500 tâches | 0.200 ms | 0.100 ms | 0.300 ms |
| Rendu 1000 tâches | 0.200 ms | 0.200 ms | 0.200 ms |
| Mise à jour 50 | 0.200 ms | 1.700 ms | 0.200 ms |
| Suppression 50 | 0.200 ms | 0.700 ms | 0.000 ms |

## 🏆 Conclusion

- **Svelte** — meilleur overall (code compilé, pas de Virtual DOM)
- **React** — stable et performant (Virtual DOM optimisé)
- **Vue** — plus lent sur les mises à jour

## Lancer les apps

```bash
cd react-todo && npm install && npm run dev   # http://localhost:5173
cd vue-todo && npm install && npm run dev     # http://localhost:5174
cd svelte-todo && npm install && npm run dev  # http://localhost:5175
```