(this.webpackJsonprims=this.webpackJsonprims||[]).push([[17],{52:function(e,t,n){"use strict";n.r(t),n.d(t,"List",(function(){return k})),n.d(t,"LogShow",(function(){return y}));var a=n(18),o=n(14),r=n(4),i=n(5),c=n(6),l=n(7),d=n(0),u=n.n(d),s=n(12),h=n(13),m=n(16),f=n(15),p=n(20),k=function(e){Object(l.a)(List,e);var t=Object(c.a)(List);function List(e){var n;return Object(r.a)(this,List),(n=t.call(this,e)).listItem=function(e){return[e.node,e.url,u.a.createElement(u.a.Fragment,null,u.a.createElement(p.InfoButton,{key:"info",onClick:function onClick(){return n.changeContent(u.a.createElement(g,{key:"node_info",id:e.id}))},title:"Node information"}),u.a.createElement(p.DeleteButton,{key:"del",onClick:function onClick(){return n.deleteList(e.id)},title:"Delete node"}))]},n.deleteList=function(e){return window.confirm("Really delete node?")&&Object(s.d)("api/master/node_delete",{id:e}).then((function(t){t.deleted&&(n.setState({data:n.state.data.filter((function(t){return t.id!==e}))}),n.changeContent(null))}))},n.state={},n}return Object(i.a)(List,[{key:"componentDidMount",value:function componentDidMount(){var e=this;Object(s.d)("api/master/node_list").then((function(t){return e.setState(t)}))}},{key:"render",value:function render(){var e=this;return u.a.createElement(u.a.Fragment,null,u.a.createElement(h.ContentList,{key:"cl",header:"Nodes",thead:["Node","URL",""],trows:this.state.data,listItem:this.listItem},u.a.createElement(p.ReloadButton,{key:"reload",onClick:function onClick(){return e.componentDidMount()}}),u.a.createElement(p.AddButton,{key:"add",onClick:function onClick(){return e.changeContent(u.a.createElement(g,{key:"node_info",id:"new"}))},title:"Add node"})),u.a.createElement(h.ContentData,{key:"cda",mountUpdate:function mountUpdate(t){return e.changeContent=t}}))}}]),List}(d.Component),g=function(e){Object(l.a)(Info,e);var t=Object(c.a)(Info);function Info(e){var n;return Object(r.a)(this,Info),(n=t.call(this,e)).searchInfo=function(){return Object(s.d)("api/device/search",{node:n.state.data.node}).then((function(e){return e.found&&n.setState({data:Object(o.a)({},n.state.data,{hostname:e.data.hostname,device_id:e.data.id})})}))},n.onChange=function(e){return n.setState({data:Object(o.a)({},n.state.data,Object(a.a)({},e.target.name,e.target.value))})},n.changeContent=function(e){return n.setState({content:e})},n.updateInfo=function(){return Object(s.d)("api/master/node_info",Object(o.a)({op:"update"},n.state.data)).then((function(e){return n.setState(e)}))},n.state={data:null,found:!0},n}return Object(i.a)(Info,[{key:"componentDidUpdate",value:function componentDidUpdate(e){e!==this.props&&this.componentDidMount()}},{key:"componentDidMount",value:function componentDidMount(){var e=this;Object(s.d)("api/master/node_info",{id:this.props.id}).then((function(t){return e.setState(t)}))}},{key:"render",value:function render(){var e=this;if(this.state.found){if(this.state.data){var t=this.state.data.id,n="new"!==t;return u.a.createElement(u.a.Fragment,null,u.a.createElement(h.InfoArticle,{key:"ia_node",header:"Node"},u.a.createElement(h.InfoColumns,{key:"ic"},u.a.createElement(f.TextInput,{key:"node",id:"node",value:this.state.data.node,onChange:this.onChange}),u.a.createElement(f.UrlInput,{key:"url",id:"url",value:this.state.data.url,onChange:this.onChange}),u.a.createElement(f.TextInput,{key:"hostname",id:"hostname",value:this.state.data.hostname,onChange:this.onChange})),u.a.createElement(p.SaveButton,{key:"save",onClick:function onClick(){return e.updateInfo()},title:"Save information"}),n&&!this.state.data.hostname&&u.a.createElement(p.SearchButton,{key:"search",onClick:this.searchInfo,title:"Try to map node to device"}),n&&u.a.createElement(p.ReloadButton,{key:"reload",onClick:function onClick(){return e.changeContent(u.a.createElement(C,{key:"node_reload_"+t,node:e.state.data.node}))}}),n&&u.a.createElement(p.LogButton,{key:"logs",onClick:function onClick(){return e.changeContent(u.a.createElement(y,{key:"node_logs_"+t,node:e.state.data.node}))},title:"View node logs"}),n&&u.a.createElement(p.DeleteButton,{key:"logc",onClick:function onClick(){return e.changeContent(u.a.createElement(v,{key:"node_logc_"+t,node:e.state.data.node}))},title:"Clear logs"})),u.a.createElement(m.NavBar,{key:"node_navigation",id:"node_navigation"}),this.state.content)}return u.a.createElement(h.Spinner,null)}return u.a.createElement(h.InfoArticle,{key:"ia_node"},"Node with id: ",this.props.id," removed")}}]),Info}(d.Component),C=function(e){Object(l.a)(Reload,e);var t=Object(c.a)(Reload);function Reload(){return Object(r.a)(this,Reload),t.apply(this,arguments)}return Object(i.a)(Reload,[{key:"componentDidMount",value:function componentDidMount(){var e=this;Object(s.d)("api/system/reload",{},{"X-Route":this.props.node}).then((function(t){t?e.setState(t):e.setState({modules:["error reloading modules (check REST call)"]})}))}},{key:"render",value:function render(){return this.state?u.a.createElement(h.CodeArticle,{key:"nr_code",header:"Module"},this.state.modules.join("\n")):u.a.createElement(h.Spinner,null)}}]),Reload}(d.Component),v=function(e){Object(l.a)(LogClear,e);var t=Object(c.a)(LogClear);function LogClear(){return Object(r.a)(this,LogClear),t.apply(this,arguments)}return Object(i.a)(LogClear,[{key:"componentDidMount",value:function componentDidMount(){var e=this;Object(s.d)("api/system/logs_clear",{},{"X-Route":this.props.node}).then((function(t){return e.setState({logs:t.file})}))}},{key:"render",value:function render(){return this.state?u.a.createElement(h.CodeArticle,{key:"nc_code",header:"Cleared"},Object.entries(this.state.logs).map((function(e){return"".concat(e[0],": ").concat(e[1])})).join("\n")):u.a.createElement(h.Spinner,null)}}]),LogClear}(d.Component),y=function(e){Object(l.a)(LogShow,e);var t=Object(c.a)(LogShow);function LogShow(e){var n;return Object(r.a)(this,LogShow),(n=t.call(this,e)).state={},n}return Object(i.a)(LogShow,[{key:"componentDidMount",value:function componentDidMount(){var e=this;Object(s.d)("api/system/logs_get",{},{"X-Route":this.props.node}).then((function(t){var n=t?{logs:t}:{error:!0};console.log(n),e.setState(n)}))}},{key:"render",value:function render(){return this.state.logs?u.a.createElement("div",null,Object.entries(this.state.logs).map((function(e,t){return u.a.createElement(h.CodeArticle,{key:t,header:e[0]},e[1].join("\n"))}))):this.state.error?u.a.createElement(h.CodeArticle,null,"error retrieving logs (check REST call)"):u.a.createElement(h.Spinner,null)}}]),LogShow}(d.Component)}}]);
//# sourceMappingURL=17.26348e3b.chunk.js.map