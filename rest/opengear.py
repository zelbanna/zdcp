"""Opengear REST module. PRovides interworking with (through SNMP) opengear console server"""
__author__ = "Zacharias El Banna"
__add_globals__ = lambda x: globals().update(x)

#
#
def inventory(aDict, aCTX):
 """Function docstring for inventory TBD

 Args:
  - ip (required)

 Output:
 """
 from zdcp.devices.opengear import Device
 console = Device(aDict['ip'],aCTX)
 return console.get_inventory()
