(this.webpackJsonprims=this.webpackJsonprims||[]).push([[3],{43:function(t,e,n){"use strict";n.r(e),n.d(e,"Main",(function(){return f})),n.d(e,"List",(function(){return g})),n.d(e,"Edit",(function(){return y}));var a=n(18),i=n(14),o=n(4),s=n(5),r=n(6),c=n(7),l=n(0),d=n.n(l),u=n(12),h=n(13),p=n(20),k=n(15),v=n(1),m=n.n(v),f=function(t){Object(c.a)(Main,t);var e=Object(r.a)(Main);function Main(t){var n;return Object(o.a)(this,Main),(n=e.call(this,t)).changeContent=function(t){return n.setState(t)},n.state=d.a.createElement(g,{key:"viz_list"}),n}return Object(s.a)(Main,[{key:"render",value:function render(){return d.a.createElement(d.a.Fragment,null,this.state)}}]),Main}(l.Component),g=function(t){Object(c.a)(List,t);var e=Object(r.a)(List);function List(t){var n;return Object(o.a)(this,List),(n=e.call(this,t)).listItem=function(t){return[t.id,t.name,d.a.createElement(d.a.Fragment,null,d.a.createElement(p.EditButton,{key:"edit",onClick:function onClick(){return n.changeContent(d.a.createElement(y,{key:"viz_edit_"+t.id,id:t.id,changeSelf:n.changeContent,type:"map"}))},title:"Show and edit map"}),d.a.createElement(p.NetworkButton,{key:"net",onClick:function onClick(){return window.open("viz.html?id=".concat(t.id),"_blank")},title:"Show resulting map"}),d.a.createElement(p.DeleteButton,{key:"del",onClick:function onClick(){return n.deleteList(t.id)}}))]},n.deleteList=function(t){return window.confirm("Delete map?")&&Object(u.d)("api/visualize/delete",{id:t}).then((function(e){e.deleted&&(n.setState({data:n.state.data.filter((function(e){return e.id!==t}))}),n.changeContent(null))}))},n.state={},n}return Object(s.a)(List,[{key:"componentDidMount",value:function componentDidMount(){var t=this;Object(u.d)("api/visualize/list").then((function(e){t.setState(e)}))}},{key:"render",value:function render(){var t=this;return d.a.createElement(d.a.Fragment,null,d.a.createElement(h.ContentList,{key:"cl",header:"Maps",thead:["ID","Name",""],trows:this.state.data,listItem:this.listItem},d.a.createElement(p.ReloadButton,{key:"reload",onClick:function onClick(){return t.componentDidMount()}})),d.a.createElement(h.ContentData,{key:"cda",mountUpdate:function mountUpdate(e){return t.changeContent=e}}))}}]),List}(l.Component),y=function(t){Object(c.a)(Edit,t);var e=Object(r.a)(Edit);function Edit(t){var s;return Object(o.a)(this,Edit),(s=e.call(this,t)).changeContent=function(t){return s.setState({content:t})},s.changeImport=function(t){return n.e(0).then(n.bind(null,40)).then((function(e){return s.props.changeSelf(d.a.createElement(e.Info,{key:"di_"+t,id:t}))}))},s.onChange=function(t){return s.setState({data:Object(i.a)({},s.state.data,Object(a.a)({},t.target.name,t.target.value))})},s.jsonHandler=function(t){var e=Object(i.a)({},s.state.data);try{e[t.target.name]=JSON.parse(t.target.value),s.setState({data:e})}catch(n){console.log("Error converting string to JSON")}},s.updateInfo=function(){return Object(u.d)("api/visualize/network",Object(i.a)({op:"update"},s.state.data)).then((function(t){return s.setState(t)}))},s.doubleClick=function(t){console.log("DoubleClick",t.nodes[0]),s.props.changeSelf&&s.changeImport(t.nodes[0])},s.toggleEdit=function(){s.edit=!s.edit,s.viz.network.setOptions({manipulation:{enabled:s.edit}}),s.setState({result:"Edit:"+s.edit})},s.toggleFix=function(){s.viz.nodes.forEach((function(t,e){return s.viz.nodes.update({id:e,fixed:!t.fixed})})),s.setState({data:Object(i.a)({},s.state.data,{nodes:s.viz.nodes.get()}),result:"Fix/Unfix positions"})},s.togglePhysics=function(){var t=s.state.data;t.options.physics.enabled=!t.options.physics.enabled,s.viz.network.setOptions({physics:t.options.physics.enabled}),s.setState({data:t,physics_button:t.options.physics.enabled?p.StopButton:p.StartButton,result:"Physics:"+t.options.physics.enabled})},s.networkSync=function(t){s.viz.network.storePositions(),s.setState({data:Object(i.a)({},s.state.data,{nodes:s.viz.nodes.get(),edges:s.viz.edges.get()}),result:"Moved "+s.viz.nodes.get(t.nodes[0]).label})},s.showDiv=function(t){return t===s.state.content?{display:"block"}:{display:"none"}},s.state={content:"network",physics_button:p.StartButton,found:!0,data:{name:"N/A"},result:""},s.viz={network:null,nodes:null,edges:null},s.canvas=d.a.createRef(),s.edit=!1,s}return Object(s.a)(Edit,[{key:"componentDidMount",value:function componentDidMount(){var t=this;n.e(24).then(n.bind(null,62)).then((function(e){Object(u.d)("api/visualize/network",{id:t.props.id,type:t.props.type}).then((function(n){t.viz.nodes=new e.DataSet(n.data.nodes),t.viz.edges=new e.DataSet(n.data.edges),n.data.options.physics.enabled=!0,n.data.options.clickToUse=!0,t.viz.network=new e.Network(t.canvas.current,{nodes:t.viz.nodes,edges:t.viz.edges},n.data.options),t.viz.network.on("stabilizationIterationsDone",(function(){return t.viz.network.setOptions({physics:!1})})),t.viz.network.on("doubleClick",(function(e){return t.doubleClick(e)})),t.viz.network.on("dragEnd",(function(e){return t.networkSync(e)})),n.data.options.physics.enabled=!1,t.setState(n)}))}))}},{key:"render",value:function render(){var t=this,e=this.state.physics_button;return d.a.createElement(h.Article,{key:"viz_art",header:"Network Map"},"device"===this.props.type&&this.props.changeSelf&&d.a.createElement(p.BackButton,{key:"viz_back",onClick:function onClick(){return t.changeImport(t.props.id)}}),d.a.createElement(p.ReloadButton,{key:"viz_reload",onClick:function onClick(){return t.componentDidMount()}}),d.a.createElement(p.EditButton,{key:"viz_edit",onClick:function onClick(){return t.toggleEdit()}}),d.a.createElement(e,{key:"viz_physics",onClick:function onClick(){return t.togglePhysics()}}),d.a.createElement(p.FixButton,{key:"viz_fix",onClick:function onClick(){return t.toggleFix()}}),d.a.createElement(p.SaveButton,{key:"viz_save",onClick:function onClick(){return t.updateInfo()}}),d.a.createElement(p.NetworkButton,{key:"viz_net",onClick:function onClick(){return t.changeContent("network")}}),d.a.createElement(p.TextButton,{key:"viz_opt",text:"Options",onClick:function onClick(){return t.changeContent("options")}}),d.a.createElement(p.TextButton,{key:"viz_nodes",text:"Nodes",onClick:function onClick(){return t.changeContent("nodes")}}),d.a.createElement(p.TextButton,{key:"viz_edges",text:"Edges",onClick:function onClick(){return t.changeContent("edges")}}),d.a.createElement(k.TextInput,{key:"viz_name",id:"name",value:this.state.data.name,onChange:this.onChange}),d.a.createElement(h.Result,{key:"viz_result",result:this.state.result}),d.a.createElement("div",{className:m.a.network,style:this.showDiv("network"),ref:this.canvas}),d.a.createElement("div",{className:m.a.network,style:this.showDiv("options")},d.a.createElement("textarea",{id:"options",name:"options",value:JSON.stringify(this.state.data.options,void 0,2),onChange:this.jsonHandler})),d.a.createElement("div",{className:m.a.network,style:this.showDiv("nodes")},d.a.createElement("textarea",{id:"nodes",name:"nodes",value:JSON.stringify(this.state.data.nodes,void 0,2),onChange:this.jsonHandler})),d.a.createElement("div",{className:m.a.network,style:this.showDiv("edges")},d.a.createElement("textarea",{id:"edges",name:"edges",value:JSON.stringify(this.state.data.edges,void 0,2),onChange:this.jsonHandler})))}}]),Edit}(l.Component)}}]);
//# sourceMappingURL=3.4c62fa70.chunk.js.map