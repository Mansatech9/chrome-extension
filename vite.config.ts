@@ .. @@
 import { defineConfig } from 'vite'
 import react from '@vitejs/plugin-react'
+import { resolve } from 'path'
 
 // https://vitejs.dev/config/
 export default defineConfig({
   plugins: [react()],
+  build: {
+    rollupOptions: {
+      input: {
+        main: resolve(__dirname, 'index.html'),
+        'content-script': resolve(__dirname, 'src/content-script.ts'),
+      },
+      output: {
+        entryFileNames: (chunkInfo) => {
+          return chunkInfo.name === 'content-script' 
+            ? '[name].js' 
+            : 'assets/[name]-[hash].js';
+        },
+      },
+    },
+  },
+  define: {
+    'process.env': {},
+  },
 })