(this.webpackJsonprims=this.webpackJsonprims||[]).push([[11],{35:function(t,e,n){"use strict";n.r(e),n.d(e,"Main",(function(){return f})),n.d(e,"Manage",(function(){return b})),n.d(e,"Inventory",(function(){return E}));var a=n(11),i=n(13),r=n(3),o=n(4),c=n(6),s=n(5),u=n(7),p=n(0),l=n.n(p),d=n(8),h=n(1),_=n(2),m=n(9),v=n(10),y=n(27),f=function(t){function e(t){var n;return Object(r.a)(this,e),(n=Object(c.a)(this,Object(s.a)(e).call(this,t))).listItem=function(t){var e="up"===t.state;return[t.hostname,t.type_name,l.a.createElement(h.StateMap,{state:t.state}),l.a.createElement(p.Fragment,{key:"hyp_buttons_"+t.id},e&&"manage"===t.type_functions&&l.a.createElement(_.InfoButton,{key:"hyp_btn_info_"+t.id,onClick:function(){return n.context.changeMain(l.a.createElement(b,{key:"hypervisor_manage_"+t.id,device_id:t.id,type:t.type_name}))}}),e&&t.url&&t.url.length>0&&l.a.createElement(_.UiButton,{key:"hyp_ btn_ui_"+t.id,onClick:function(){return window.open(t.url,"_blank")}}))]},n.changeContent=function(t){return n.setState({content:t})},n.state={},n}return Object(u.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(d.b)("api/device/list",{field:"base",search:"hypervisor",extra:["type","functions","url"],sort:"hostname"}).then((function(e){return t.setState(e)}))}},{key:"render",value:function(){var t=this;return l.a.createElement(p.Fragment,{key:"hyp_fragment"},l.a.createElement(h.ContentList,{key:"hyp_cl",header:"Hypervisor",thead:["Hostname","Type","",""],trows:this.state.data,listItem:this.listItem},l.a.createElement(_.SyncButton,{key:"hyp_btn_sync",onClick:function(){return t.changeContent(l.a.createElement(k,null))}})),l.a.createElement(h.ContentData,{key:"hyp_cd"},this.state.content))}}]),e}(p.Component);f.contextType=h.RimsContext;var k=function(t){function e(t){var n;return Object(r.a)(this,e),(n=Object(c.a)(this,Object(s.a)(e).call(this,t))).listItem=function(t){return[t.type,t.host_id,t.device_id,t.vm,t.device_uuid,t.config]},n.state={},n}return Object(u.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(d.b)("api/device/vm_mapping").then((function(e){var n=[];["existing","inventory","discovered","database"].forEach((function(t){e.hasOwnProperty(t)&&e[t].forEach((function(e){e.type=t,n.push(e)}))})),t.setState({data:n})}))}},{key:"render",value:function(){return l.a.createElement(h.ContentReport,{key:"hyp_cr",header:"VM Mapping",thead:["Status","Host","Device","VM Name","Device UUID","Config"],trows:this.state.data,listItem:this.listItem})}}]),e}(p.Component),b=function(t){function e(t){var n;return Object(r.a)(this,e),(n=Object(c.a)(this,Object(s.a)(e).call(this,t))).changeContent=function(t){return n.setState({content:t})},n.state={},n}return Object(u.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(d.b)("api/device/management",{id:this.props.device_id}).then((function(e){t.context.loadNavigation(l.a.createElement(v.NavBar,{key:"hypervisor_navbar"},l.a.createElement(v.NavButton,{key:"hyp_nav_inv",title:"Inventory",onClick:function(){return t.changeContent(l.a.createElement(E,{key:"hypervisor_inventory",device_id:t.props.device_id,type:t.props.type}))}}),l.a.createElement(v.NavButton,{key:"hyp_nav_logs",title:"Logs",onClick:function(){return t.changeContent(l.a.createElement(y.Logs,{key:"device_logs",id:t.props.device_id}))}}),e.data.url&&e.data.url.length>0&&l.a.createElement(v.NavButton,{key:"hyp_nav_ui",title:"UI",onClick:function(){return window.open(e.data.url,"_blank")}}),l.a.createElement(v.NavInfo,{key:"hyp_nav_name",title:e.data.hostname}))),t.setState(Object(i.a)({},e,{content:l.a.createElement(E,{key:"hypervisor_inventory",device_id:t.props.device_id,type:t.props.type})}))}))}},{key:"render",value:function(){return l.a.createElement(p.Fragment,{key:"manage_base"},this.state.content)}}]),e}(p.Component);b.contextType=h.RimsContext;var E=function(t){function e(t){var n;return Object(r.a)(this,e),(n=Object(c.a)(this,Object(s.a)(e).call(this,t))).changeContent=function(t){return n.setState({content:t})},n.sortList=function(t){"name"===t?n.state.data.sort((function(t,e){return t.name.localeCompare(e.name)})):n.state.data.sort((function(t,e){return t.id-e.id})),n.setState({sort:t})},n.listItem=function(t){return[t.id,t.name,l.a.createElement(g,{key:"hl_op_"+t.id,vm_id:t.id,device_id:n.props.device_id,type:n.props.type,changeContent:n.changeContent,state:t.state})]},n.state={sort:"name"},n}return Object(u.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(d.b)("api/"+this.props.type+"/inventory",{device_id:this.props.device_id,sort:this.state.sort}).then((function(e){return t.setState(e)}))}},{key:"render",value:function(){var t=this;if(this.state.data){var e=[l.a.createElement(_.HeaderButton,{key:"hl_btn_id",text:"ID",highlight:"id"===this.state.sort,onClick:function(){return t.sortList("id")}}),l.a.createElement(_.HeaderButton,{key:"hl_btn_vm",text:"VM",highlight:"name"===this.state.sort,onClick:function(){return t.sortList("name")}}),"Operations"];return l.a.createElement(p.Fragment,{key:"hl_fragment"},l.a.createElement(h.ContentList,{key:"hl_cl",header:"Inventory",thead:e,trows:this.state.data,listItem:this.listItem},l.a.createElement(_.ReloadButton,{key:"hl_btn_reload",onClick:function(){t.setState({data:void 0}),t.componentDidMount()}}),l.a.createElement(_.LogButton,{key:"hl_btn_logs",onClick:function(){return t.changeContent(l.a.createElement(y.Logs,{key:"device_logs",id:t.props.device_id}))},title:"Device logs"})),l.a.createElement(h.ContentData,{key:"hl_cd"},this.state.content))}return l.a.createElement(h.Spinner,null)}}]),e}(p.Component),g=function(t){function e(t){var n;return Object(r.a)(this,e),(n=Object(c.a)(this,Object(s.a)(e).call(this,t))).operation=function(t){n.setState({wait:l.a.createElement(h.Spinner,null)}),Object(d.b)("api/"+n.props.type+"/vm_op",{device_id:n.props.device_id,vm_id:n.props.vm_id,op:t}).then((function(t){return n.setState(Object(i.a)({},t,{wait:null}))}))},n.snapshot=function(t){n.setState({wait:l.a.createElement(h.Spinner,null)}),Object(d.b)("api/"+n.props.type+"/vm_snapshot",{device_id:n.props.device_id,vm_id:n.props.vm_id,op:t}).then((function(t){return n.setState(Object(i.a)({},t,{wait:null}))}))},n.state={state:n.props.state,status:"",wait:null},n}return Object(u.a)(e,t),Object(o.a)(e,[{key:"render",value:function(){var t=this,e="on"===this.state.state,n="off"===this.state.state;return l.a.createElement(p.Fragment,{key:"hyp_frag_"+this.props.vm_id},l.a.createElement(_.InfoButton,{key:"hyp_btn_info_"+this.props.vm_id,onClick:function(){return t.props.changeContent(l.a.createElement(C,{key:"hypervisor_info_"+t.props.vm_id,device_id:t.props.device_id,vm_id:t.props.vm_id,type:t.props.type,changeSelf:t.props.changeContent}))},title:"VM info"}),(n||"suspended"===this.state.state)&&l.a.createElement(_.StartButton,{key:"hyp_btn_start_"+this.props.vm_id,onClick:function(){return t.operation("on")},title:this.state.status}),e&&l.a.createElement(_.StopButton,{key:"hyp_btn_stop_"+this.props.vm_id,onClick:function(){return t.operation("shutdown")},title:this.state.status}),e&&l.a.createElement(_.ReloadButton,{key:"hyp_btn_reload_"+this.props.vm_id,onClick:function(){return t.operation("reboot")},title:this.state.status}),e&&l.a.createElement(_.PauseButton,{key:"hyp_btn_suspend_"+this.props.vm_id,onClick:function(){return t.operation("suspend")},title:this.state.status}),(e||"suspended"===this.state.state)&&l.a.createElement(_.ShutdownButton,{key:"hyp_btn_shutdown_"+this.props.vm_id,onClick:function(){return t.operation("off")},title:this.state.status}),n&&l.a.createElement(_.SnapshotButton,{key:"hyp_btn_snapshot_"+this.props.vm_id,onClick:function(){return t.snapshot("create")},title:"Take snapshot"}),n&&l.a.createElement(_.ItemsButton,{key:"hyp_btn_snapshots_"+this.props.vm_id,onClick:function(){return t.props.changeContent(l.a.createElement(O,{key:"hypervisor_snapshots_"+t.props.vm_id,device_id:t.props.device_id,vm_id:t.props.vm_id,type:t.props.type}))},title:"Snapshot info"}),this.state.wait)}}]),e}(p.Component),C=function(t){function e(t){var o;return Object(r.a)(this,e),(o=Object(c.a)(this,Object(s.a)(e).call(this,t))).onChange=function(t){return o.setState({data:Object(i.a)({},o.state.data,Object(a.a)({},t.target.name,t.target.value))})},o.changeSelf=function(t){return o.props.changeSelf(t)},o.changeContent=function(t){return o.setState({content:t})},o.changeImport=function(t){return n.e(1).then(n.bind(null,29)).then((function(e){return o.setState({content:l.a.createElement(e.Info,{key:"interface_info_"+t[0],device_id:o.state.data.device_id,class:"virtual",mac:t[1].mac,name:t[1].name,interface_id:t[1].interface_id,changeSelf:o.changeContent})})}))},o.state={},o}return Object(u.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(d.b)("api/"+this.props.type+"/vm_info",{device_id:this.props.device_id,vm_id:this.props.vm_id}).then((function(e){return t.setState(e)}))}},{key:"syncDatabase",value:function(){var t=this;Object(d.b)("api/"+this.props.type+"/vm_info",{device_id:this.props.device_id,vm_id:this.props.vm_id,op:"update"}).then((function(e){return t.setState(e)}))}},{key:"updateInfo",value:function(){var t=this;Object(d.b)("api/"+this.props.type+"/vm_map",{device_uuid:this.state.data.device_uuid,device_id:this.state.data.device_id,host_id:this.props.device_id,op:"update"}).then((function(e){return t.setState({update:e.update})}))}},{key:"interfaceButton",value:function(t){var e=this;return this.state.data.device_id?t[1].interface_id?l.a.createElement(_.InfoButton,{key:"hyp_if_btn_"+t[0],onClick:function(){return e.changeImport([t[0],{interface_id:t[1].interface_id}])}}):l.a.createElement(_.AddButton,{key:"hyp_if_btn_"+t[0],onClick:function(){return e.changeImport(Object(i.a)({},t,{interface_id:"new"}))}}):l.a.createElement("div",null)}},{key:"render",value:function(){var t=this;if(this.state.data){var e=this.state.data;return l.a.createElement(p.Fragment,{key:"hyp_frag"},l.a.createElement("article",{className:"info"},l.a.createElement("h1",null,"VM info"),l.a.createElement(h.InfoColumns,{key:"hyp_ic",columns:3},l.a.createElement(m.TextLine,{key:"hyp_name",id:"name",text:e.name}),l.a.createElement("div",null),l.a.createElement(m.TextInput,{key:"hyp_device_id",id:"device_id",label:"Device ID",value:e.device_id,onChange:this.onChange}),l.a.createElement("div",null),l.a.createElement(m.TextLine,{key:"hyp_device_name",id:"device",label:"Device Name",text:e.device_name}),l.a.createElement("div",null),l.a.createElement(m.TextLine,{key:"hyp_snmp",id:"snmp_id",label:"SNMP id",text:e.snmp_id}),l.a.createElement("div",null),l.a.createElement(m.TextLine,{key:"hyp_uuid",id:"uuid",label:"UUID",text:e.device_uuid}),l.a.createElement("div",null),l.a.createElement(m.StateLine,{key:"hyp_state",id:"state",state:e.state}),l.a.createElement("div",null),l.a.createElement(m.TextLine,{key:"hyp_config",id:"config",text:e.config}),l.a.createElement("div",null),Object.entries(this.state.interfaces).map((function(e){return l.a.createElement(p.Fragment,{key:"hyp_intf_frag_"+e[0]},l.a.createElement(m.TextLine,{key:"hyp_intf_"+e[0],id:"interface_"+e[0],label:"Interface",text:"".concat(e[1].name," - ").concat(e[1].mac," - ").concat(e[1].port)}),t.interfaceButton(e))}))),l.a.createElement(_.SaveButton,{key:"hyp_btn_save",onClick:function(){return t.updateInfo()},title:"Save mapping"}),l.a.createElement(_.SyncButton,{key:"hyp_btn_sync",onClick:function(){return t.syncDatabase()},title:"Resync database with VM info"}),e.device_id&&l.a.createElement(_.GoButton,{key:"hyp_btn_device_vm_info",onClick:function(){return t.changeSelf(l.a.createElement(y.Info,{key:"device_info",id:e.device_id,changeSelf:t.props.changeSelf}))},title:"VM device info"}),l.a.createElement(h.Result,{key:"hyp_res",result:JSON.stringify(this.state.update)})),l.a.createElement(v.NavBar,null),this.state.content)}return l.a.createElement(h.Spinner,null)}}]),e}(p.Component),O=function(t){function e(t){var n;return Object(r.a)(this,e),(n=Object(c.a)(this,Object(s.a)(e).call(this,t))).snapshot=function(t,e){n.setState({wait:l.a.createElement(h.Spinner,null)}),Object(d.b)("api/"+n.props.type+"/vm_snapshot",{device_id:n.props.device_id,vm_id:n.props.vm_id,op:t,snapshot:e}).then((function(t){return n.setState(Object(i.a)({},t,{wait:null}))}))},n.deleteList=function(t){window.confirm("Really delete snapshot?")&&(n.setState({wait:l.a.createElement(h.Spinner,null)}),Object(d.b)("api/"+n.props.type+"/vm_snapshot",{device_id:n.props.device_id,vm_id:n.props.vm_id,op:"remove",snapshot:t}).then((function(e){if(e.deleted){var a=0,i=n.state.data.filter((function(e){return e.id!==t}));i.forEach((function(t){a=a<parseInt(t.id)?parseInt(t.id):a})),n.setState({data:i,highest:a,wait:null})}})))},n.listItem=function(t){return[t.name,t.id,t.desc,t.created,t.state,l.a.createElement(p.Fragment,{key:"hyp_snap_buttons_"+t.id},l.a.createElement(_.RevertButton,{key:"hs_revert_"+t.id,onClick:function(){return n.snapshot("revert",t.id)},title:"Revert to snapshot"}),l.a.createElement(_.DeleteButton,{key:"hs_delete_"+t.id,onClick:function(){return n.deleteList(t.id)},title:"Delete snapshot"}))]},n.state={},n}return Object(u.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){this.snapshot("list",void 0)}},{key:"render",value:function(){var t=this;return l.a.createElement(h.ContentReport,{key:"hyp_snapshot_cr",header:"Snapshot (".concat(this.props.vm_id,") Highest ID:").concat(this.state.highest),thead:["Name","ID","Description","Created","State",""],trows:this.state.data,listItem:this.listItem},l.a.createElement(_.ReloadButton,{key:"hs_reload",onClick:function(){return t.snapshot("list",void 0)},title:"Reload list"}),this.state.wait)}}]),e}(p.Component)}}]);
//# sourceMappingURL=11.444d87c5.chunk.js.map