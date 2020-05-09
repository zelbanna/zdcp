"""
NoDNS API module. Backend in case no DNS is available, only on master node, records can be exported :-)

"""
__author__ = "Zacharias El Banna"
__add_globals__ = lambda x: globals().update(x)
__type__ = "DNS"

#################################### Domains #######################################
#
#
def domain_list(aCTX, aArgs):
 """Function returns all domains by this DNS server

 Args:

 Output:
  - count
  - data. List of domains
  - endpoint
 """
 ret = {}
 with aCTX.db as db:
  ret['count']   = db.do("SELECT foreign_id AS id, name,'MASTER' AS type,'127.0.0.1' AS master,0 AS notified_serial FROM domains JOIN servers ON domains.server_id = servers.id AND servers.node = '%s' JOIN service_types AS st ON servers.type_id = st.id AND st.service = 'nodns'"%aCTX.node)
  ret['data'] = db.get_rows()
  ret['endpoint'] = aCTX.config.get('nodns',{}).get('endpoint','127.0.0.1:53')
 return ret

#
#
def domain_info(aCTX, aArgs):
 """ Function provide domain info and modification

 TODO: Bypass DNS API here and do the insert locally, return 'found' == true instead :-), do proper DB exchange for the domain cache then

 Args:
  - id (required)
  - name (required)
  - type (required)
  - master (required)
  - op (optional)

 Output:
 """
 ret = {'data':{'id':aArgs['id'],'name':aArgs.get('name','new_name'),'master':'127.0.0.1','type':'MASTER', 'serial':0 }}
 op = aArgs.pop('op',None)
 aArgs.pop('endpoint',None)
 with aCTX.db as db:
  if op == "update":
   if not aArgs['id'] == 'new':
    args = {}
    if 'type' in aArgs:
     args['kind'] = aArgs['type'].lower().capitalize()
    if 'master' in aArgs:
     args['master'] = aArgs['master'].upper()
    ret['update'] = (db.update_dict('domains',aArgs,'id=%s'%id) == 1)
   else:
    ret['insert'] = True
    db.do("SELECT max(id) + 1 AS next FROM domains")
    foreign_id = db.get_val('next')
    ret['data']['id'] = foreign_id if foreign_id else 1
  elif aArgs['id'] != 'new':
   db.do("SELECT name FROM domains WHERE foreign_id = '%s'"%aArgs['id'])
   ret['data']['name'] = db.get_val('name')
  ret['endpoint'] = aCTX.config.get('nodns',{}).get('endpoint','127.0.0.1:53')
 return ret

#
#
def domain_delete(aCTX, aArgs):
 """ Let cache management handle this, NO OP

 Args:
  - id (required)

 Output:
  - records (number of removed records)
  - domain: True or false, did op succeed
 """
 return {'deleted':True,'records':0,'status':'OK'}

#################################### Records #######################################
#
#
def record_list(aCTX, aArgs):
 """ List device information where we have something -> i.e. on .local devices

 Args:
  - type (optional)
  - domain_id (optional)

 Output:
 """
 ret = {}
 select = []
 with aCTX.db as db:
  if 'domain_id' in aArgs:
   select.append("domain_id = %s"%aArgs['domain_id'])
  if 'type' in aArgs:
   select.append("type = '%s'"%aArgs['type'].upper())
  tune = " WHERE %s"%(" AND ".join(select)) if len(select) > 0 else ""
  ret['count'] = db.do("SELECT domain_id, name, content,type,ttl,DATE_FORMAT(serial,'%%Y%%m%%d%%H%%i') AS serial FROM domain_records %s ORDER BY type, name ASC"%tune)
  ret['data'] = db.get_rows()
 return ret

#
#
def record_info(aCTX, aArgs):
 """if new, do a mapping of either arpa or ip, else show ip info

 Args:
  - name (required)
  - domain_id (required)
  - type (required)
  - op (optional) 'new'/'info'/'insert'/'update'
  - content (optional)
  - ttl (optional)

 Output:
 """
 op = aArgs.pop('op',None)
 aArgs.pop('serial',None)
 ret = {}
 with aCTX.db as db:
  if op == 'new':
   ret = {'status':'OK','data':{ 'domain_id':aArgs['domain_id'],'name':'key','content':'value','type':'type-of-record','ttl':'3600' }}
  elif op == 'info':
   if (db.do("SELECT domain_id,name,content,type,ttl,DATE_FORMAT(serial,'%%Y%%m%%d%%H%%i') AS serial FROM domain_records WHERE name = '%s' AND domain_id = %s AND type = '%s'"%(aArgs['name'],aArgs['domain_id'],aArgs['type'])) > 0):
    ret = {'status':'OK','data':db.get_row()}
   else:
    ret = {'status':'NOT_OK','data':None}
  else:
   aArgs.update({'ttl':aArgs.get('ttl','3600'),'type':aArgs['type'].upper()})
   # Remove trailing dot in database, just like PowerDNS
   if aArgs['name'][-1] == '.':
    aArgs['name'] = aArgs['name'][:-1]
   ret['data'] = aArgs
   if op == 'insert':
    ret['status'] = 'OK' if (db.do("INSERT INTO domain_records (domain_id,name,content,type,ttl) VALUES(%(domain_id)s,'%(name)s','%(content)s','%(type)s',%(ttl)s)"%aArgs) > 0) else 'NOT_OK'
   elif op == 'update':
    ret['status'] = 'OK' if (db.do("UPDATE domain_records SET content = '%(content)s', ttl = %(ttl)s WHERE domain_id = %(domain_id)s AND name = '%(name)s' AND type = '%(type)s'"%aArgs) > 0) else 'NOT_OK'
 return ret

#
#
def record_delete(aCTX, aArgs):
 """ Function deletes records info per type

 Args:
  - domain_id (required)
  - namne (required)
  - type (required)

 Output:
  - deleted
  - status
 """
 ret = {}
 with aCTX.db as db:
  ret['deleted'] = (db.do("DELETE FROM domain_records WHERE domain_id = %(domain_id)s AND name = '%(name)s' AND type = '%(type)s'"%aArgs) > 0)
  ret['status'] = 'OK' if ret['deleted'] else 'NOT_OK';
 return ret

############################### Tools #################################
#
# TODO: do loads of inserts, one for every device
#
def sync(aCTX, aArgs):
 """ Synchronize device table and recreate records, write resolv info to NoDNS file

 Args:
  - id (required), server_id

 Output:
 """
 ret = {'update':0,'insert':0,'removed':0,'status':'OK'}
 with aCTX.db as db:
  # Write to local 'hosts' file or similar
  if aCTX.config.get('nodns',{}).get('file'):
   from os import linesep
   try:
    with open(aCTX.config['nodns']['file'],'w+') as ndfile:
     db.do("SELECT name, content FROM domain_records WHERE type = 'A'")
     ndfile.write(linesep.join("%s\t%s"%(rec['content'],rec['name']) for rec in db.get_rows() ))
   except Exception as e:
    aCTX.log("Error writing NoDNS file: %s"%str(e))
 return ret

#
#
def status(aCTX, aArgs):
 """ Function returns server status

 Args:

 Output:
 """
 return {'status':'OK'}

#
#
def statistics(aCTX, aArgs):
 """ Function returns server statistics

 Args:

 Output:
 """
 return {'status':'OK','statistics':{}}

#
#
def restart(aCTX, aArgs):
 """Function provides restart capabilities of service

 Args:

 Output:
  - code
  - output
  - status 'OK'/'NOT_OK'
 """
 return {'status':'OK','code':0,'output':""}

#
#
def parameters(aCTX, aArgs):
 """ Function provides parameter mappings of anticipated config vs actual

 Args:

 Output:
  - status
  - parameters
 """
 settings = aCTX.config.get('nodns',{})
 params = ['file']
 return {'status':'OK' if all(p in settings for p in params) else 'NOT_OK','parameters':{p:settings.get(p) for p in params}}
