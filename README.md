# CREADOR DE INVITACIONES PARA EVENTOS
<div style="display: flex; gap:2px">
<a href="https://astro.build/">
  <img src="https://raw.githubusercontent.com/github/explore/5cc0a03a302ec862c4aeac2a22a513ae31c35432/topics/astro/astro.png" alt="Astro" width="50"/>
</a>
<a href="https://nodesource.com/products/nsolid">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSDKn3vA2YUbXzN0ZC3gALWJ08gJN-Drl15w&s" alt="Astro" width="50"/>
</a>
</div>

## Acerca de
Este proyecto está diseñado para la creación de páginas de eventos, permitiendo la confirmación de asistencia por parte de los invitados.
## Capturas de pantalla
<div style="display:flex; width:100%; justify-content: space-around;">
<img src="/imagenes/invitacion1.png">
<img src="/imagenes/invitacion2.png">
<img src="/imagenes/invitacion3.png">
</div>
![Create](/imagenes/create.png)
![List](/imagenes/listado.png)

## Instalacion
Iniciar la API

```
/
├── api/
│   └── index.js
```
Necesitaras un .env con las creedenciales
```json
{
	
}
```
Despues inicias el servidor en modo de desarrollo. En la raiz del proyecto:
```sh
npm run dev
```
y luego vas a la ruta http://localhost:4321/dev/create. Una vez creas las invitaciones debes renombrar la carpeta /page/dev a /page/_dev/ para que al momento de hacer
```sh
npm run build
```
No tener disponible las paginas de desarrollo.
<BR>
_ Inspirado en [INVITO](https://invitio.events/) _
