### README del Frontend (`/frontend/README.md`)
Enfoque en la experiencia de usuario y optimización de React.

# FlowUp Client - Interfaz de Usuario

Frontend moderno construido como una SPA (Single Page Application) para garantizar una navegación fluida.

## Características Técnicas
- **Optimistic UI:** Las tareas se reflejan localmente con IDs temporales antes de la confirmación del servidor para mejorar la UX.
- **Performance:** Uso intensivo de `useMemo` y `useCallback` para evitar re-renders costosos en listas de tareas extensas.
- **Estilos:** Diseño responsivo y modular utilizando **Tailwind CSS**.
- **Gestión de Estado:** Hooks nativos de React para el control del flujo de datos.

## Integración con API
El cliente se comunica con el backend mediante **Axios**. Asegúrate de que el backend esté corriendo en el puerto configurado (por defecto 3000) para evitar errores de conexión.

## Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo (Vite).
- `npm run build`: Genera el bundle optimizado para producción.