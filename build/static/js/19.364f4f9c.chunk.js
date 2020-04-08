(this.webpackJsonprims=this.webpackJsonprims||[]).push([[19],{43:function(e,t,n){"use strict";n.r(t),n.d(t,"List",(function(){return y}));var a=n(9),r=n(13),i=n(3),s=n(4),o=n(6),c=n(5),l=n(7),u=n(0),d=n.n(u),p=n(8),m=n(1),h=n(11),v=n(10),f=n(2),y=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(o.a)(this,Object(c.a)(t).call(this,e))).listItem=function(e){return[e.node,e.service,e.type,d.a.createElement(u.Fragment,{key:"sl_buttons"},d.a.createElement(f.InfoButton,{key:"sl_btn_info_"+e.id,onClick:function(){return n.changeContent(d.a.createElement(_,{key:"server_info_"+e.id,id:e.id}))},title:"Service information"}),d.a.createElement(f.DeleteButton,{key:"sl_btn_delete"+e.id,onClick:function(){return n.deleteList(e.id)},title:"Delete service"}),e.hasOwnProperty("ui")&&e.ui.length>0&&d.a.createElement(f.UiButton,{key:"sl_btn_ui"+e.id,onClick:function(){return window.open(e.ui,"_blank")},title:"Server UI"}))]},n.changeContent=function(e){return n.setState({content:e})},n.deleteList=function(e){return window.confirm("Really delete service?")&&Object(p.b)("api/master/server_delete",{id:e}).then((function(t){return t.deleted&&n.setState({data:n.state.data.filter((function(t){return t.id!==e})),content:null})}))},n.state={},n}return Object(l.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(p.b)("api/master/server_list",{type:this.props.type}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;return d.a.createElement(u.Fragment,{key:"sl_fragment"},d.a.createElement(m.ContentList,{key:"sl_cl",header:"Servers",thead:["Node","Service","Type",""],trows:this.state.data,listItem:this.listItem},d.a.createElement(f.ReloadButton,{key:"sl_btn_reload",onClick:function(){return e.componentDidMount()}}),d.a.createElement(f.AddButton,{key:"sl_btn_add",onClick:function(){return e.changeContent(d.a.createElement(_,{key:"sl_new_"+Object(p.c)(),id:"new",type:e.props.type}))},title:"Add service"})),d.a.createElement(m.ContentData,{key:"sl_cd"},this.state.content))}}]),t}(u.Component),_=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(o.a)(this,Object(c.a)(t).call(this,e))).onChange=function(e){return n.setState({data:Object(r.a)({},n.state.data,Object(a.a)({},e.target.name,e.target.value))})},n.changeContent=function(e){return n.setState({content:e})},n.updateInfo=function(){return Object(p.b)("api/master/server_info",Object(r.a)({op:"update"},n.state.data)).then((function(e){return n.setState(e)}))},n.state={data:null,found:!0,content:null},n}return Object(l.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(p.b)("api/master/server_info",{id:this.props.id}).then((function(t){t.data.node||(t.data.node=t.nodes[0]),t.data.type_id||(t.data.type_id=t.services[0].id),e.setState(t)}))}},{key:"render",value:function(){var e=this;if(this.state.found){if(this.state.data){var t="new"!==this.state.data.id;return d.a.createElement(u.Fragment,{key:"si_info_fragment"},d.a.createElement("article",{className:"info"},d.a.createElement("h1",null,"Server"),d.a.createElement(m.InfoColumns,{key:"si_content"},d.a.createElement(v.TextLine,{key:"server",id:"server",label:"ID",text:this.state.data.id}),d.a.createElement(v.SelectInput,{key:"node",id:"node",value:this.state.data.node,onChange:this.onChange},this.state.nodes.map((function(e,t){return d.a.createElement("option",{key:"si_node_"+t,value:e},e)}))),d.a.createElement(v.SelectInput,{key:"type_id",id:"type_id",label:"Service",value:this.state.data.type_id,onChange:this.onChange},this.state.services.map((function(e,t){return d.a.createElement("option",{key:"si_svc_"+t,value:e.id},"".concat(e.service," (").concat(e.type,")"))}))),d.a.createElement(v.UrlInput,{key:"ui",id:"ui",label:"UI",value:this.state.data.ui,onChange:this.onChange})),d.a.createElement(f.SaveButton,{key:"si_btn_save",onClick:function(){return e.updateInfo()},title:"Save"}),t&&d.a.createElement(f.SyncButton,{key:"si_sync",onClick:function(){return e.changeContent(d.a.createElement(k,{key:"srv_op_sync",id:e.props.id,operation:"sync"}))},title:"Sync service"}),t&&d.a.createElement(f.ReloadButton,{key:"si_restart",onClick:function(){return e.changeContent(d.a.createElement(k,{key:"srv_op_rst",id:e.props.id,operation:"restart"}))},title:"Restart service"}),t&&d.a.createElement(f.ItemsButton,{key:"si_status",onClick:function(){return e.changeContent(d.a.createElement(k,{key:"srv_op_stat",id:e.props.id,operation:"status"}))},title:"Service status"})),d.a.createElement(h.a,{key:"server_navigation",id:"server_navigation"}),this.state.content)}return d.a.createElement(m.Spinner,null)}return d.a.createElement("article",null,"Server with id: ",this.props.id," removed")}}]),t}(u.Component),k=function(e){function t(){return Object(i.a)(this,t),Object(o.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(p.b)("api/master/server_"+this.props.operation,{id:this.props.id}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){return this.state?d.a.createElement("article",{className:"code"},d.a.createElement("pre",null,JSON.stringify(this.state,null,2))):d.a.createElement(m.Spinner,null)}}]),t}(u.Component)}}]);
//# sourceMappingURL=19.364f4f9c.chunk.js.map