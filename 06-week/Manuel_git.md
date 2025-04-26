# 🛠️ Manual de Uso de Git

Este manual proporciona una guía paso a paso para trabajar con Git, siguiendo buenas prácticas recomendadas para flujos colaborativos. Incluye comandos esenciales, convenciones de commits y manejo de ramas.

## 📥 Clonar un repositorio

Para obtener una copia local de un repositorio remoto:

```bash
git clone <URL_DEL_REPOSITORIO>
```

**Ejemplo:**

```bash
git clone https://github.com/user/repository.git
```

Esto crea una carpeta con el contenido del repositorio remoto y configura la conexión al mismo.

## 🔍 Ver el estado del repositorio

Muestra los archivos modificados, no rastreados y preparados para commit:

```bash
git status
```

Usa este comando frecuentemente para mantener el control de tus cambios.

## 🌿 Ver ramas disponibles

Para listar todas las ramas locales:

```bash
git branch
```

Para ver también las ramas remotas:

```bash
git branch -a
```

## 🔄 Cambiar de rama

Para cambiarte a otra rama existente:

```bash
git checkout <nombre_rama>
```

A partir de Git 2.23, también puedes usar:

```bash
git switch <nombre_rama>
```

## 🆕 Crear una nueva rama

Asegúrate de estar en la rama `main` y actualizada antes de crear una nueva rama:

```bash
git checkout main
git pull origin main
git checkout -b feature/<nombre_de_la_rama>
```

**Ejemplo:**

```bash
git checkout -b feature/user-login
```

También puedes usar:

```bash
git switch -c feature/user-login
```

## 📌 Buenas prácticas con Conventional Commits

Usa el formato [Conventional Commits](https://www.conventionalcommits.org/) para estandarizar los mensajes de commit:

```bash
git commit -m "<tipo>(<área>): <mensaje claro y conciso>"
```

### Tipos comunes:

| Tipo   | Descripción |
|--------|-------------|
| ✨ feat     | Nueva funcionalidad |
| 🐛 fix      | Corrección de errores |
| 📝 docs     | Cambios en la documentación |
| 🎨 style    | Cambios de estilo sin afectar lógica |
| 🔨 refactor | Reestructuración del código |
| 🚀 perf     | Mejora de rendimiento |
| 🧪 test     | Agregar o modificar pruebas |
| 🚧 wip      | Trabajo en progreso (temporal) |

**Ejemplo:**

```bash
git commit -m "feat(auth): add user login with JWT"
```

## ⬆️ Subir cambios al repositorio remoto

Envía tus commits a la rama correspondiente del repositorio remoto:

```bash
git push origin <nombre_de_la_rama>
```

**Ejemplo:**

```bash
git push origin feature/user-login
```

## 🔄 Obtener los cambios más recientes

Para mantener tu rama actualizada con los últimos cambios del repositorio remoto:

```bash
git pull origin <nombre_de_la_rama>
```

**Ejemplo:**

```bash
git pull origin main
```

## ⚠️ Reglas y recomendaciones para trabajar con ramas

- Siempre crea nuevas ramas desde `main`, a menos que tengas una razón específica para lo contrario.
- Usa prefijos descriptivos en los nombres de las ramas:
  - `feature/`: para nuevas funcionalidades
  - `fix/`: para correcciones de errores
  - `hotfix/`: para parches urgentes
  - `chore/`: tareas de mantenimiento
- Evita trabajar directamente en `main`.
- Realiza `pull` frecuente para evitar conflictos.
- Borra ramas que ya no se usen con:

```bash
git branch -d <nombre>
git push origin --delete <nombre>
```

## ✅ Flujo de trabajo recomendado

```bash
# 1. Ir a main y actualizarlo
git checkout main
git pull origin main

# 2. Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# 3. Realizar cambios y ver el estado
git status

# 4. Agregar los archivos modificados
git add .

# 5. Hacer commit con convención
git commit -m "feat(nombre): mensaje claro"

# 6. Subir cambios
git push origin feature/nueva-funcionalidad
```

