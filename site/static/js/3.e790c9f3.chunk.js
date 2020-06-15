(this.webpackJsonprims=this.webpackJsonprims||[]).push([[3],{41:function(t,e,n){"use strict";n.r(e),n.d(e,"Main",(function(){return m})),n.d(e,"List",(function(){return g})),n.d(e,"Edit",(function(){return y}));var a=n(18),i=n(14),o=n(3),s=n(4),r=n(5),c=n(6),l=n(0),u=n.n(l),d=n(12),v=n(13),h=n(19),p=n(15),k=n(1),f=n.n(k),m=function(t){Object(c.a)(n,t);var e=Object(r.a)(n);function n(t){var a;return Object(o.a)(this,n),(a=e.call(this,t)).changeContent=function(t){return a.setState(t)},a.state=u.a.createElement(g,{key:"viz_list"}),a}return Object(s.a)(n,[{key:"render",value:function(){return u.a.createElement(l.Fragment,null,this.state)}}]),n}(l.Component),g=function(t){Object(c.a)(n,t);var e=Object(r.a)(n);function n(t){var a;return Object(o.a)(this,n),(a=e.call(this,t)).listItem=function(t){return[t.id,t.name,u.a.createElement(l.Fragment,null,u.a.createElement(h.EditButton,{key:"vl_btn_edt_"+t.id,onClick:function(){return a.changeContent(u.a.createElement(y,{key:"viz_edit_"+t.id,id:t.id,changeSelf:a.changeContent,type:"map"}))},title:"Show and edit map"}),u.a.createElement(h.NetworkButton,{key:"vl_btn_net_"+t.id,onClick:function(){return window.open("viz.html?id=".concat(t.id),"_blank")},title:"Show resulting map"}),u.a.createElement(h.DeleteButton,{key:"vl_btn_del_"+t.id,onClick:function(){return a.deleteList(t.id)}}))]},a.changeContent=function(t){return a.setState({content:t})},a.deleteList=function(t){return window.confirm("Delete map?")&&Object(d.d)("api/visualize/delete",{id:t}).then((function(e){return e.deleted&&a.setState({data:a.state.data.filter((function(e){return e.id!==t})),content:null})}))},a.state={},a}return Object(s.a)(n,[{key:"componentDidMount",value:function(){var t=this;Object(d.d)("api/visualize/list").then((function(e){t.setState(e)}))}},{key:"render",value:function(){var t=this;return u.a.createElement(l.Fragment,null,u.a.createElement(v.ContentList,{key:"vl_cl",header:"Maps",thead:["ID","Name",""],trows:this.state.data,listItem:this.listItem},u.a.createElement(h.ReloadButton,{key:"vl_btn_reload",onClick:function(){return t.componentDidMount()}})),u.a.createElement(v.ContentData,{key:"vl_cd"},this.state.content))}}]),n}(l.Component),y=function(t){Object(c.a)(l,t);var e=Object(r.a)(l);function l(t){var s;return Object(o.a)(this,l),(s=e.call(this,t)).changeImport=function(t){return n.e(0).then(n.bind(null,38)).then((function(e){return s.props.changeSelf(u.a.createElement(e.Info,{key:"di_"+t,id:t}))}))},s.onChange=function(t){return s.setState({data:Object(i.a)({},s.state.data,Object(a.a)({},t.target.name,t.target.value))})},s.jsonHandler=function(t){var e=Object(i.a)({},s.state.data);try{e[t.target.name]=JSON.parse(t.target.value),s.setState({data:e})}catch(n){console.log("Error converting string to JSON")}},s.updateInfo=function(){return Object(d.d)("api/visualize/network",Object(i.a)({op:"update"},s.state.data)).then((function(t){return s.setState(t)}))},s.doubleClick=function(t){console.log("DoubleClick",t.nodes[0]),s.props.changeSelf&&s.changeImport(t.nodes[0])},s.toggleEdit=function(){s.edit=!s.edit,s.viz.network.setOptions({manipulation:{enabled:s.edit}}),s.setState({result:"Edit:"+s.edit})},s.toggleFix=function(){s.viz.nodes.forEach((function(t,e){return s.viz.nodes.update({id:e,fixed:!t.fixed})})),s.setState({data:Object(i.a)({},s.state.data,{nodes:s.viz.nodes.get()}),result:"Fix/Unfix positions"})},s.togglePhysics=function(){var t=s.state.data;t.options.physics.enabled=!t.options.physics.enabled,s.viz.network.setOptions({physics:t.options.physics.enabled}),s.setState({data:t,physics_button:t.options.physics.enabled?h.StopButton:h.StartButton,result:"Physics:"+t.options.physics.enabled})},s.networkSync=function(t){s.viz.network.storePositions(),s.setState({data:Object(i.a)({},s.state.data,{nodes:s.viz.nodes.get(),edges:s.viz.edges.get()}),result:"Moved "+s.viz.nodes.get(t.nodes[0]).label})},s.showDiv=function(t){return t===s.state.content?{display:"block"}:{display:"none"}},s.state={content:"network",physics_button:h.StartButton,found:!0,data:{name:"N/A"},result:""},s.viz={network:null,nodes:null,edges:null},s.canvas=u.a.createRef(),s.edit=!1,s}return Object(s.a)(l,[{key:"componentDidMount",value:function(){var t=this;n.e(23).then(n.bind(null,60)).then((function(e){Object(d.d)("api/visualize/network",{id:t.props.id,type:t.props.type}).then((function(n){t.viz.nodes=new e.DataSet(n.data.nodes),t.viz.edges=new e.DataSet(n.data.edges),n.data.options.physics.enabled=!0,n.data.options.clickToUse=!0,t.viz.network=new e.Network(t.canvas.current,{nodes:t.viz.nodes,edges:t.viz.edges},n.data.options),t.viz.network.on("stabilizationIterationsDone",(function(){return t.viz.network.setOptions({physics:!1})})),t.viz.network.on("doubleClick",(function(e){return t.doubleClick(e)})),t.viz.network.on("dragEnd",(function(e){return t.networkSync(e)})),n.data.options.physics.enabled=!1,t.setState(n)}))}))}},{key:"render",value:function(){var t=this,e=this.state.physics_button;return u.a.createElement(v.Article,{key:"viz_art",header:"Network Map"},"device"===this.props.type&&this.props.changeSelf&&u.a.createElement(h.BackButton,{key:"viz_back",onClick:function(){return t.changeImport(t.props.id)}}),u.a.createElement(h.ReloadButton,{key:"viz_reload",onClick:function(){return t.componentDidMount()}}),u.a.createElement(h.EditButton,{key:"viz_edit",onClick:function(){return t.toggleEdit()}}),u.a.createElement(e,{key:"viz_physics",onClick:function(){return t.togglePhysics()}}),u.a.createElement(h.FixButton,{key:"viz_fix",onClick:function(){return t.toggleFix()}}),u.a.createElement(h.SaveButton,{key:"viz_save",onClick:function(){return t.updateInfo()}}),u.a.createElement(h.NetworkButton,{key:"viz_net",onClick:function(){return t.setState({content:"network"})}}),u.a.createElement(h.TextButton,{key:"viz_opt",text:"Options",onClick:function(){return t.setState({content:"options"})}}),u.a.createElement(h.TextButton,{key:"viz_nodes",text:"Nodes",onClick:function(){return t.setState({content:"nodes"})}}),u.a.createElement(h.TextButton,{key:"viz_edges",text:"Edges",onClick:function(){return t.setState({content:"edges"})}}),u.a.createElement(p.TextInput,{key:"viz_name",id:"name",value:this.state.data.name,onChange:this.onChange}),u.a.createElement(v.Result,{key:"viz_result",result:this.state.result}),u.a.createElement("div",{className:f.a.network,style:this.showDiv("network"),ref:this.canvas}),u.a.createElement("div",{className:f.a.network,style:this.showDiv("options")},u.a.createElement("textarea",{id:"options",name:"options",value:JSON.stringify(this.state.data.options,void 0,2),onChange:this.jsonHandler})),u.a.createElement("div",{className:f.a.network,style:this.showDiv("nodes")},u.a.createElement("textarea",{id:"nodes",name:"nodes",value:JSON.stringify(this.state.data.nodes,void 0,2),onChange:this.jsonHandler})),u.a.createElement("div",{className:f.a.network,style:this.showDiv("edges")},u.a.createElement("textarea",{id:"edges",name:"edges",value:JSON.stringify(this.state.data.edges,void 0,2),onChange:this.jsonHandler})))}}]),l}(l.Component)}}]);
//# sourceMappingURL=3.e790c9f3.chunk.js.map