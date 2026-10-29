# Bitácora de ensayos

Registro de ensayos musicales y base de conocimiento (escalas, tips), con estilo Bauhaus.
PWA pensada para el celular; los datos se guardan en el dispositivo (IndexedDB).

## Comandos

```bash
npm run dev      # desarrollo en http://localhost:3000 (redirige a /bitacora)
npm run build    # build de producción
npm run test     # tests (Vitest)
npm run lint     # ESLint
npm run iconos   # regenera los íconos PNG desde la composición SVG
```

## Estructura

- `src/app/bitacora/` — rutas del módulo (se copian tal cual a AcorDesk).
- `src/features/bitacora/` — código del módulo: datos (Dexie), pantallas y lógica.
- `src/lib/` — utilidades compartidas (fechas, uuid y, más adelante, teoría musical).
- `src/ui/` — componentes del sistema de diseño Bauhaus.
