"""AWX REST module."""
__author__ = "Zacharias El Banna"
__version__ = "1.0GA"
__status__ = "Production"
__add_globals__ = lambda x: globals().update(x)

from zdcp.devices.awx import Device
from zdcp.SettingsContainer import SC

#
#
def inventory(aDict):
 """Function main produces an inventory list for a device id

 Args:
  - device_id (optional required)
  - node (optional required)

 Output:
  - inventories
 """
 if not aDict.get('node'):
  from zdcp.rest.device import to_node
  ret = to_node({'id':aDict['device_id']})
  ret['id'] = aDict['device_id']
 else:
  from zdcp.rest.device import from_node
  ret = from_node({'node':aDict['node']})
 controller = Device(SC['node'][ret['node']])
 controller.auth({'username':SC['awx']['username'],'password':SC['awx']['password'],'mode':'basic'})
 ret['inventories'] = controller.inventories()
 return ret

#
#
def inventory_delete(aDict):
 """Function deletes inventory with id x

 Args:
  - node (required)
  - id (required)

 Output:
 """
 from zdcp.rest.device import to_node
 controller = Device(SC['node'][aDict['node']])
 controller.auth({'username':SC['awx']['username'],'password':SC['awx']['password'],'mode':'basic'})
 res = controller.call("inventories/%(id)s/"%aDict,None,"DELETE")
 ret = {'result':"deleted" if res['code'] == 204 else res['info']['x-api-code']}
 return ret

#
#
def inventory_hosts(aDict):
 """Function produces list of hosts for a specific inventory

 Args:
  - node (required)
  - id (required)

 Output:
 """
 ret = {}
 controller = Device(SC['node'][aDict['node']])
 controller.auth({'username':SC['awx']['username'],'password':SC['awx']['password'],'mode':'basic'})
 ret = controller.call("inventories/%(id)s/hosts/"%aDict).get('data')
 return ret

#
#
def inventory_sync(aDict):
 """Function retrieves and matches AWX hosts with local ones and updates missing

 Args:
  - node (required)
  - id (required)
  - search (required)
  - field (required)

 Output:
  - result (boolean)
  - info (optional)
 """
 from zdcp.rest.device import list as device_list
 hosts = {}
 devices = device_list({'search':aDict['search'],'field':aDict['field']})['data']
 ret = {'devices':devices,'result':'OK','extra':[]}
 controller = Device(SC['node'][aDict['node']])
 controller.auth({'username':SC['awx']['username'],'password':SC['awx']['password'],'mode':'basic'})
 try:
  next = "hosts"
  while next:
   data = controller.call(next)['data']
   for row in data['results']:
    info = {k:row.get(k) for k in ('id','name','url','inventory','description','enabled','id')}
    if row['instance_id'] == "":
     ret['extra'].append({k:row.get(k) for k in ('id','name')})
    else:
     hosts[row['instance_id']] = {k:row.get(k) for k in ('id','name','url','inventory','description','enabled','instance_id')}
   next = data['next']
  for dev in devices:
   args = {"name": "%s.%s"%(dev['hostname'],dev['domain']),"description": "%(model)s (%(ipasc)s)"%dev,"inventory": aDict['id'],"enabled": True,"instance_id": dev['id'], "variables": "" }

   host = hosts.get(str(dev['id']))
   res = controller.call("hosts/",args,"POST") if not host else controller.call("hosts/%(id)s/"%host,args,"PATCH")
   dev['sync'] = {'code':res['code'],'id':res['data']['id']}
 except Exception as e:
  ret['info'] = str(e)
  ret['result'] = 'NOT_OK'
 return ret

#
#
def inventory_delete_list(aDict):
 """Deletes a host

 Args:
  - node (required)
  - id (required)
  - host_xx (required)

 Output:
 """
 ret = {'hosts':{}}
 node = aDict.pop('node',None)
 id   = aDict.pop('id',None)
 controller = Device(SC['node'][node])
 controller.auth({'username':SC['awx']['username'],'password':SC['awx']['password'],'mode':'basic'})
 args = aDict
 for host in aDict.keys():
  if host[0:5] == 'host_':
   host_id = host[5:]
   res = controller.call("hosts/%s/"%host_id,None,"DELETE")
   ret['hosts'][host_id] = "OK" if res['code'] == 204 else res['info']['x-api-code']
 return ret

########################################## Hosts ##########################################
#
#
def hosts_list(aDict):
 """Function retrieves all hosts from AWX node

 Args:
  - node (required)

 Output:
 """
 controller = Device(SC['node'][aDict['node']])
 controller.auth({'username':SC['awx']['username'],'password':SC['awx']['password'],'mode':'basic'})
 return controller.hosts()