"""Module docstring.

phpIPAM API module

"""
__author__ = "Zacharias El Banna"
__version__ = "17.10.4"
__status__ = "Production"

import sdcp.PackageContainer as PC
import sdcp.core.genlib as GL
from sdcp.core.dbase import DB

#
# Should be subnets(target, arg)
#
def subnets(aDict):
 PC.log_msg("phpipam_subnet({})".format(aDict))
 with DB(PC.ipam['dbname'],'localhost',PC.ipam['username'],PC.ipam['password']) as db:
  db.do("SELECT subnets.id, subnet, mask, subnets.description, name as section_name, sectionId as section_id FROM subnets INNER JOIN sections on subnets.sectionId = sections.id") 
  ret = db.get_rows()
 return ret

#
# lookup(ip,ipam_sub_id)
#
def lookup(aDict):
 PC.log_msg("phpipam_lookup({})".format(aDict))
 with DB(PC.ipam['dbname'],'localhost',PC.ipam['username'],PC.ipam['password']) as db:
  xist = db.do("SELECT id, dns_name as fqdn, PTR as ptr_id FROM ipaddresses WHERE ip_addr = INET_ATON('{0}') AND subnetId = {1}".format(aDict['ip'],aDict.get('ipam_sub_id')))
  if xist > 0:
   ret = db.get_row()  
   ret['res'] = 'OK'
  else:
   ret = { 'res':'NOT_OK', 'id':'0' }
 return ret
#
# update( ipam_sub_id, ipam_id, ip, fqdn, ptr_id )
#
def update(aDict):
 PC.log_msg("phpipam_update({})".format(aDict))
 ret = {}
 with DB(PC.ipam['dbname'],'localhost',PC.ipam['username'],PC.ipam['password']) as db:
  if aDict.get('ipam_id','0') != '0':
   db.do("UPDATE ipaddresses SET PTR = '{}', dns_name = '{}' WHERE id = '{}'".format(aDict['ptr_id'],aDict['fqdn'],aDict['ipam_id']))
   ret['ipam_op'] = 'update'
   ret['ipam_id'] = aDict['ipam_id']
  else:
   ipint = GL.ip2int(aDict['ip'])
   xist  = db.do("SELECT id FROM ipaddresses WHERE ip_addr = '{0}' AND subnetId = {1}".format(ipint,aDict['ipam_sub_id']))
   if xist > 0:
    entry = db.get_row()
    db.do("UPDATE ipaddresses SET PTR = '{}', dns_name = '{}' WHERE id = '{}'".format(aDict['ptr_id'],aDict['fqdn'],entry['id']))
    ret['ipam_op'] = 'update_existed'
    ret['ipam_id'] = entry['id']
   else:
    db.do("INSERT INTO ipaddresses (subnetId,ip_addr,dns_name,PTR) VALUES('{}','{}','{}','{}')".format(aDict['ipam_sub_id'],ipint,aDict['fqdn'],aDict['ptr_id']))
    ret['ipam_op'] = "insert"
    ret['ipam_id'] = db.get_last_id()
  db.commit()
 return ret

#
# new(ip, fqdn, ipam_sub_id)
#
def new(aDict):
 PC.log_msg("phpipam_new({})".format(aDict))
 ret = {'res':'NOT_OK'}
 with DB(PC.ipam['dbname'],'localhost',PC.ipam['username'],PC.ipam['password']) as db:
  ret['xist'] = db.do("SELECT id FROM ipaddresses WHERE ip_addr = INET_ATON('{0}') AND subnetId = {1}".format(aDict['ip'],aDict['ipam_sub_id']))
  if ret['xist'] == 0:
   ret['insert'] = db.do("INSERT INTO ipaddresses (subnetId,ip_addr,dns_name) VALUES('{}',INET_ATON('{}'),'{}')".format(aDict['ipam_sub_id'],aDict['ip'],aDict['fqdn']))
   ret['id']  = db.get_last_id()
   ret['res'] = 'OK'
   db.commit()
  else:
   data = db.get_row()
   ret['id'] = data['id']
 return ret

#
# remove(ipam_id)
#
def remove(aDict):
 PC.log_msg("phpipam_remove({})".format(aDict))
 with DB(PC.ipam['dbname'],'localhost',PC.ipam['username'],PC.ipam['password']) as db:
  ires = db.do("DELETE FROM ipaddresses WHERE id = '{}'".format(aDict['ipam_id']))
  db.commit()
 return { 'res':'OK', 'info':(ires > 0) }

#
# 
#
def get_addresses(aDict):
 PC.log_msg("phpipam_get_addresses({})".format(aDict))
 with DB(PC.ipam['dbname'],'localhost',PC.ipam['username'],PC.ipam['password']) as db:
  ires  = db.do("SELECT id, ip_addr AS ip, INET_NTOA(ip_addr) as ipasc, subnetId as ipam_sub_id, description, dns_name AS fqdn FROM ipaddresses ORDER BY ip_addr")
  irows = db.get_rows()
 return {'addresses':irows, 'res':'OK', 'info':ires }

#
# Check single IP is available in subnet
#
def free(aDict):
 PC.log_msg("phpipam_free({})".format(aDict))
 ret = {'res':'OK' } 
 with DB(PC.ipam['dbname'],'localhost',PC.ipam['username'],PC.ipam['password']) as db:
  xist = db.do("SELECT dns_name FROM ipaddresses WHERE ip_addr = INET_ATON('{}') and subnetId = {}".format(aDict['ip'],aDict['ipam_sub_id']))
  if xist > 0:
   ret['res'] = 'NOT_OK'
   ret['info'] = db.get_row()['dns_name']
 return ret

#
# find(ipam_sub_id, consecutive)
#
# - Find X consecutive ip from a particular subnet-id
# ipam_sub_id: X
# consecutive: X

def find(aDict):
 PC.log_msg("phpipam_find({})".format(aDict))
 sub_id = aDict.get('ipam_sub_id')
 with DB(PC.ipam['dbname'],'localhost',PC.ipam['username'],PC.ipam['password']) as db:
  db.do("SELECT subnet, INET_NTOA(subnet) as subasc, mask FROM subnets WHERE id = {}".format(sub_id))
  sub = db.get_row()
  db.do("SELECT ip_addr FROM ipaddresses WHERE subnetId = {}".format(sub_id))
  iplist = db.get_rows_dict('ip_addr')
 subnet = int(sub.get('subnet'))
 start  = None
 ret    = { 'subnet':sub['subasc'], 'res':'NOT_OK' }
 for ip in range(subnet + 1, subnet + 2**(32-int(sub.get('mask')))-1):
  if iplist.get(str(ip)):
   start = None
  elif not start:
   count = int(aDict.get('consecutive',1))
   if count > 1:
    start = ip
   else:
    ret['ip'] = GL.int2ip(ip)
    ret['res'] = 'OK'
    break
  else:
   if count == 2:
    ret['start'] = GL.int2ip(start)
    ret['end'] = GL.int2ip(start+int(aDict.get('consecutive'))-1)
    ret['res'] = 'OK'
    break
   else:
    count = count - 1
 return ret