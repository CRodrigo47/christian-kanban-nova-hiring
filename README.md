## 🚀 Solución a la Prueba Técnica

Esta sección documenta las nuevas características y los cambios de arquitectura implementados para cumplir con los requisitos de la prueba técnica.

### 1. Configuración y Dependencias

Para que el proyecto funcione, se han añadido nuevas dependencias y se requiere una configuración inicial:

* **Variables de Entorno**: Es necesario crear un archivo `.env` en la raíz del proyecto. Este archivo debe contener la variable `VITE_OPENAI_API_KEY` con tu clave de la API de OpenAI.

    ```
    VITE_OPENAI_API_KEY="sk-..."
    ```
* **Nuevas Bibliotecas**:
    * `react-hot-toast`: Se ha instalado para gestionar la visualización de notificaciones (toasts) de éxito, error y carga.
    * `axios`: Se ha instalado para gestionar las llamadas a la API de OpenAI, facilitando el manejo de respuestas y errores.

### 2. Cómo Ejecutar la Solución

1.  Asegúrate de tener Node.js y npm instalados.
2.  Clona el repositorio.
3.  Instala las dependencias base:

    ```bash
    npm install
    ```
4.  Instala las nuevas dependencias para la prueba:
    ```bash
    npm install react-hot-toast axios
    ```
5.  Crea el archivo `.env` en la raíz y añade tu API key (ver punto 1).
6.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
7.  Abre tu navegador y visita: `http://localhost:5173`

### 3. Resumen de Cambios Técnicos

A continuación se detallan los archivos creados y modificados para implementar la funcionalidad de tareas ejecutables:

* **`src/types.ts` (Modificado)**
    * Se ha añadido el tipo `TaskType` para definir los tres tipos de tareas: `"successToast" | "errorToast" | "chatGPTQuery"`.
    * Se ha modificado la interfaz `Task` para incluir la propiedad `type: TaskType`, permitiendo que cada tarea almacene su comportamiento.

* **`src/components/TaskModal.tsx` (Añadido)**
    * Se ha creado este nuevo componente para gestionar la creación de tareas.
    * Muestra un formulario con un selector (`<select>`) para el tipo de tarea y un área de texto (`<textarea>`) para el contenido.
    * El placeholder del `textarea` cambia dinámicamente según el tipo de tarea seleccionada.

* **`src/components/KanbanBoard.tsx` (Modificado)**
    * Se ha añadido el estado `isModalOpen` y `modalColumnId` para controlar la visibilidad y el contexto del `TaskModal`.
    * La función `createTask` se ha modificado para aceptar `content` y `type` como argumentos.
    * Se ha creado la función `openCreateTaskModal`, que ahora se pasa como prop `createTask` al `ColumnContainer` para abrir el modal.
    * El componente ahora renderiza `<TaskModal />` de forma condicional al final del JSX.

* **`src/components/TaskCard.tsx` (Modificado)**
    * Implementa el requisito de diferenciación visual.
    * Se ha añadido la función `getTaskColors()` que aplica un color de fondo (rojo, verde o azul) al `<div>` principal de la tarea basándose en `task.type`.

* **`src/main.tsx` (Modificado)**
    * Se ha limpiado el archivo principal. Ahora importa y renderiza el nuevo componente `<GlobalToaster />` para centralizar la configuración de los toasts.

* **`src/components/GlobalToaster.tsx` (Añadido)**
    * Este nuevo componente encapsula el `<Toaster />` de `react-hot-toast`.
    * Define los estilos globales para todos los toasts, asegurando que coincidan con el tema oscuro de la aplicación (colores de fondo, texto y bordes).

* **`src/components/ColumnContainer.tsx` (Modificado)**
    * Se ha añadido el botón "Play" (usando el nuevo ícono `src/icons/PlayIcon.tsx`) en la cabecera de la columna.
    * El contador de tareas se ha corregido para mostrar `{tasks.length}` en lugar de un valor estático.
    * Se ha importado y utilizado el *custom hook* `useTaskExecutor`.
    * Toda la lógica de ejecución se ha delegado al hook. El botón "Play" ahora simplemente llama a `executeTasks(tasks)`.

* **`src/hooks/useTaskExecutor.tsx` (Añadido)**
    * Este *custom hook* abstrae toda la lógica de ejecución de tareas, manteniendo el `ColumnContainer` limpio.
    * Gestiona el estado `isLoading` para deshabilitar el botón "Play" durante la ejecución.
    * Define la función `executeTasks`, que itera sobre las tareas en orden secuencial usando un bucle `for...of` y aplica un `delay` de 1.5 segundos entre cada una.
    * Implementa la lógica para `successToast` y `errorToast`, mostrándolos por 2 segundos.
    * Contiene la función `handleChatGPTQuery`:
        * Lee la API key desde `import.meta.env.VITE_OPENAI_API_KEY`.
        * Utiliza `axios` para realizar la llamada POST a la API de OpenAI (usando el modelo `gpt-5-mini-2025-08-07` como se especifica en los requisitos).
        * Gestiona los estados de carga y maneja los errores de la API, mostrándolos en un toast.
        * Muestra la respuesta de ChatGPT en un toast especial que incluye:
            * Una duración de 15 segundos (`duration: 15000`).
            * Un `maxHeight` de "300px" y `overflowY: "auto"` para permitir el scroll en respuestas largas.
            * Un botón "X" para que el usuario pueda cerrarlo manualmente.