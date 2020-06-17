(this.webpackJsonprims=this.webpackJsonprims||[]).push([[17],{50:function(e,t,n){"use strict";n.r(t),n.d(t,"List",(function(){return k})),n.d(t,"LogShow",(function(){return j}));var a=n(18),o=n(14),r=n(3),i=n(4),c=n(5),l=n(6),u=n(0),s=n.n(u),d=n(12),h=n(13),m=n(16),f=n(15),p=n(19),k=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).listItem=function(e){return[e.node,e.url,s.a.createElement(s.a.Fragment,null,s.a.createElement(p.InfoButton,{key:"info",onClick:function(){return a.changeContent(s.a.createElement(v,{key:"node_info",id:e.id}))},title:"Node information"}),s.a.createElement(p.DeleteButton,{key:"del",onClick:function(){return a.deleteList(e.id)},title:"Delete node"}))]},a.changeContent=function(e){return a.setState({content:e})},a.deleteList=function(e){return window.confirm("Really delete node?")&&Object(d.d)("api/master/node_delete",{id:e}).then((function(t){return t.deleted&&a.setState({data:a.state.data.filter((function(t){return t.id!==e})),content:null})}))},a.state={},a}return Object(i.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(d.d)("api/master/node_list").then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;return s.a.createElement(s.a.Fragment,null,s.a.createElement(h.ContentList,{key:"cl",header:"Nodes",thead:["Node","URL",""],trows:this.state.data,listItem:this.listItem},s.a.createElement(p.ReloadButton,{key:"reload",onClick:function(){return e.componentDidMount()}}),s.a.createElement(p.AddButton,{key:"add",onClick:function(){return e.changeContent(s.a.createElement(v,{key:"node_info",id:"new"}))},title:"Add node"})),s.a.createElement(h.ContentData,{key:"cd"},this.state.content))}}]),n}(u.Component),v=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){var i;return Object(r.a)(this,n),(i=t.call(this,e)).searchInfo=function(){return Object(d.d)("api/device/search",{node:i.state.data.node}).then((function(e){return e.found&&i.setState({data:Object(o.a)({},i.state.data,{hostname:e.data.hostname,device_id:e.data.id})})}))},i.onChange=function(e){return i.setState({data:Object(o.a)({},i.state.data,Object(a.a)({},e.target.name,e.target.value))})},i.changeContent=function(e){return i.setState({content:e})},i.updateInfo=function(){return Object(d.d)("api/master/node_info",Object(o.a)({op:"update"},i.state.data)).then((function(e){return i.setState(e)}))},i.state={data:null,found:!0,content:null},i}return Object(i.a)(n,[{key:"componentDidUpdate",value:function(e){e!==this.props&&this.componentDidMount()}},{key:"componentDidMount",value:function(){var e=this;Object(d.d)("api/master/node_info",{id:this.props.id}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;if(this.state.found){if(this.state.data){var t=this.state.data.id,n="new"!==t;return s.a.createElement(s.a.Fragment,null,s.a.createElement(h.InfoArticle,{key:"ia_node",header:"Node"},s.a.createElement(h.InfoColumns,{key:"ic"},s.a.createElement(f.TextInput,{key:"node",id:"node",value:this.state.data.node,onChange:this.onChange}),s.a.createElement(f.UrlInput,{key:"url",id:"url",value:this.state.data.url,onChange:this.onChange}),s.a.createElement(f.TextInput,{key:"hostname",id:"hostname",value:this.state.data.hostname,onChange:this.onChange})),s.a.createElement(p.SaveButton,{key:"save",onClick:function(){return e.updateInfo()},title:"Save information"}),n&&!this.state.data.hostname&&s.a.createElement(p.SearchButton,{key:"search",onClick:this.searchInfo,title:"Try to map node to device"}),n&&s.a.createElement(p.ReloadButton,{key:"reload",onClick:function(){return e.changeContent(s.a.createElement(y,{key:"node_reload_"+t,node:e.state.data.node}))}}),n&&s.a.createElement(p.LogButton,{key:"logs",onClick:function(){return e.changeContent(s.a.createElement(j,{key:"node_logs_"+t,node:e.state.data.node}))},title:"View node logs"}),n&&s.a.createElement(p.DeleteButton,{key:"logc",onClick:function(){return e.changeContent(s.a.createElement(g,{key:"node_logc_"+t,node:e.state.data.node}))},title:"Clear logs"})),s.a.createElement(m.NavBar,{key:"node_navigation",id:"node_navigation"}),this.state.content)}return s.a.createElement(h.Spinner,null)}return s.a.createElement(h.InfoArticle,{key:"ia_node"},"Node with id: ",this.props.id," removed")}}]),n}(u.Component),y=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(){return Object(r.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(d.d)("api/system/reload",{},{"X-Route":this.props.node}).then((function(t){t?e.setState(t):e.setState({modules:["error reloading modules (check REST call)"]})}))}},{key:"render",value:function(){return this.state?s.a.createElement(h.CodeArticle,{key:"nr_code",header:"Module"},this.state.modules.join("\n")):s.a.createElement(h.Spinner,null)}}]),n}(u.Component),g=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(){return Object(r.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(d.d)("api/system/logs_clear",{},{"X-Route":this.props.node}).then((function(t){return e.setState({logs:t.file})}))}},{key:"render",value:function(){return this.state?s.a.createElement(h.CodeArticle,{key:"nc_code",header:"Cleared"},Object.entries(this.state.logs).map((function(e){return"".concat(e[0],": ").concat(e[1])})).join("\n")):s.a.createElement(h.Spinner,null)}}]),n}(u.Component),j=function(e){Object(l.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).state={},a}return Object(i.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(d.d)("api/system/logs_get",{},{"X-Route":this.props.node}).then((function(t){var n=t?{logs:t}:{error:!0};console.log(n),e.setState(n)}))}},{key:"render",value:function(){return this.state.logs?s.a.createElement("div",null,Object.entries(this.state.logs).map((function(e,t){return s.a.createElement(h.CodeArticle,{key:t,header:e[0]},e[1].join("\n"))}))):this.state.error?s.a.createElement(h.CodeArticle,null,"error retrieving logs (check REST call)"):s.a.createElement(h.Spinner,null)}}]),n}(u.Component)}}]);
//# sourceMappingURL=17.cbf83ff8.chunk.js.map