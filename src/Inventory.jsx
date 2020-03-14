import React, { Fragment, Component } from 'react'
import { rest_call, rest_base, rnd } from './infra/Functions.js';
import { Spinner, InfoCol2, RimsContext } from './infra/Generic.js';
import { MainBase, ListBase, ReportBase, InfoBase } from './infra/Base.jsx';
import { InfoButton, TextButton } from './infra/Buttons.jsx';

import { List as LocationList } from './Location.jsx'

// CONVERTED ENTIRELY

// ************** Main **************
//
export class Main extends MainBase {
 componentDidMount(){
  this.context.loadNavigation([
   {title:'Inventory',   type:'dropdown', items:[
    {title:'Search', onClick:() => { this.changeContent(<Search key='search_list' changeSelf={this.changeContent} />)}},
    {title:'Vendor', onClick:() => { this.changeContent(<Vendor key='vendor_list' changeSelf={this.changeContent} />)}},
    {title:'List',   onClick:() => { this.changeContent(<List key='list' changeSelf={this.changeContent} />)}}
   ]},
   {title:'Locations', onClick:() => { this.changeContent(<LocationList key='location_list' />)}}
  ])
 }
}
Main.contextType = RimsContext;

// ************** List **************
//
class List extends ListBase {
 constructor(props){
  super(props)
  this.thead = ['ID','Serial','Model','']
  this.header = 'Inventory'
  this.buttons = [
   <InfoButton key='reload' type='reload' onClick={() =>  this.componentDidMount() } />,
   <InfoButton key='search' type='search' onClick={() => this.props.changeSelf(<Search key='search_list' changeSelf={this.props.changeSelf} />) } />,
   <InfoButton key='add' type='add' onClick={() => this.changeContent(<Info key={'inventory_new_' + rnd()} id='new' />) } />
  ]
 }

 componentDidMount(){
  rest_call(rest_base + 'api/inventory/list',(this.props.hasOwnProperty('args')) ? this.props.args : {})
   .then((result) => this.setState(result) )
 }

 listItem = (row) => [row.id,row.serial,row.model,<Fragment key={'inventory_buttons_'+row.id}>
   <InfoButton key={'inv_info_'+row.id} type='info'  onClick={() => this.changeContent(<Info key={'inventory_'+row.id} id={row.id} />) } />
   <InfoButton key={'inv_delete_'+row.id} type='trash' onClick={() => this.deleteList('api/inventory/delete',row.id,'Really delete item') } />
   </Fragment>
  ]

}

// ************** Search **************
//
class Search extends Component {
 constructor(props){
  super(props)
  this.state = {data:{field:'serial',search:''}}
 }

 changeHandler = (e) => {
  var data = {...this.state.data}
  data[e.target.name] = e.target.value
  this.setState({data:data})
 }

 render() {
  return (
   <article className='lineinput'>
    <h1>Inventory Search</h1>
    <div>
     <span>Field:
      <select id='field' name='field' onChange={this.changeHandler} value={this.state.data.field}>
       <option value='serial'>Serial</option>
       <option value='vendor'>Vendor</option>
      </select>:
      <input type='text' id='search' name='search' required='required' onChange={this.changeHandler} value={this.state.data.search} placeholder='search' />
     </span>
     <InfoButton type='search' title='Search' onClick={() => this.props.changeSelf(<List key='inventory_list' args={this.state.data} changeSelf={this.props.changeSelf} />)} />
    </div>
   </article>
  )
 }
}

// ************** Info **************
//
export class Info extends InfoBase {
 constructor(props) {
  super(props)
  this.state = {data:null, locations:[]}
 }

 componentDidMount(){
  rest_call(rest_base + 'api/inventory/info',{id:this.props.id})
   .then((result) => this.setState(result) )
 }

 infoItems = () => {
  const data = this.state.data;
  const items = [
   {tag:'input', type:'text', id:'vendor', text:'Vendor', value:data.vendor},
   {tag:'input', type:'text', id:'serial', text:'S/N', value:data.serial},
   {tag:'input', type:'text', id:'product', text:'Product', value:data.product},
   {tag:'input', type:'text', id:'model', text:'Model', value:data.model},
   {tag:'input', type:'text', id:'description', text:'Description', value:data.description},
   {tag:'select', id:'location_id', text:'Location', value:data.location_id, options:this.state.locations.map( row => ({value:row.id, text:row.name}))},
   {tag:'input', type:'date', id:'receive_date', text:'Received', value:data.receive_date},
   {tag:'input', type:'text', id:'purchase_order', text:'Purchase Order', value:data.purchase_order},
   {tag:'input', type:'text', id:'comments', text:'Comments', value:data.comments},
   {tag:'input', type:'checkbox', id:'license', text:'License', value:data.license},
   {tag:'input', type:'checkbox', id:'support_contract', text:'Support Contract', value:data.support_contract}
  ]
  if (data.license)
   items.push({tag:'input', type:'text', id:'license_key', text:'Key', value:data.license_key})
  if (data.support_contract)
   items.push({tag:'input', type:'date', id:'support_end_date', text:'Contract End', value:data.support_end_date})
  return items
 }

 render() {
  if (this.state.found === false)
   return <article>Inventory item  with id: {this.props.id} removed</article>
  else if (this.state.data === null)
   return <Spinner />
  else {
   const className = (this.props.hasOwnProperty('className')) ? `info ${this.props.className}` : 'info';
   return (
    <article className={className}>
     <h1>Inventory Item</h1>
     <InfoCol2 key='inventory_content' griditems={this.infoItems()} changeHandler={this.changeHandler} />
     <InfoButton key='inventory_reload' type='reload' onClick={() => this.componentDidMount() } />
     <InfoButton key='inventory_save' type='save' onClick={() => this.updateInfo('api/inventory/info') } />
    </article>
   );
  }
 }

}

// ************** Vendor **************
//
class Vendor extends ListBase {
 constructor(props){
  super(props)
  this.header = ''
  this.thead = ['Vendor','Count']
 }

 componentDidMount(){
  rest_call(rest_base + 'api/inventory/vendor_list')
   .then((result) => this.setState(result))
 }

 listItem = (row) => [<TextButton key={'search_' +row.vendor} text={row.vendor} onClick={() => this.props.changeSelf(<List key='inventory_list' args={{field:'vendor', search:row.vendor}} changeSelf={this.props.changeSelf} />)} />,row.count]
}

// ************** Report **************
//
export class Report extends ReportBase {
 constructor(props){
  super(props)
  this.header = 'Inventory'
  this.thead = ['ID','Serial','Vendor','Model','Product','Description']
 }

 componentDidMount(){
  rest_call(rest_base + 'api/inventory/list', { extra:['vendor','product','description'], sort:'vendor'})
   .then((result) => this.setState(result) )
 }

 listItem = (row) => [row.id,row.serial,row.vendor,row.model,row.product,row.description]
}
