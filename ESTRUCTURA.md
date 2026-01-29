# Estructura de Páginas - Cecaprian Cápsulas

## Descripción General
El proyecto se ha reorganizado en dos páginas principales con funcionalidades claras y separadas para mantener un mejor orden de código.

---

## Páginas del Sistema

### 1. **cecaprian-admin.html** - Panel Administrativo ⚙️
Acceso exclusivo para administradores con credenciales: `admin` / `admin123`

**Funcionalidades:**
- ✅ Subir cápsulas de video (YouTube, Vimeo, Google Drive, URLs directas)
- ✅ Gestión de usuarios (crear, editar, eliminar, copiar credenciales)
- ✅ Gestión de evaluaciones (crear, editar, eliminar, ver resultados)
- ✅ Gestión de documentos (subir PDF, descargar, eliminar)
- ✅ Ver todas las cápsulas disponibles
- ✅ Monitoreo de intentos de evaluación por estudiante
- ✅ Resetear intentos de evaluación a usuarios

**Acceso:** Se redirige automáticamente desde login.html cuando el admin inicia sesión

---

### 2. **CECAPRIAN.html** - Portal de Estudiantes 👨‍🎓
Acceso para usuarios normales con credenciales creadas por el administrador

**Funcionalidades:**
- ✅ Ver todas las cápsulas de video disponibles
- ✅ Reproducir videos con diferentes fuentes (YouTube, Vimeo, Google Drive)
- ✅ Responder evaluaciones (máximo 3 intentos)
- ✅ Ver calificación inmediata
- ✅ Descargar documentos (PDFs) disponibles
- ❌ NO puede crear ni eliminar contenido

**Acceso:** Se redirige automáticamente desde login.html cuando un usuario inicia sesión

---

### 3. **login.html** - Página de Autenticación 🔐
Punto de entrada del sistema

**Funcionalidades:**
- ✅ Selector de tipo de usuario (Admin o Usuario)
- ✅ Validación de credenciales
- ✅ Redirección automática según tipo de usuario
- ✅ Manejo de sesiones con localStorage

**Flujo:**
1. Admin → Inicia sesión con admin/admin123 → Redirige a cecaprian-admin.html
2. Usuario → Selecciona username → Inicia con credenciales → Redirige a CECAPRIAN.html
3. Si hay sesión activa → Redirige automáticamente

---

## Estructura de Datos (localStorage)

### Cápsulas
```json
[
  {
    "id": "timestamp",
    "unidad": "Unidad 1",
    "titulo": "Nombre de la cápsula",
    "descripcion": "Descripción",
    "videoUrl": "https://...",
    "fecha": "ISO timestamp"
  }
]
```

### Usuarios
```json
[
  {
    "username": "juan",
    "password": "contraseña123",
    "fecha": "ISO timestamp"
  }
]
```

### Evaluaciones
```json
[
  {
    "id": "timestamp",
    "titulo": "Evaluación 1",
    "descripcion": "Descripción",
    "preguntas": [
      {
        "pregunta": "¿Pregunta?",
        "opciones": ["Opción1", "Opción2", "Respuesta Correcta"],
        "respuestaCorrecta": "Respuesta Correcta"
      }
    ],
    "fecha": "ISO timestamp"
  }
]
```

### Respuestas de Evaluaciones
```json
[
  {
    "usuarioId": "juan",
    "evaluacionId": "timestamp",
    "aciertos": 8,
    "total": 10,
    "porcentaje": 80,
    "fecha": "ISO timestamp"
  }
]
```

### Documentos
```json
[
  {
    "id": "timestamp",
    "nombre": "Nombre del documento",
    "contenido": "data:application/pdf;base64,JVBERi0x...",
    "tamanio": "2.50 MB",
    "tipo": "application/pdf",
    "fecha": "ISO timestamp"
  }
]
```

### Sesión
```json
{
  "tipo": "admin" | "usuario",
  "username": "juan", // Solo para usuarios
  "fecha": "ISO timestamp"
}
```

---

## Flujo de Autenticación

```
login.html
    ↓
[Seleccionar Tipo de Usuario]
    ↓
    ├─→ Admin → Validar con admin123 → cecaprian-admin.html
    │
    └─→ Usuario → Validar con DB de usuarios → CECAPRIAN.html
```

---

## Mejoras Implementadas ✨

1. **Separación de responsabilidades**: Admin y Usuario tienen portales distintos
2. **Código mejor organizado**: Cada página solo contiene lo necesario
3. **Seguridad mejorada**: El usuario no puede modificar contenido
4. **Mejor UX**: Interfaz específica para cada tipo de usuario
5. **Escalabilidad**: Fácil agregar más funcionalidades sin mezclar código

---

## Notas Importantes

- Todos los datos se guardan en **localStorage** (navegador del cliente)
- Las contraseñas se guardan en **texto plano** en localStorage
- Para producción, se recomienda usar un backend real con base de datos
- El máximo de intentos en evaluaciones es **3** (configurable)
- La calificación mínima para aprobar es **80%** (configurable)
- El tamaño máximo de PDF es **10 MB**

---

## Soporte de Videos

- **YouTube**: URLs estándar, youtu.be, y variantes
- **Vimeo**: URLs de vimeo.com
- **Google Drive**: URLs de compartición directa
- **Directas**: MP4, WebM y otros formatos soportados por HTML5

