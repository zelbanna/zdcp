import React, { Component, Fragment } from 'react'
import { rest_call, rnd } from './infra/Functions.js';
import { Spinner, StateMap, InfoColumns, Result, ContentReport } from './infra/UI.jsx';
import { CheckboxInput, TextInput, TextLine, SelectInput } from './infra/Inputs.jsx';
import { AddButton, BackButton, NetworkButton, DeleteButton,ForwardButton, GoButton, InfoButton, LinkButton, ReloadButton, SaveButton, SearchButton, SyncButton, HrefButton, UnlinkButton, TextButton } from './infra/Buttons.jsx';

// *************** List ****************
//
export class List extends Component{
 componentDidMount(){
  rest_call('api/interface/list',{device_id:this.props.device_id}).then(result => this.setState(result));
 }

 changeContent = (elem) => this.props.changeSelf(elem);

 deleteList = (interface_id,name) => (window.confirm('Really delete interface ' + name) && rest_call('api/interface/delete', {interfaces:[interface_id]}).then(result => (result.deleted > 0) && this.setState({data:this.state.data.filter(row => (row.interface_id !== interface_id)),result:JSON.stringify(result.interfaces)})))

 cleanUp = () => (window.confirm('Clean up empty interfaces?') && rest_call('api/interface/delete',{device_id:this.props.device_id}).then(result => this.componentDidMount()))

 discoverInterfaces = () => (window.confirm('Rediscover interfaces?') && rest_call('api/interface/snmp',{device_id:this.props.device_id}).then(result => this.componentDidMount()))

 listItem = (row) => [row.interface_id,row.mac,(row.ip) ? `${row.ip} (${row.ipam_id})` : '-',row.snmp_index,row.name,row.description,row.class,
   (row.connection_id) ? <HrefButton key={'conn_btn_'+row.interface_id} text={row.connection_id} onClick={() => this.changeContent(<ConnectionInfo key={'connection_info_' + row.connection_id} id={row.connection_id} device_id={this.props.device_id} changeSelf={this.changeContent} />)} title='Connection information' /> : '-',
   <div className='states'><StateMap key={'il_if_state_' + row.interface_id} state={row.if_state} /><StateMap key={'il_ip_state_' + row.interface_id}state={row.ip_state} /></div>,<Fragment key={'il_btns_'+row.interface_id}>
    <InfoButton key={'il_btn_info_' + row.interface_id} onClick={() => this.changeContent(<Info key={'interface_info_' + row.interface_id} interface_id={row.interface_id} changeSelf={this.props.changeSelf} />)} title='Interface information' />
    <DeleteButton key={'il_btn_del_' + row.interface_id} onClick={() => this.deleteList(row.interface_id,row.name)} title='Delete interface' />
    {!row.connection_id && <LinkButton key={'il_btn_sync_' + row.interface_id} onClick={() => this.changeContent(<Info key={'interface_info_' + row.interface_id} op='device' interface_id={row.interface_id} name={row.name} changeSelf={this.props.changeSelf} />)} title='Connect interface' />}
   </Fragment>]

 render(){
  if (this.state) {
   return <ContentReport key='il_cl' header='Interfaces' thead={['ID','MAC','IP','SNMP','Name','Description','Class','Link','','']} trows={this.state.data} listItem={this.listItem} result={this.state.result}>
    <ReloadButton key='il_btn_reload' onClick={() => this.componentDidMount()} />
    <AddButton key='il_btn_add' onClick={() => this.changeContent(<Info key={'interface_info_' + rnd()} device_id={this.props.device_id} interface_id='new' changeSelf={this.props.changeSelf} />) } title='Add interface' />
    <TextButton key='il_btn_disc' onClick={() => this.discoverInterfaces()} title='Discover device interfaces' text='Discover' />
    <TextButton key='il_btn_lldp' onClick={() => this.changeContent(<LLDP key='interface_lldp' device_id={this.props.device_id} changeSelf={this.props.changeSelf} />) } title='Map interface connections' text='LLDP' />
    <TextButton key='il_btn_clean' onClick={() => this.cleanUp()} title='Clean up empty interfaces' text='Cleanup' />
    {this.state.loader}
   </ContentReport>
  } else
   return <Spinner />
 }
}

// *************** Info ****************
//
export class Info extends Component {
 constructor(props){
  super(props)
  this.state = {op:this.props.op, connect:{name:'<N/A>',map:false}}
 }

 changeContent = (elem) => this.props.changeSelf(elem);

 componentDidMount(){
  rest_call('api/interface/info',{interface_id:this.props.interface_id, mac:this.props.mac, name:this.props.name, device_id:this.props.device_id, class:this.props.class, extra:['classes']}).then(result => this.setState(result));
 }

 onChange = (e) => this.setState({data:{...this.state.data, [e.target.name]:e.target.value}});

 changeIpam = (id) => import('./ipam.jsx').then(lib => this.changeContent(<lib.AddressInfo key={'address_info_'+id} id={id} />))

 deleteIpam = () => (window.confirm('Delete IP mapping?') && rest_call('api/ipam/address_delete',{id:this.state.data.ipam_id}).then(result => ((result.status === 'OK') && this.setState({data:{...this.state.data, ipam_id:null}}))))

 updateInfo = () => rest_call('api/interface/info',{op:'update', ...this.state.data}).then(result => this.setState(result))

 updateDNS = () => (window.confirm('Update DNS with device-interface-name') && rest_call('api/ipam/address_info',{op:'update',hostname:this.state.data.name,id:this.state.data.ipam_id}).then(result => this.setState({result:JSON.stringify(result)})))

 deviceChange = (e) => {
  this.setState({connect:{...this.state.connect, [e.target.name]:e.target.value}});
  if(e.target.name === 'id' && e.target.value.length > 0)
   rest_call('api/device/hostname',{id:e.target.value}).then(result => (result && this.setState({connect:{...this.state.connect, found:(result.status === 'OK'), name:(result.status === 'OK') ? result.data : '<N/A>'}})))
 }

 stateInterface = () => (this.state.connect.found && rest_call('api/interface/list',{device_id:this.state.connect.id,sort:'name',filter:['connected']}).then(result => this.setState({interfaces:result.data, op:'interface'})))

 interfaceChange = (e) => this.setState({connect:{...this.state.connect, [e.target.name]:e.target[(e.target.type !== 'checkbox') ? 'value' : 'checked']}})

 connectInterface = () => (this.state.connect.interface_id && rest_call('api/interface/connect',{a_id:this.state.data.interface_id,b_id:this.state.connect.interface_id,map:this.state.connect.map}).then(result => this.setState({connect:{},op:null})))

 disconnectInterface = () => (this.state.peer && rest_call('api/interface/connect',{a_id:this.state.data.interface_id,b_id:this.state.peer.interface_id,disconnect:true}).then(result => this.setState({peer:null})))

 stateIpam = () => {
  if (this.state.domains && this.state.networks)
   this.setState({op:'ipam'})
  else
   this.setState({op:'wait',ipam:{ip:''}})
  if (!this.state.domains)
   rest_call('api/dns/domain_list',{filter:'forward'}).then(result => this.setState({domains:result.data}));
  if (!this.state.networks)
   rest_call('api/ipam/network_list').then(result => this.setState({networks:result.data,op:'ipam'}));
 }

 ipamChange = (e) => this.setState({ipam:{...this.state.ipam, [e.target.name]:e.target.value}});

 searchIP = () => {
  if (this.state.ipam.network_id)
   rest_call('api/ipam/address_find',{network_id:this.state.ipam.network_id}).then(result => this.setState({ipam:{...this.state.ipam, ip:result.ip}}))
 }

 createIpam = () => {
  rest_call('api/interface/info',{interface_id:this.props.interface_id, op:'update', ipam_record:this.state.ipam}).then(result => this.setState({...result,op:null}))
 }

 render(){
  if(this.state.data){
   if (this.state.op){
    if(this.state.op === 'device')
     return (<article className='lineinput'>
     <div>
      <span>Connect {this.state.data.name} to <TextInput key='ii_cnct_dev' id='id' label='Device ID' onChange={this.deviceChange} /> with name '{this.state.connect.name}'</span>
     </div>
     <BackButton key='ii_cnct_btn_back' onClick={() => this.setState({op:null})} title='Back' />
     <ForwardButton key='ii_cnct_btn_fwd' onClick={() => this.stateInterface()} title={'Connect interface on ' + this.state.connect.name} />
    </article>)
    else if(this.state.op === 'interface')
     return (<article className='lineinput'>
     <div>
      <span>Connect {this.state.data.name} to {this.state.connect.name} on
       <SelectInput key='ii_cnct_int' id='interface_id' label='Interface' value={this.state.connect.interface_id} onChange={this.interfaceChange}>
       {this.state.interfaces.map(row => <option key={'ii_cnct_int_'+row.interface_id} value={row.interface_id}>{`${row.interface_id} (${row.name} - ${row.description})`}</option>)}
       </SelectInput>
       <CheckboxInput key='ii_cnct_map' id='map' value={this.state.connect.map} onChange={this.interfaceChange} />
      </span>
     </div>
     <BackButton key='ii_cnct_btn_back' onClick={() => this.setState({op:'device'})} title='Back' />
     <ForwardButton key='ii_cnct_btn_fwd' onClick={() => this.connectInterface()} title='Complete connection' />
    </article>)
    else if (this.state.op === 'ipam'){
     return <article className='info'>
      <h1>Create IPAM record</h1>
      <InfoColumns key='ii_ipam_create'>
       <SelectInput key='ii_ipam_net' id='network_id' label='Network' value={this.state.ipam.network_id} onChange={this.ipamChange}>{this.state.networks.map((row,idx) => <option key={'ii_net_'+idx} value={row.id}>{`${row.netasc} (${row.description})`}</option>)}</SelectInput>
       <TextInput key='ii_ipam_ip' id='ip' value={this.state.ipam.ip} label='IP' onChange={this.ipamChange} />
       <SelectInput key='ii_ipam_dom' id='a_domain_id' label='Domain' value={this.state.ipam.a_domain_id} onChange={this.ipamChange}>{this.state.domains.map((row,idx) => <option key={'ii_dom_'+idx} value={row.id}>{row.name}</option>)}</SelectInput>
      </InfoColumns>
      <BackButton key='ii_ipam_btn_back' onClick={() => this.setState({op:null})} title='Back'/>
      <SearchButton key='ii_ipam_btn_find' onClick={() => this.searchIP()} title='Search IP within network' />
      <ForwardButton key='ii_ipam_btn_fwd' onClick={() => this.createIpam()} title='Create IPAM entry' />
     </article>
    } else if (this.state.op === 'wait')
     return <Spinner />
    else
     return <div>Intermediate interface operation state</div>
   } else {
    const ipam = (this.state.data.ipam_id);
    const peer = (this.state.peer);
    return (<article className='info'>
     <h1>Interface</h1>
     <InfoColumns key='ii_columns' columns={3}>
      <TextInput key='ii_name' id='name' value={this.state.data.name} onChange={this.onChange} /><div>{ipam && <SyncButton key='ii_btn_dns' onClick={() => this.updateDNS()} title='Sync DNS information using name' />}</div>
      <SelectInput key='ii_class' id='class' value={this.state.data.class} onChange={this.onChange}>{this.state.classes.map(row => <option key={'ii_class_'+row} value={row}>{row}</option>)}</SelectInput><div />
      <TextInput key='ii_description' id='description' value={this.state.data.description} onChange={this.onChange} /><div />
      <TextInput key='ii_snmp_index' id='snmp_index' value={this.state.data.snmp_index} onChange={this.onChange} /><div />
      <TextInput key='ii_mac' id='mac' value={this.state.data.mac} onChange={this.onChange} /><div />
      <TextInput key='ii_ipam_id' id='ipam_id' value={this.state.data.ipam_id} onChange={this.onChange} /><div>
       {ipam && <GoButton key='ii_ipam' onClick={() => this.changeIpam(this.state.data.ipam_id)} title='View IPAM information' />}
       {ipam && <DeleteButton key='ii_delete' onClick={() => this.deleteIpam()} title='Delete IPAM entry' />}
       {!ipam && this.state.data.interface_id !== 'new' && <AddButton key='ii_btn_ipam' onClick={() => this.stateIpam()} title='Create IPAM entry' />}
      </div>
      {peer && <Fragment key='ii_frag_peer_int'><TextLine key='ii_peer_int_id' id='peer_interface' label='Peer interface' text={this.state.peer.interface_id} /><UnlinkButton key='ii_peer_unlink' onClick={() => this.disconnectInterface()} title='Disconnect from peer' /></Fragment>}
      {peer && <Fragment key='ii_frag_peer_dev'><TextLine key='ii_peer_dev_id' id='peer_device' text={this.state.peer.device_id} /><div/></Fragment>}
     </InfoColumns>
     {'changeSelf' in this.props && <BackButton key='ii_btn_back' onClick={() => this.props.changeSelf(<List key='interface_list' device_id={this.state.data.device_id} changeSelf={this.props.changeSelf} />)} title='Back' />}
     <ReloadButton key='ii_btn_reload' onClick={() => this.componentDidMount()} />
     <SaveButton key='ii_btn_save' onClick={() => this.updateInfo()} title='Save interface information' />
     {!peer && this.state.data.interface_id !== 'new' && <NetworkButton key='ii_btn_connect' onClick={() => this.setState({op:'device'})} title='Connect peer interface' />}
     <Result key='ii_result' result={(this.state.status !== 'OK') ? this.state.info : this.state.result} />
    </article>)
   }
  } else
   return <Spinner />
 }
}

// *************** Connection ****************
//
class ConnectionInfo extends Component {

 componentDidMount(){
  rest_call('api/interface/connection_info',{connection_id:this.props.id}).then(result => this.setState(result));
 }

 onChange = (e) => this.setState({data:{...this.state.data, [e.target.name]:e.target[(e.target.type !== 'checkbox') ? 'value' : 'checked']}})

 updateInfo = () => rest_call('api/interface/connection_info',{op:'update', ...this.state.data}).then(result => this.setState(result))

 render(){
  if(this.state){
   return <article className='info'>
    <h1>Connection {this.props.id}</h1>
    <InfoColumns key='ci_columns'>
     <CheckboxInput key='map' id='map' value={this.state.data.map} onChange={this.onChange} />
     {this.state.interfaces.map((row,idx) => <TextLine key={'conn_int_'+idx} id={'interface_' +idx} text={`${row.device_name} - ${row.interface_name} (${row.interface_id})`} />)}
    </InfoColumns>
    <BackButton key='ci_btn_back' onClick={() => this.props.changeSelf(<List key='interface_list' device_id={this.props.device_id} changeSelf={this.props.changeSelf} />)} title='Back' />
    <SaveButton key='ci_btn_save' onClick={() => this.updateInfo()} title='Save connection information' />
   </article>
  } else
   return <Spinner />
 }
}

// *************** LLDP ****************
//
class LLDP extends Component {

 componentDidMount(){
  rest_call('api/interface/lldp_mapping',{device_id:this.props.device_id}).then(result => this.setState({data:Object.values(result.data)}))
 }

 listItem = (row) => [row.chassis_id,row.chassis_type,row.sys_name,row.port_id,row.port_type,row.port_desc,row.snmp_index,row.snmp_name,row.connection_id,row.status]

 render(){
  if(this.state)
   return <ContentReport key='il_cr' header='Interface' thead={['Chassis','Type','Name','Port ID','Type','Description','SNMP Index','SNMP Name','Conn','Status']} trows={this.state.data} listItem={this.listItem}>
   <BackButton key='il_btn_back' onClick={() => this.props.changeSelf(<List key='interface_list' device_id={this.props.device_id} />)} title='Back' />
   </ContentReport>
  else
   return <Spinner />
 }
}