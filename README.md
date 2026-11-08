# Bioferia 2027 · app unificada

Esta versión reúne las pantallas originales de la app con el recorrido **«Lo que te sobra puede ser justo lo que alguien necesita»**. La portada conduce a ambas experiencias, con la gráfica de Bioferia y tarjetas orgánicas.

## Qué se puede recorrer

- **Inicio:** recolección de tapitas, botellas y envases, intercambio, fondo común con el peso de la demo, personajes que pasan de a uno, accesos al festival, guía, realidad aumentada y BioPoints.
- **Festival:** mapa, agenda, seis apariciones de «Seguí el hilo», juego «Hecho y cosido», ticket de recorrido, kit de entrada y pago de prueba.
- **Intercambio:** traer tapitas, botellas o envases; medir; dejar el excedente o tomar lo necesario del fondo; elegir una de seis piezas. «Fondo común» y «Mi pieza» están enlazados con el mismo estado.
- **Guía:** temas, búsqueda, guardados y mapa ilustrativo de la ciudad.
- **BioPoints:** saldo, movimientos del intercambio, carga y pagos de prueba, cupones y tienda.
- **Perfil:** cuenta simulada y accesos a la guía, el intercambio y las experiencias. Usuario de prueba: `demo@bioferia.test` / `bioferia2027`.

Los BioPoints que se suman al compartir plástico aparecen en la misma billetera de la app. «Hecho y cosido» conserva su búsqueda simulada por el predio y está enlazado desde Inicio, Festival y Mi pieza.

El botón de BioPoints está en el centro de la navegación. Las cabeceras toman el color de su subconcepto; Fondo común usa el del equilibrio y Mi pieza el de la revelación. Los personajes del carrusel avanzan automáticamente y también se pueden recorrer con las flechas. Si el dispositivo solicita menos movimiento, solamente avanzan con las flechas.

Los textos de lectura usan **Anybody Expanded Regular**, mientras los títulos conservan Big Shoulders. Las seis figuras del intercambio y de Mi pieza usan PNG con transparencia; las imágenes de origen se conservan en `hc/`.

## Probarla

Abrí `index.html` desde un servidor estático local o publicá **toda la carpeta** en GitHub Pages. Mantené las carpetas `ar/`, `assets/`, `extra/`, `fonts/`, `hc/`, `pz/` y `resources/` junto al HTML. No hace falta compilar.

El archivo `index.html` carga `mobile.js`, `juegos.js`, `laboratorio.js`, `poster.js`, `intercambio.js` y `carousel.js`. `unified.css` contiene el diseño adaptable a distintos tamaños de pantalla. Los archivos de la app de cuatro pestañas se retiraron para evitar dos versiones activas.

## Alcance del prototipo

El PDF no fija gramos por pieza ni BioPoints por gramo. La simulación usa **120 g por pieza**, **5 BP por gramo compartido** y **600 g** iniciales en el fondo. Los datos se guardan en el navegador de ese dispositivo. La cámara, la balanza, el fondo compartido real, los pagos y la impresora no están conectados. El mapa y la agenda del festival son ilustrativos y están marcados como tales.
