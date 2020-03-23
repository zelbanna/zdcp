import React, { Fragment, Component } from 'react';
import { rest_call, rnd } from './infra/Functions.js';
import { InfoCol2, Spinner, RimsContext, ContentList, ContentData, ContentReport } from './infra/Generic.js';
import { TextInput, SelectInput, DateInput, TimeInput } from './infra/Inputs.jsx';
import { InfoButton } from './infra/Buttons.jsx';

// CONVERTED ENTIRELY

// ************** Main **************
//
export class Main extends Component {
 componentDidMount(){
  this.context.loadNavigation([
   {title:'Activities', onClick:() => { this.changeContent(<List key='activity_list' />)}},
   {title:'Types', onClick:() => { this.changeContent(<TypeList key='activity_type_list' />)}},
   {title:'Report', onClick:() => { this.changeContent(<Report key='activity_report' />)}}
  ])
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
  this.state = {}
 }

 componentDidMount(){
  rest_call('api/master/activity_list').then(result => this.setState(result))
 }

 listItem = (row) => [row.date + ' - ' + row.time,row.type,<Fragment key={'activity_buttons_'+row.id}>
   <InfoButton key={'act_info_'+row.id} type='info'  onClick={() => this.changeContent(<Info key={'activity_'+row.id} id={row.id} />) } />
   <InfoButton key={'act_delete_'+row.id} type='delete' onClick={() => this.deleteList('api/master/activity_delete',row.id,'Really delete activity') } />
   </Fragment>
  ]

 changeContent = (elem) => this.setState({content:elem})
 deleteList = (api,id,msg) => (window.confirm(msg) && rest_call(api, {id:id}).then(result => result.deleted && this.setState({data:this.state.data.filter(row => (row.id !== id)),content:null})))

 render(){
  return <Fragment key='act_fragment'>
   <ContentList key='act_cl' header='Activities' thead={['Date','Type','']} trows={this.state.data} listItem={this.listItem}>
    <InfoButton key='act_btn_reload' type='reload' onClick={() => this.componentDidMount() } />
    <InfoButton key='act_btn_add' type='add' onClick={() => this.changeContent(<Info key={'activity_new_' + rnd()} id='new' />) } />
   </ContentList>
   <ContentData key='act_cd'>{this.state.content}</ContentData>
  </Fragment>
 }
}

// *************** Info ***************
//
class Info extends Component {
 constructor(props){
  super(props);
  this.state = {data:null, found:true};
 }

 changeHandler = (e) => {
  var data = {...this.state.data};
  data[e.target.name] = e.target[(e.target.type !== "checkbox") ? "value" : "checked"];
  this.setState({data:data});
 }

 updateInfo = (api) =>  rest_call(api,{op:'update', ...this.state.data}).then(result => this.setState(result))

 componentDidMount(){
  rest_call('api/master/activity_info',{id:this.props.id}).then(result => {
   if (result.data.user_id === null)
    result.data.user_id = this.context.cookie.id;
   this.setState(result);
  })
 }

 render() {
  if (this.state.data)
   return (
    <article className='info'>
     <h1>Activity</h1>
     <InfoCol2 key='activity_content'>
      <SelectInput key='user_id' id='user_id' label='User' value={this.state.data.user_id} options={this.state.users.map(row => ({value:row.id, text:row.alias}))} changeHandler={this.changeHandler} />
      <SelectInput key='type_id' id='type_id' label='Type' value={this.state.data.type_id} options={this.state.types.map(row => ({value:row.id, text:row.type}))} changeHandler={this.changeHandler} />
      <DateInput key='date' id='date' value={this.state.data.date} changeHandler={this.changeHandler} />
      <TimeInput key='time' id='time' value={this.state.data.time} changeHandler={this.changeHandler} />
     </InfoCol2>
     <textarea id='event' name='event' className='info' onChange={this.changeHandler} value={this.state.data.event} />
     <InfoButton key='activity_save' type='save' onClick={() => this.updateInfo('api/master/activity_info')} />
    </article>
   );
  else
   return <Spinner />
 }
}
Info.contextType = RimsContext;

// ************** Report **************
//
export class Report extends Component {
 constructor(props){
  super(props)
  this.state = {}
 }

 componentDidMount(){
  rest_call('api/master/activity_list',{group:'month',mode:'full'}).then(result => this.setState(result))
 }

 listItem = (row) => [row.date + ' - ' + row.time,row.user,row.type,row.event]

 render(){
  return <ContentReport key='act_cr' header='Activities' thead={['Time','User','Type','Event']} trows={this.state.data} listItem={this.listItem} />
 }
}

// ************** TypeList **************
//
class TypeList extends Component {
 constructor(props){
  super(props);
  this.state = {}
 }

 componentDidMount(){
  rest_call('api/master/activity_type_list').then(result => this.setState(result))
 }

 listItem = (row) => [row.id,row.type,<Fragment key='activity_buttons'>
   <InfoButton key='act_tp_info'   type='info'  onClick={() => this.changeContent(<TypeInfo key={'activity_type_'+row.id} id={row.id} />) } />
   <InfoButton key='act_tp_delete' type='delete' onClick={() => this.deleteList('api/master/activity_type_delete',row.id,'Really delete type?') } />
  </Fragment>
 ]

 changeContent = (elem) => this.setState({content:elem})
 deleteList = (api,id,msg) => (window.confirm(msg) && rest_call(api, {id:id}).then(result => result.deleted && this.setState({data:this.state.data.filter(row => (row.id !== id)),content:null})))

 render(){
  return <Fragment key='act_tp_fragment'>
   <ContentList key='act_tp_cl' header='Activity Types' thead={['ID','Type','']} trows={this.state.data} listItem={this.listItem}>
    <InfoButton key='act_tp_btn_reload' type='reload' onClick={() => this.componentDidMount() } />
    <InfoButton key='act_tp_btn_add' type='add' onClick={() => this.changeContent(<TypeInfo key={'act_tp_new_' + rnd()} id='new' />) } />
   </ContentList>
   <ContentData key='act_tp_cd'>{this.state.content}</ContentData>
  </Fragment>
 }

}

// *************** TypeInfo ***************
//
class TypeInfo extends Component {
 constructor(props){
  super(props);
  this.state = {data:null, found:true, content:null};
 }

 changeHandler = (e) => {
  var data = {...this.state.data};
  data[e.target.name] = e.target[(e.target.type !== "checkbox") ? "value" : "checked"];
  this.setState({data:data});
 }

 changeContent = (elem) => this.setState({content:elem})

 updateInfo = (api) =>  rest_call(api,{op:'update', ...this.state.data}).then(result => this.setState(result))

 componentDidMount(){
  rest_call('api/master/activity_type_info',{id:this.props.id}).then(result => this.setState(result))
 }

 render() {
  if (this.state.data)
   return (
    <article className='info'>
     <h1>Activity Type</h1>
     <InfoCol2 key='activity_type_content'>
      <TextInput key='type' id='type' value={this.state.data.type} changeHandler={this.changeHandler} placeholder='name' />
     </InfoCol2>
     <InfoButton key='activity_type_save' type='save' onClick={() => this.updateInfo('api/master/activity_type_info')} />
    </article>
   );
  else
   return <Spinner />
 }
}
