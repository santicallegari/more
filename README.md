# 🌼 Mi Jardín — Página Romántica

Una experiencia digital premium para pedirle a alguien especial que sea tu novia.

---

## 📁 Estructura del proyecto

```
mi-jardin/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/
│   └── audio/
│       └── musica.mp3    ← Reemplazá este archivo con tu canción
└── README.md
```

---

## 🎵 Agregar música

1. Conseguí un archivo MP3 de tu canción favorita
2. Renombralo como `musica.mp3`
3. Copialo a `assets/audio/musica.mp3`
4. ¡Listo! El botón 🎵 Música ya lo va a reproducir

---

## 💻 Correr localmente

Simplemente abrí `index.html` en tu navegador.

Si querés un servidor local (recomendado para el audio):

```bash
# Con Node.js instalado:
npx serve .

# Con Python 3:
python -m http.server 8080
```

---

## 🚀 Subir a GitHub y desplegar en Vercel

### PASO 1 — Crear la carpeta y abrir VS Code

```bash
# En tu terminal, ir a donde está la carpeta
cd mi-jardin

# Abrir en VS Code
code .
```

---

### PASO 2 — Inicializar Git

```bash
# Dentro de la carpeta mi-jardin
git init
git add .
git commit -m "✨ Primer commit — Mi Jardín"
```

---

### PASO 3 — Crear repositorio en GitHub

1. Entrá a [github.com](https://github.com)
2. Hacé clic en el **+** (arriba a la derecha) → **New repository**
3. Nombre: `mi-jardin`
4. Dejalo como **Public** (necesario para Vercel gratis)
5. **NO** marques "Initialize repository with README"
6. Hacé clic en **Create repository**

---

### PASO 4 — Vincular y subir

GitHub te va a mostrar los comandos. Usá estos:

```bash
git remote add origin https://github.com/TU_USUARIO/mi-jardin.git
git branch -M main
git push -u origin main
```

> Reemplazá `TU_USUARIO` con tu nombre de usuario de GitHub

---

### PASO 5 — Desplegar en Vercel

1. Entrá a [vercel.com](https://vercel.com)
2. Clic en **Sign Up** → elegí **Continue with GitHub**
3. Autorizá la conexión con GitHub
4. En el dashboard, clic en **Add New… → Project**
5. Buscá `mi-jardin` y hacé clic en **Import**
6. En la configuración del proyecto:
   - Framework Preset: **Other**
   - Root Directory: `.` (el punto, que es la carpeta raíz)
   - Build Command: dejar **vacío**
   - Output Directory: dejar **vacío**
7. Clic en **Deploy**
8. En 30 segundos tenés tu URL lista: `https://mi-jardin.vercel.app`

---

### PASO 6 — Actualizar el proyecto en el futuro

Cada vez que hagas cambios:

```bash
git add .
git commit -m "🌸 Descripción del cambio"
git push
```

Vercel detecta el push automáticamente y re-despliega en segundos.

---

## 🔑 Notas técnicas

- **localStorage key**: `mi_jardin_respuesta` — guardá `"yes"` o `"no"`
- **Para resetear la pregunta** (testing): abrí la consola del navegador y ejecutá:
  ```javascript
  localStorage.clear(); location.reload();
  ```
- **Rendimiento**: Todo en Vanilla JS, sin dependencias. Canvas API + CSS animations.
- **Responsive**: Funciona en móviles, tablets y desktop.

---

## ❤️ Hecho con amor
