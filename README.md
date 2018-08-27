                   
                   
                    **PROYECTO DE ARQUITECTURA DE MICROSERVICIOS  CON CACHÉ PARA REDUCIR LATENCIA**
		   

**INTEGRANTES:**

 @Kevin Alavarado
 @Ruddy Moncayo
 @Bryan Tumbaco

**DESCRIPCIÓN:**
  
El presente proyecto se basa en emplear los conocimientos adquiridos durante 
el transcurso de la materia con la finalidad de implementar un sistema web, 
con una arquitectura de microservicios y una caché para reducir latencia de acceso a la base de datos.
El sistema permitirá ver los diez gifs animas más populares de un sistema (top 10, en popularidad),
en el cual será almacenadas en una base de datos. 

**OBJETIVOS ESPECÍFICOS:**
  
-Diseñar e implementar un sistema de gestión de bases de datos en MySQL que contenga los registros de las noticias del día.
-Emplear un sistema distribuido de propósito general para caché basado en memoria.

-Elaborar un sitio Web el cual muestre las noticias del día y las 10 noticias más vistos del día usando conocimientos de caché, bases de datos y servicios Web.
     
**LIBRERIAS Y MIDDLEWARES POR USAR:**
  
-**redis:** ejecuta y particiona los datos en varios fragmentos, almacenados en la cache. Es un sistema distribuido en general para caché basado en memoria.

-**Apache thrift:** framework que se utiliza por la diversidad de recursos que existen en internet para solucionar problemas de dicho proyecto.
              
**SERVIDOR:**

-Node.js

**BASE DE DATOS:** 

-MySQL

**Despligue**

Para el desplique de la aplicación web en la nube se utilizó una cuenta gratuita de Azure.
Puede verificar el proyecto accediendo a http://40.87.82.1 que hace consultas sólo a la base de datos.
Mientras que accediendo a http://40.87.82.1/microservicio la app hace colsultas primero a la caché, sino se encuentra va a la base de datos, guarda la búsqueda en la caché y presenta el resultado.         
   

         
         
    

