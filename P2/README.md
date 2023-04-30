 # Práctica 2

## Mejoras p2

- Se mantienen todas las mejoras esteticas de la p1
- Se ha alargado el numero de productos en la web hasta 12
- Al hacer click en las sugerencias puedes ir diectamente a la pagina de producto
- La barra de busqueda y el footer siguen una estructura de componentes reutilizables
- La barra de busqueda funciona tambien en el header del la pagina del producto, la cesta de la compra y el perfil del usuario
- Se ha añadido una pagina intermedia en el buscador cuando se busca sin utilizar la recomendacion de un articulo:
    - Si solo hay un resultado posible, lleva directamente a esa pagina
    - La busqueda coincide con algunos elemenos --> Se muestran
    - La busqueda no coincide, sale un mensaje de error

- Desde el carrito de la compra se permite modificar la cantidad de elementos que se va a compar
- 4 usuarios añadidos : root, guti, jbalvin, Guillermo del toro. Estos dos ultimos siguen el lore de la pagina web ya que han dejado comentarios.
- Las cookies del carrito se guardan cuando el usuario desloguea, de esta manera cuando vuelve a iniciar sesion, recuerda que estaba guardado en el carro
- El carrito de la compra tiene tres vistas:
    - No has iniciado sesion
    - No tienes ningun producto en la lista
    - La cesta de la compra en si

- Dar varias veces al boton de añadir al carrito, SI aumenta el numero de productos en el carrito

- Introducidos pequeños detalles de control de stock
    - Cuando se hace una compra se actualiza el stock del JSON
    - No te deja comprar mas del stock disponible
    - La pagina de producto tiene un contador de stock que se va reduciendo segun va añadiendo productos al carrito,
      si tienes cookies de ese producto se tienen en cuenta.



TODO: 
    - Hacer que se actualice el precio de un producto con la base de datos
    - actualizar el sombreado de la pagina de categorias
    - actualizar con mejoras de practicas anteriores
    - Eliminar productos del carrito 
    - Añadir seccion de comentarios al JSON y que se publiquen en el main
    - Añadir una animacion de opacidad al mensaje de "Añadido al carrito"