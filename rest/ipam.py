"""IPAM API module. Provides network management for devices"""
__author__ = "Zacharias El Banna"
__version__ = "18.05.31GA"
__status__ = "Production"
__add_globals__ = lambda x: globals().update(x)

from sdcp.core.common import DB

#
#
def list(aDict):
 """Function docstring for list: lists networks

 Args:

 Output:
 """
 ret = {}
 with DB() as db:
  dhcp = db.do("SELECT parameter,value FROM settings WHERE section = 'dhcp'")
  ret['dhcp'] = db.get_dict('parameter') if dhcp > 0 else None
  ret['xist']    = db.do("SELECT id, CONCAT(INET_NTOA(network),'/',mask) AS netasc, INET_NTOA(gateway) AS gateway, description, mask, network FROM ipam_networks ORDER by network")
  ret['networks'] = db.get_rows()
 return ret

#
#
def info(aDict):
 """Function docstring for info TBD

 Args:
  - id (required)
  - network (optional)
  - description (optional)
  - mask (optional)
  - gateway (optional)
  - reverse_zone_id (optional)

 Output:
 """
 ret = {}
 args = aDict
 id = args.pop('id','new')
 op = args.pop('op',None)
 with DB() as db:
  if op == 'update':
   from struct import unpack
   from socket import inet_aton
   def GL_ip2int(addr):
    return unpack("!I", inet_aton(addr))[0]

   # Check gateway
   low   = GL_ip2int(args['network'])
   high  = low + 2**(32-int(args['mask'])) - 1
   try:    gwint = GL_ip2int(args['gateway'])
   except: gwint = 0
   if not (low < gwint and gwint < high):
    gwint = low + 1
    ret['info'] = "illegal gateway"
   args['gateway'] = str(gwint)
   args['network']  = str(low)
   if id == 'new':
    ret['update'] = db.insert_dict('ipam_networks',args,'ON DUPLICATE KEY UPDATE id = id')
    id = db.get_last_id() if ret['update'] > 0 else 'new'
   else:
    ret['update'] = db.update_dict('ipam_networks',args,'id=%s'%id)

  if not id == 'new':
   ret['xist'] = db.do("SELECT id, mask, description, INET_NTOA(network) AS network, INET_NTOA(gateway) AS gateway, reverse_zone_id FROM ipam_networks WHERE id = %s"%id)
   ret['data'] = db.get_row()
  else:
   ret['data'] = { 'id':'new', 'network':'0.0.0.0', 'mask':'24', 'gateway':'0.0.0.0', 'description':'New' }
 from sdcp.rest.dns import domain_ptr_list
 ret['domains'] = domain_ptr_list({'prefix':ret['data']['network']})
 ret['domains'].append({'id':'NULL','name':None,'server':None})
 return ret

#
#
def inventory(aDict):
 """Function docstring for inventory: Allocation of IP addresses within a network.

 Args:
  - network (required)

 Output:
 """
 ret = {}
 with DB() as db:
  db.do("SELECT mask, network, INET_NTOA(network) as netasc, gateway, INET_NTOA(gateway) as gwasc FROM ipam_networks WHERE id = {}".format(aDict['network']))
  network = db.get_row()
  ret['start']  = network['network']
  ret['no']     = 2**(32-network['mask'])
  ret['mask']   = network['mask']
  ret['network'] = network['netasc']
  ret['gateway']= network['gwasc']
  ret['xist_devices'] = db.do("SELECT ip,id,hostname,0 AS gateway FROM devices WHERE ipam_id = {} ORDER BY ip".format(aDict['network']))
  ret['devices'] = db.get_dict('ip')
  gw = ret['devices'].get(network['gateway'])
  if gw:
   gw['gateway'] = 1
  else:
   ret['devices'][network['gateway']] = {'id':None,'ip':network['gateway'],'hostname':'gateway','gateway':1}
 return ret

#
#
def find(aDict):
 """Function docstring for find TBD

 Args:
  - network (required)
  - consecutive (optional)

 Output:
 """
 from struct import pack
 from socket import inet_ntoa
 def GL_int2ip(addr):
  return inet_ntoa(pack("!I", addr))

 consecutive = int(aDict.get('consecutive',1))
 with DB() as db:
  db.do("SELECT network, INET_NTOA(network) as netasc, mask FROM ipam_networks WHERE id = {}".format(aDict['network']))
  net = db.get_row()
  db.do("SELECT ip FROM devices WHERE ipam_id = {}".format(aDict['network']))
  iplist = db.get_dict('ip')
 network = int(net.get('network'))
 start  = None
 ret    = { 'network':net['netasc'] }
 for ip in range(network + 1, network + 2**(32-int(net.get('mask')))-1):
  if iplist.get(ip):
   start = None
  elif not start:
   count = consecutive
   if count > 1:
    start = ip
   else:
    ret['ip'] = GL_int2ip(ip)
    break
  else:
   if count == 2:
    ret['start'] = GL_int2ip(start)
    ret['end'] = GL_int2ip(start + consecutive - 1)
    break
   else:
    count = count - 1
 return ret

#
#
def delete(aDict):
 """Function docstring for delete TBD

 Args:
  - id (required)

 Output:
 """
 ret = {}
 with DB() as db:
  ret['devices'] = db.do("DELETE FROM devices WHERE ipam_id = " + aDict['network'])
  ret['deleted'] = db.do("DELETE FROM ipam_networks WHERE id = " + aDict['network'])
 return ret
 
#
#
def allocate_ip(aDict):
 """ Function allocate IP relative a specific network.

 Args:
  - ip (required)
  - network (required)

 Output:
  - valid (boolean) Indicates valid within network
  - success (boolean)
 """
 ret = {'success':True}
 with DB() as db:
  ret['valid'] = (db.do("SELECT network FROM ipam_networks WHERE id = {0} AND INET_ATON('{1}') > network AND INET_ATON('{1}') < (network + POW(2,(32-mask))-1)".format(aDict['network'],aDict['ip'])) == 1)
 return ret

#
#
def id_to_ip(aDict):
 """ Funtion returns mapping between IPAM id and ip,network_id

 Args:
  - id (required)

 Output:
  - ip
  - ipasc
  - network
 """
 return {}

#
#
def discover(aDict):
 """ Function discovers IP:s that answer to ping within a certain network. A list of such IP:s are returned for inspection

 Args:
  - network (required)
  - simultaneous (optional). Simultaneouse threads

 Output:
  - addresses. list of ip:s and ip_int pairs that answer to ping
 """
 from threading import Thread, BoundedSemaphore
 from struct import pack
 from socket import inet_ntoa
 from os import system
 def GL_int2ip(addr):
  return inet_ntoa(pack("!I", addr))

 def __detect_thread(aIPint,aIPs,aSema):
  __ip = GL_int2ip(aIPint)
  if system("ping -c 1 -w 1 %s > /dev/null 2>&1"%(__ip)) == 0:
   aIPs.append({'ip':aIPint,'ipasc':__ip})
  aSema.release()
  return True

 addresses = []
 simultaneous = int(aDict.get('simultaneous',20))
 ret = {'addresses':addresses}

 with DB() as db:
  db.do("SELECT network,mask FROM ipam_networks WHERE id = '%s'"%aDict['network'])
  net = db.get_row()
  ip_start = net['network'] + 1
  ip_end   = net['network'] + 2**(32 - net['mask']) - 1
  ret.update({'start':{'ip':ip_start,'ipasc':GL_int2ip(ip_start)},'end':{'ip':ip_end,'ipasc':GL_int2ip(ip_end)}})

 try:
  sema = BoundedSemaphore(simultaneous)
  for ip in range(ip_start,ip_end):
   sema.acquire()
   t = Thread(target = __detect_thread, args=[ip, addresses, sema])
   t.name = "Detect %s"%ip
   t.start()
  for i in range(simultaneous):
   sema.acquire()
 except Exception as err:
  ret['error']   = str(err)

 return ret
