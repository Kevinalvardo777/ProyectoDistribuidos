namespace py gifs

struct Gifs {
  1: i32 id,
  2: string url,
  3: string description,
  4: i32 num_accesses
}

exception InvalidOperation {
  1: i32 what,
  2: string why
}

service ObtenerGifs {
   
   void ping(),

   list<Gifs> obtenerTopGifs(),

   /**
    * This method has a oneway modifier. That means the client only makes
    * a request and does not listen for any response at all. Oneway methods
    * must be void.
    */
   oneway void zip()

}
