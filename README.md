
# 🚀 Funnelhot AI Assistant Management Module

Bienvenido a la documentación técnica del **Módulo de Gestión de Asistentes IA** para Funnelhot. Esta aplicación es una solución profesional, escalable y robusta para la creación, entrenamiento y supervisión de agentes inteligentes.

---

## 🛠️ Stack Tecnológico

La arquitectura ha sido diseñada siguiendo las mejores prácticas de la industria para aplicaciones modernas de alto rendimiento:

*   **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first framework)
*   **Gestión de Estado Global:** [Zustand](https://zustand-demo.pmnd.rs/) (Arquitectura ligera y de alto rendimiento)
*   **Gestión de Datos Asíncronos:** [TanStack Query v5](https://tanstack.com/query/latest) (Cacheado, sincronización y estados de carga)
*   **Formularios:** [React Hook Form](https://react-hook-form.com/) (Manejo de validaciones y performance de inputs)
*   **Iconografía:** SVG Components

---

## 📂 Estructura del Proyecto

```text
root/
├── components/           # Componentes atómicos y moleculares reutilizables
│   ├── AssistantCard.tsx # Tarjetas de visualización de asistentes
│   ├── AssistantModal.tsx# Formulario de 2 pasos para creación/edición
│   ├── ChatSimulation.tsx# Interfaz de chat en tiempo real
│   ├── Icons.tsx         # Set de iconos optimizados
│   └── Toast.tsx         # Sistema de notificaciones
├── pages/                # Vistas principales de la aplicación
│   ├── Dashboard.tsx     # Vista principal (Listado y CRUD)
│   └── TrainingDetail.tsx# Vista de entrenamiento y simulación
├── services/             # Lógica de comunicación con API (Mocked)
│   └── mockService.ts    # Simulación de backend con delays y errores controlados
├── store/                # Estados globales con Zustand
│   └── useAssistantStore.ts
├── types.ts              # Definiciones de interfaces globales de TypeScript
├── App.tsx               # Orquestador de navegación y layout principal
└── index.tsx             # Punto de entrada y configuración de Providers
```

---

## ⚙️ Instalación y Lanzamiento

Para ejecutar este proyecto en un entorno de desarrollo local, siga estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/funnelhot-ai-manager.git
    cd funnelhot-ai-manager
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
-  **Instalar Tailwind V3:**
    ```bash
    npm install -D tailwindcss@3 postcss autoprefixer
    # npx tailwindcss@3 init -p
    ## Para crear dos archivos fundamentales para los estilos tailwind.config.js
postcss.config.js
    ```

3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Compilación para producción:**
    ```bash
    npm run build
    ```

---

## 🔄 Flujo de Datos y Componentes

### 1. Gestión de Estado (Zustand + React Query)
La aplicación utiliza una estrategia híbrida:
*   **React Query:** Maneja los estados de "servidor" (loading, error, fetching). Invalida las consultas tras una mutación para asegurar que la UI esté sincronizada con el "backend".
*   **Zustand:** Maneja el estado persistente de la sesión (historial de chats, tema Dark/Light y sincronización de datos entre vistas).

### 2. Ciclo de Vida del Asistente
1.  **Creación:** El usuario interactúa con `AssistantModal`. El **Paso 1** valida la data básica. El **Paso 2** asegura que la suma de porcentajes de respuesta sea exactamente 100%.
2.  **Persistencia:** Al guardar, se dispara una `mutation` de React Query que interactúa con el `mockService`. Tras el éxito, el store de Zustand se actualiza.
3.  **Entrenamiento:** En `TrainingDetail`, el usuario define las `rules`. Al guardar, el store global se actualiza para que el `ChatSimulation` pueda "leer" el nuevo comportamiento.
4.  **Simulación:** El componente de chat simula una conversación mediante un retardo controlado de 1.5s y un pool de respuestas predefinidas.

---

## ✨ Características Destacadas

### 🌓 Dark Mode Profesional
Implementación mediante clases de Tailwind (`.dark`). El tema se persiste en `localStorage` y se sincroniza instantáneamente mediante el store de Zustand, aplicando estilos optimizados para reducir la fatiga visual.

### 🛡️ Resiliencia y Validaciones
*   **Validación de Formularios:** Uso de `react-hook-form` para validaciones en tiempo real (mínimo de caracteres, campos requeridos).
*   **Manejo de Errores:** El `mockService` incluye una probabilidad del 10% de error en la eliminación para demostrar el manejo de excepciones mediante el componente `Toast`.
*   **Optimistic Updates:** La UI reacciona de manera fluida a las mutaciones, proporcionando una sensación de velocidad "instantánea".

---

## 🧠 Documentación de Lógica y Métodos

### 1. Gestión de Estado Global (`store/useAssistantStore.ts`)
Utilizamos **Zustand** para manejar el estado de la aplicación de forma centralizada.

| Método | Parámetros | Descripción |
| :--- | :--- | :--- |
| `toggleTheme` | `void` | Alterna entre `light` y `dark`. Persiste la elección en `localStorage` y actualiza la clase global del DOM. |
| `addChatMessage` | `assistantId: string, message: Message` | Inserta un mensaje en el historial específico de un asistente. Se usa en la simulación de chat. |
| `openModal` | `id?: string` | Orquesta la apertura del modal. Si recibe un `id`, entra en modo "Edición" cargando los datos del asistente. |
| `clearChat` | `assistantId: string` | Reinicia el historial de mensajes de la memoria volátil para un asistente específico. |

### 2. Capa de Servicios (`services/mockService.ts`)
Simula la interacción con un backend real mediante promesas y retardos controlados.

*   **`createAssistant(data)`**: Transforma el esquema del formulario en un objeto `Assistant` completo, generando un `UUID` único.
*   **`deleteAssistant(id)`**: Incluye una lógica de **Resiliencia**. Tiene un 10% de probabilidad de fallo para testear el manejo de errores en la UI.
*   **`saveRules(id, rules)`**: Método crítico para el entrenamiento. Persiste las instrucciones de comportamiento del modelo.

### 3. Lógica de Componentes Clave

#### A. Formulario de 2 Pasos (`AssistantModal.tsx`)
El modal utiliza un flujo de validación secuencial:
- **Paso 1 (Identidad):** Valida `name`, `language` y `tone` mediante `trigger()` de React Hook Form.
- **Paso 2 (Configuración):** Implementa una lógica de suma de control. Las respuestas (Short + Medium + Long) deben sumar exactamente **100%**. Si no, el botón de guardado se bloquea y muestra un aviso visual.

#### B. Motor de Simulación (`ChatSimulation.tsx`)
Para validar el entrenamiento sin costes de API reales:
- Implementa un `setTimeout` de 1500ms para simular el tiempo de inferencia del modelo.
- Gestiona un estado `isTyping` para feedback visual (animación de puntos suspensivos).
- Utiliza un pool de respuestas aleatorias (`SIMULATED_RESPONSES`) para imitar la variabilidad de la IA.

---

## 📂 Arquitectura de Archivos

- `/components`: Componentes puros de UI.
- `/pages`: Orquestadores de vistas (Dashboard y Training).
- `/store`: Definición del Single Source of Truth.
- `/services`: Lógica de infraestructura y llamadas externas.
- `types.ts`: Contratos de interfaces para todo el sistema.

---

## 🎨 Guía de Estilos y Temas

El sistema de diseño se basa en **Tailwind CSS**. 
- **Modo Oscuro:** Activado por la clase `.dark` en el tag `<html>`.
- **Acentos:** Color Indigo-600 para acciones principales (Primary Action).
- **Fondos:** Slate-50 (Light) / Slate-950 (Dark) para profundidad visual.

## 📝 Notas del Desarrollador

*   **Persistencia:** Aunque los datos viven en memoria (Zustand), se ha simulado un flujo de API completo para que la integración con un backend real sea cuestión de minutos cambiando las URLs en `mockService.ts`.
*   **Accesibilidad:** Se han utilizado etiquetas semánticas y contrastes de color que cumplen con estándares de accesibilidad para herramientas administrativas corporativas.
*   **Diseño:** Inspirado en interfaces SaaS modernas (tipo Vercel/Linear), priorizando el espacio en blanco y la claridad tipográfica.

---
© 2024 **Prueba Final**. Implementado por un Junior Frontend.
