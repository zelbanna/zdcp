"""Module docstring.

PowerDNS API module

"""
__author__ = "Zacharias El Banna"                     
__version__ = "17.10.4"
__status__ = "Production"

import sdcp.PackageContainer as PC
from sdcp.core.dbase import DB

#
# Call removes name duplicates.. (assume order by name => duplicate names :-))
#
def cleanup(aDict):
 PC.log_msg("powerdns_cleanup({})".format(aDict))
 with DB(PC.dns['dbname'],'localhost',PC.dns['username'],PC.dns['password']) as db:
  db.do("SELECT id,name,content FROM records WHERE type = 'A' OR type = 'PTR' ORDER BY name")   
  rows = db.get_rows();
  remove = []
  previous = {'content':None,'name':None}
  for row in rows:
   if previous['content'] == row['content'] and previous['name'] == row['name']:
    db.do("DELETE from records WHERE id = '{}'".format(row['id'] if row['id'] > previous['id'] else previous['id']))
    row.pop('id')
    remove.append(row)
   else:
    previous = row
  db.commit()
 return {'removed':remove}

#
# dns top lookups
#
def top(aDict):
 PC.log_msg("powerdns_top({})".format(aDict))
 import sdcp.core.genlib as GL
 count = int(aDict.get('count',10))
 fqdn_top = {}
 fqdn_who = {}
 with open(PC.dns['logfile'],'r') as log:
  for line in log:
   parts = line.split()
   if not parts[5] == 'Remote':
    continue
   fqdn  = parts[8].split('|')[0][1:]
   fqdn_top[fqdn] = fqdn_top.get(fqdn,0)+1
   fqdn_who[fqdn+"#"+parts[6]] = fqdn_who.get(fqdn+"#"+parts[6],0)+1
 from collections import Counter
 top = map(lambda x: {'fqdn':x[0],'count':x[1]}, Counter(fqdn_top).most_common(count))
 who = []
 for item in  Counter(fqdn_who).most_common(count):
  parts = item[0].split('#')
  who.append({'fqdn':parts[0], 'who':parts[1], 'hostname': GL.get_host_name(parts[1]), 'count':item[1]})
 return {'top':top,'who':who }


#
# Return domains name + id
#
def domains(aDict):
 PC.log_msg("powerdns_domains({})".format(aDict))
 with DB(PC.dns['dbname'],'localhost',PC.dns['username'],PC.dns['password']) as db:
  res = db.do("SELECT id, name FROM domains")
  rows = db.get_rows()
 return rows

#
# lookup_a ( name, a_dom_id)
#
def lookup_a(aDict):
 PC.log_msg("powerdns_lookup_a({})".format(aDict))
 ret = {}
 with DB(PC.dns['dbname'],'localhost',PC.dns['username'],PC.dns['password']) as db:
  res = db.do("SELECT name FROM domains WHERE id = '{}'".format(aDict['a_dom_id']))
  ret['domain'] = db.get_row()['name'] if res > 0 else 'unknown'
  ret['exist'] = db.do("SELECT id, content AS ip FROM records WHERE type = 'A' AND domain_id = {} AND name = '{}'".format(aDict['a_dom_id'],"{}.{}".format(aDict['name'],ret['domain'])))
  if ret['exist'] > 0:
   ret.update(db.get_row())
   ret['res']  = 'OK'
  else:
   ret['res']  = 'NOT_OK'
 return ret

#
# lookup_ptr (ip)
#
def lookup_ptr(aDict):
 PC.log_msg("powerdns_lookup_ptr({})".format(aDict))
 import sdcp.core.genlib as GL
 ret = {'arpa':GL.ip2arpa(aDict['ip'])}
 with DB(PC.dns['dbname'],'localhost',PC.dns['username'],PC.dns['password']) as db:
  res = db.do("SELECT id FROM domains WHERE name = '{}'".format(ret['arpa']))
  ret['ptr_dom_id'] = db.get_row()['id']
  ret['exist'] = db.do("SELECT id, content AS fqdn FROM records WHERE type = 'PTR' AND domain_id = {} AND name = '{}'".format(ret['ptr_dom_id'],GL.ip2ptr(aDict['ip'])))
  if ret['exist'] > 0:
   ret.update(db.get_row())
   ret['res']  = 'OK'
  else:
   ret['res']  = 'NOT_OK'
 return ret

#
# update( ip, name, a_dom_id ,[ a_id, ptr_id ] )
#
def update(aDict):
 PC.log_msg("powerdns_update({})".format(aDict))
 import sdcp.core.genlib as GL
 from time import strftime
 serial  = strftime("%Y%m%d%H")
 ptr     = GL.ip2ptr(aDict['ip'])
 retvals = {}
 with DB(PC.dns['dbname'],'localhost',PC.dns['username'],PC.dns['password']) as db:
  res = db.do("SELECT id,name FROM domains WHERE id = {} OR name = '{}'".format(aDict['a_dom_id'],ptr.partition('.')[2]))
  domains = db.get_rows()
  if res == 2:
   domain     = domains[0]['name'] if domains[1]['name'] == ptr else domains[1]['name']
   ptr_dom_id = domains[1]['id']   if domains[1]['name'] == ptr else domains[0]['id']
  else:
   domain     = domains[0]['name']
   ptr_dom_id = None
  fqdn    = aDict['name'] + "." + domain

  if str(aDict.get('a_id','0')) != '0':
   retvals['a_op'] = "update"
   retvals['a_id'] = aDict['a_id']
   db.do("UPDATE records SET name = '{}', content = '{}', change_date='{}' WHERE id ='{}'".format(fqdn,aDict['ip'],serial,aDict['a_id']))
  else:
   retvals['a_op'] = "insert"
   db.do("INSERT INTO records (domain_id,name,type,content,ttl,change_date) VALUES('{}','{}','A','{}',3600,'{}')".format(aDict['a_dom_id'],fqdn,aDict['ip'],serial))
   retvals['a_id'] = db.get_last_id()

  if str(aDict.get('ptr_id','0')) != '0':
   retvals['ptr_id'] = aDict['ptr_id']
   retvals['ptr_op'] = "update"
   db.do("UPDATE records SET name = '{}', content = '{}', change_date='{}' WHERE id ='{}'".format(ptr,fqdn,serial,aDict['ptr_id']))
  elif ptr_dom_id:
   retvals['ptr_op'] = "insert"
   db.do("INSERT INTO records (domain_id,name,type,content,ttl,change_date) VALUES('{}','{}','PTR','{}',3600,'{}')".format(ptr_dom_id,ptr,fqdn,serial))
   retvals['ptr_id'] = db.get_last_id()

  db.commit()
 return retvals

#
# get_records(type ['A'|'PTR'])
#
def get_records(aDict):
 PC.log_msg("powerdns_get_records({})".format(aDict))
 ret = {}
 tune = aDict['type'].upper() if aDict.get('type') else "PTR' OR type = 'A"
 with DB(PC.dns['dbname'],'localhost',PC.dns['username'],PC.dns['password']) as db:
  ret['count'] = db.do("SELECT id, domain_id AS dom_id, name, type, content FROM records WHERE type = '{}' ORDER BY name".format(tune))
  ret['records'] = db.get_rows()
 return ret

#
#
#
def remove(aDict):
 PC.log_msg("powerdns_remove({})".format(aDict))
 ret = {}
 with DB(PC.dns['dbname'],'localhost',PC.dns['username'],PC.dns['password']) as db:
  if aDict.get('a_id','0') != '0':
   ret['a'] = db.do("DELETE FROM records WHERE id = '{}' and type = 'A'".format(aDict['a_id']))
  if aDict.get('ptr_id','0') != '0':
   ret['ptr'] = db.do("DELETE FROM records WHERE id = '{}' and type = 'PTR'".format(aDict['ptr_id']))
  db.commit()
 ret['res'] = 'OK' if ret.get('a',0) > 0 or ret.get('ptr',0) > 0 else 'NOT_OK'
 return ret