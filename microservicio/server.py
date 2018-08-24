import glob
import sys
import MySQLdb
import redis # ==> Make sure to install this library using pip install redis
#import memcache
from datetime import datetime
import time
import cPickle
import hashlib

sys.path.append('gen-py')
#sys.path.insert(0, glob.glob('../../lib/py/build/lib*')[0])

from gifs import ObtenerGifs
from gifs.ttypes import Gifs

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

DB_HOST = 'localhost' 
DB_USER = 'distribuidos_db' 
DB_PASS = 'creoenDios7777' 
DB_NAME = 'proyect_distribuidos_db'
R_SERVER = redis.Redis("localhost")
datos = [DB_HOST, DB_USER, DB_PASS, DB_NAME] 
conn = MySQLdb.connect(*datos) # Conectar a la base de datos 
CURSOR = conn.cursor()

class GifsHandler():
    def __init__(self):
        self.log = {}

    def ping(self):
        print('ping()')

    def obtenerTopGifs(self):
        listGifs = []
        #print("Get gifs")
        query = "SELECT * FROM(SELECT num_accesses FROM my_gifs ORDER BY rand() LIMIT 10) my_gifs ORDER BY num_accesses DESC;" 
        startTime = datetime.now()
        result = self.cache_memcache(query)
        stopTime = datetime.now()
       # print("Tiempo transcurrido: %f"%stopTime-startTime)
        console.log("Tiempo transcurrido: %f"%stopTime-startTime) 
        print (result)
        for res in result:

            listGifs.append(Gifs(int(res[0]), str(res[1]), str(res[2]), int(res[3])))
        
        return listGifs

    def cache_memcache(self, sql, TTL = 360):
        # INPUT 1 : SQL query
        # INPUT 2 : Time To Life
        # OUTPUT  : Array of result
        
        # Create a hash key
        tiempo = time.strftime("%H:%M")
        hash = hashlib.sha224(tiempo).hexdigest()
        
        key = "tiempo_cache:" + hash
        #print ("Created Key\t : %s" % key)

        # Check if data is in cache.
        if (R_SERVER.get(key)):
            #print ("This was return from memcached")    
            return cPickle.loads(R_SERVER.get(key))
        else:
            # Do MySQL query   
            CURSOR.execute(sql)
            data = CURSOR.fetchall()
            
            # Put data into cache for 1 hour
            R_SERVER.set(key, cPickle.dumps(data) )
            R_SERVER.expire(key, TTL)

            #print ("Set data redis and return the data")
            return cPickle.loads(R_SERVER.get(key))


if __name__ == '__main__':
    # START TIME
    startTime = datetime.now()
    handler = GifsHandler()
    processor = ObtenerGifs.Processor(handler)
    transport = TSocket.TServerSocket(host='localhost', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    # You could do one of these for a multithreaded server
    # server = TServer.TThreadedServer(
    #     processor, transport, tfactory, pfactory)

    server.serve()
