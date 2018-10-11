"""Module docstring.

Avocent PDU module

"""
__author__  = "Zacharias El Banna"
__version__ = "5.2GA"
__status__  = "Production"
__type__    = "pdu"

from .generic import Device as GenericDevice

######################################## PDU ########################################

class Device(GenericDevice):

 _getstatemap = { '1':'off', '2':'on' }
 _setstatemap = { 'off':'3', 'on':'2', 'reboot':'4' }

 @classmethod
 def get_functions(cls):
  return ['manage']

 @classmethod
 def get_outlet_state(cls,state):
  return cls._getstatemap.get(state,'unknown')

 @classmethod
 def set_outlet_state(cls,state):
  return cls._setstatemap.get(state,'1')

 def __init__(self, aIP, aSettings):
  GenericDevice.__init__(self,aIP, aSettings)

 def __str__(self):
  return "Avocent[%s]: %s"%(__type__,GenericDevice.__str__(self))

 def set_state(self,slot,unit,state):
  from netsnmp import VarList, Varbind, Session
  try:
   from json import dumps
   oid = ".1.3.6.1.4.1.10418.17.2.5.5.1.6.1.{}.{}".format(slot,unit)
   op  = Device.set_outlet_state(state)
   print("snmpset -v2c -c %s %s %s i %s"%(self._settings['snmp']['write_community'], self._ip, oid, op))
   session = Session(Version = 2, DestHost = self._ip, Community = self._settings['snmp']['write_community'], UseNumeric = 1, Timeout = 100000, Retries = 2)
   setobj = VarList(Varbind(oid , op ,"INTEGER"))
   res = session.set(setobj)
   print("RES:%s"%str(res))
   self.log_msg("Avocent - {0} set state: {1} on {2}.{3}".format(self._ip,state,slot,unit))
   return {'res':'OK'}
  except Exception as exception_error:
   self.log_msg("Avocent - error setting state: " + str(exception_error))
   print(session.__dict__) 
   return {'res':'NOT_OK', 'info':str(exception_error) }

 def set_name(self,slot,unit,name):
  from netsnmp import VarList, Varbind, Session
  try:
   name = name[:16]
   session = Session(Version = 2, DestHost = self._ip, Community = self._settings['snmp']['write_community'], UseNumeric = 1, Timeout = 100000, Retries = 2)
   setobj = VarList(Varbind("enterprises", "10418.17.2.5.5.1.4.1.{}.{}".format(slot,unit) , name, "OPAQUE"))
   session.set(setobj)
   return "%s.%s:'%s'"%(slot,unit,name)
  except Exception as exception_error:
   self.log_msg("Avocent : error setting name " + str(exception_error))
   return "Error setting name '%s'"%(name)

 def get_state(self,slot,unit):
  from netsnmp import VarList, Varbind, Session
  try:
   stateobj = VarList(Varbind(".1.3.6.1.4.1.10418.17.2.5.5.1.5.1.{}.{}".format(slot,unit)))
   session = Session(Version = 2, DestHost = self._ip, Community = self._settings['snmp']['read_community'], UseNumeric = 1, Timeout = 100000, Retries = 2)
   session.get(stateobj)
   return {'res':'OK', 'state':Device.get_outlet_state(stateobj[0].val) }
  except Exception as e:
   self.log_msg("Avocent : error getting state:" + str(e))
   return {'res':'NOT_OK','info':str(e), 'state':'unknown' }

 #
 #
 def get_slot_names(self):
  from netsnmp import VarList, Varbind, Session
  slots = []
  try:
   slotobjs = VarList(Varbind('.1.3.6.1.4.1.10418.17.2.5.3.1.3'))
   session = Session(Version = 2, DestHost = self._ip, Community = self._settings['snmp']['read_community'], UseNumeric = 1, Timeout = 100000, Retries = 2)
   session.walk(slotobjs)
   for slot in slotobjs:
    slots.append([slot.iid, slot.val.decode()])
  except Exception as exception_error:
   self.log_msg("Avocent : error loading pdu member names " + str(exception_error))
  return slots

 #
 #
 def get_inventory(self):
  from netsnmp import VarList, Varbind, Session
  result = []
  try:
   outletobjs = VarList(Varbind('.1.3.6.1.4.1.10418.17.2.5.5.1.4'))
   stateobjs  = VarList(Varbind('.1.3.6.1.4.1.10418.17.2.5.5.1.5'))
   slotobjs   = VarList(Varbind('.1.3.6.1.4.1.10418.17.2.5.3.1.3'))
   session = Session(Version = 2, DestHost = self._ip, Community = self._settings['snmp']['read_community'], UseNumeric = 1, Timeout = 100000, Retries = 2)
   session.walk(outletobjs)
   session.walk(stateobjs)
   session.walk(slotobjs)
   slotdict  = dict([(var.iid, var.val.decode()) for var in slotobjs])
   for indx,outlet in enumerate(outletobjs,0):
    result.append({'slot':outlet.tag[34:],'unit':outlet.iid,'name':outlet.val.decode(),'state':Device.get_outlet_state(stateobjs[indx].val.decode()),'slotname':slotdict.get(outlet.tag[34:],"unknown")})
  except Exception as exception_error:
   self.log_msg("Avocent : error loading conf " + str(exception_error))
  return result
