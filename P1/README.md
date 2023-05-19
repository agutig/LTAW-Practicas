# Práctica 1

## Organizacion de archivos productos:

clase_marca_ID_SubID.Archivo

clase: mv,pc,pf , g(general)


## Mejoras front end

* Pagina principal
    * Animacion de arranque (los elementos van apareciendo progresivamente cuando se carga la pagina principal)
    * Animacion de scroll : Los elementos van apareciendo segun se va haciendo scroll hasta que progresivamente son visibles en pantalla
    * Animaciones hover y activate para los botones
    * Animaciones hover y activate para divs
    * Animaciones de gradientes de colores para textos y botones
    * fav.ico añadido
    * Se ha añadido un div "categorias" para simular la apariencia de una tienda de verdad
        * Las categorias son clickeables pero solo llevan a la pagina de error 404 (Util para pobarlo)

    * Se ha añadido un header y un footer (que se mantienen en la pagina de los productos)
        * Los botones son clickeables, "inicio" lleva a la pagina principal, el resto, al igual que los apartados de categorias invocan htmls inexistentes y fuerzan un error.

    * Hacer click en el logo del header (tanto en la pagina de producto como en la principal) te permiten acceder a la pantalla principal
    * Se ha añadido un carrusel de opiniones en movimiento (ajustables con los botones) para simular una tienda mas real

* Paginas de producto

    * Carrusel de hasta 3 imagenes por producto que pueden ser ajustadas con los botones dados
    * Boton de "Añadir al carrito" con animacion que pide una pagina inaccesible, invocando un error.


TODO:
- limpiar consolelogs