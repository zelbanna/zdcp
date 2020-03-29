import React, { Fragment, Component } from 'react'
import { rest_call, rnd } from './infra/Functions.js';
import { Spinner, SearchField, InfoColumns, RimsContext, ContentList, ContentData, ContentReport } from './infra/UI.jsx';
import { TextInput, SelectInput, DateInput, CheckboxInput } from './infra/Inputs.jsx';
import { AddButton, DeleteButton, InfoButton, ReloadButton, SaveButton, SearchButton, LinkButton } from './infra/Buttons.jsx';
import { NavBar, NavButton, NavDropDown } from './infra/Navigation.js';

// CONVERTED ENTIRELY

// ************** Main **************
//
export class Main extends Component {
 componentDidMount(){
  this.context.loadNavigation(<NavBar key='inventory_navbar'>
   <NavDropDown key='inv_nav_inv' title='Inventory'>
    <NavButton key='inv_nav_srch' title='Search' onClick={() => this.changeContent(<Search key='search_list' changeSelf={this.changeContent} />)} />
    <NavButton key='inv_nav_vend' title='Vendor' onClick={() => this.changeContent(<Vendor key='vendor_list' changeSelf={this.changeContent} />)} />
    <NavButton key='inv_nav_list' title='List'   onClick={() => this.changeContent(<List key='list' changeSelf={this.changeContent} />)} />
   </NavDropDown>
   <NavButton key='inv_nav_loc' title='Locations' onClick={() => this.changeLocation()} />
  </NavBar>)
 }

 changeLocation(){
  import('./location.jsx').then(lib => {
   var LocList = lib.List;
   this.setState(<LocList key='location_list' />);
  })
 }

 changeContent = (elem) => this.setState(elem)

 render(){
  return  <Fragment key='main_base'>{this.state}</Fragment>
 }
}
Main.contextType = RimsContext;

// ************** List **************
//
class List extends Component {
 constructor(props){
  super(props)
  this.state = {searchfield:''}
 }

 componentDidMount(){
  rest_call('api/inventory/list',this.props.args).then(result => this.setState(result))
 }

 listItem = (row) => [row.id,row.serial,row.model,<Fragment key={'inventory_buttons_'+row.id}>
   <InfoButton key={'inv_btn_info_'+row.id}  onClick={() => this.changeContent(<Info key={'inventory_'+row.id} id={row.id} />) } />
   <DeleteButton key={'inv_btn_delete_'+row.id} onClick={() => this.deleteList('api/inventory/delete',row.id,'Really delete item') } />
  </Fragment>]

 searchHandler = (e) => this.setState({searchfield:e.target.value})
 changeContent = (elem) => this.setState({content:elem})
 deleteList = (api,id,msg) => (window.confirm(msg) && rest_call(api, {id:id}).then(result => result.deleted && this.setState({data:this.state.data.filter(row => (row.id !== id)),content:null})))

 render(){
  if (!this.state.data)
   return <Spinner />
  else {
   let inv_list = this.state.data.filter(row => (row.model.includes(this.state.searchfield) || row.serial.includes(this.state.searchfield)));
   return <Fragment key='inv_fragment'>
    <ContentList key='inv_cl' header='Inventory' thead={['ID','Serial','Model','']} trows={inv_list} listItem={this.listItem} result={this.state.result}>
     <ReloadButton key='inv_btn_reload' onClick={() => this.componentDidMount() } />
     <AddButton key='inv_btn_add' onClick={() => this.changeContent(<Info key={'domain_new_' + rnd()} id='new' />) } />
     <SearchField key='dl_searchfield' searchHandler={this.searchHandler} value={this.state.searchfield} placeholder='Search inventory' />
    </ContentList>
    <ContentData key='inv_cd'>{this.state.content}</ContentData>
   </Fragment>
  }
 }
}

// ************** Search **************
//
class Search extends Component {
 constructor(props){
  super(props)
  this.state = {data:{field:'serial',search:''}}
 }

 onChange = (e) => {
  var data = {...this.state.data}
  data[e.target.name] = e.target.value
  this.setState({data:data})
 }

 render() {
  return (
   <article className='lineinput'>
    <h1>Inventory Search</h1>
    <div>
     <span>
      <SelectInput key='field' id='field' value={this.state.data.field} onChange={this.onChange}><option value='serial'>Serial</option><option value='vendor'>Vendor</option></SelectInput>
      <TextInput key='search' id='search' value={this.state.data.search} placeholder='search' onChange={this.onChange} />
     </span>
     <SearchButton key='inv_btn_search' title='Search' onClick={() => this.props.changeSelf(<List key='inventory_list' args={this.state.data} changeSelf={this.props.changeSelf} />)} />
    </div>
   </article>
  )
 }
}

// ************** Info **************
//
export class Info extends Component {
 constructor(props){
  super(props);
  this.state = {data:null, found:true};
 }

 componentDidMount(){
  rest_call('api/inventory/info',{id:this.props.id}).then(result => this.setState(result))
 }

onChange = (e) => {
  var data = {...this.state.data};
  data[e.target.name] = e.target[(e.target.type !== "checkbox") ? "value" : "checked"];
  this.setState({data:data});
 }

 changeContent = (elem) => this.setState({content:elem})

 updateInfo = (api) =>  rest_call(api,{op:'update', ...this.state.data}).then(result => this.setState(result))

 render() {
  if (this.state.data){
   const data = this.state.data;
   return (
    <article className='info'>
     <h1>Inventory Item</h1>
     <InfoColumns key='inventory_content'>
      <TextInput key='vendor' id='vendor' value={data.vendor} onChange={this.onChange} />
      <TextInput key='serial' id='serial' label='S/N' value={data.serial} onChange={this.onChange} />
      <TextInput key='product' id='product' value={data.product} onChange={this.onChange} />
      <TextInput key='model' id='model' value={data.model} onChange={this.onChange} />
      <TextInput key='description' id='description' value={data.description} onChange={this.onChange} />
      <SelectInput key='location_id' id='location_id' label='Location' value={data.location_id} onChange={this.onChange}>{this.state.locations.map((row,idx) => <option key={'ii_'+idx} value={row.id}>{row.name}</option>)}</SelectInput>
      <DateInput key='receive_date' id='receive_date' label='Received' value={data.receive_date} onChange={this.onChange} />
      <TextInput key='purchase_order' id='purchase_order' label='Purchase Order' value={data.purchase_order} onChange={this.onChange} />
      <CheckboxInput key='license' id='license' value={data.license} onChange={this.onChange} />
      {(data.license && <TextInput key='license_key' id='license_key' label='Key' value={data.license_key} onChange={this.onChange} />)}
      <CheckboxInput key='support_contract' id='support_contract' value={data.support_contract} onChange={this.onChange} />
      {(data.support_contract && <DateInput key='support_end_date' id='support_end_date' label='Contract End' value={data.support_end_date} onChange={this.onChange} />)}
      <TextInput key='comments' id='comments' value={data.comments} onChange={this.onChange} />
     </InfoColumns>
     <ReloadButton key='inv_btn_reload' onClick={() => this.componentDidMount() } />
     <SaveButton key='inv_btn_save' onClick={() => this.updateInfo('api/inventory/info') } />
    </article>
   );
  } else
   return <Spinner />
 }
}

// ************** Vendor **************
//
class Vendor extends Component {
 constructor(props){
  super(props)
  this.state = {}
 }

 componentDidMount(){
  rest_call('api/inventory/vendor_list').then(result => this.setState(result))
 }

 listItem = (row) => [<LinkButton key={'search_' +row.vendor} text={row.vendor} onClick={() => this.props.changeSelf(<List key='inventory_list' args={{field:'vendor', search:row.vendor}} changeSelf={this.props.changeSelf} />)} />,row.count]

 render(){
  return <Fragment key='inv_fragment'>
   <ContentList key='inv_cl' header='Vendors' thead={['Name','Count']} trows={this.state.data} listItem={this.listItem} />
   <ContentData key='inv_cd'>{this.state.content}</ContentData>
  </Fragment>
 }
}

// ************** Report **************
//
export class Report extends Component {
 constructor(props){
  super(props)
  this.state = {}
 }

 componentDidMount(){
  rest_call('api/inventory/list', { extra:['vendor','product','description'], sort:'vendor'}).then(result => this.setState(result))
 }

 listItem = (row) => [row.id,row.serial,row.vendor,row.model,row.product,row.description]

 render(){
  return <ContentReport key='inv_cr' header='Inventory' thead={['ID','Serial','Vendor','Model','Product','Description']} trows={this.state.data} listItem={this.listItem} />
 }
}
