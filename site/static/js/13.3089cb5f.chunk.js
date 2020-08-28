(this.webpackJsonprims=this.webpackJsonprims||[]).push([[13],{42:function(e,t,n){"use strict";n.r(t),n.d(t,"Main",(function(){return y})),n.d(t,"DomainList",(function(){return v}));var a=n(19),r=n(18),i=n(14),o=n(4),c=n(5),s=n(6),u=n(7),l=n(0),d=n.n(l),m=n(12),h=n(13),p=n(15),f=n(20),y=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(){var e;Object(o.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).changeContent=function(t){return e.setState(t)},e}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.setState(d.a.createElement(v,{key:"domain_list"}))}},{key:"render",value:function(){return d.a.createElement(d.a.Fragment,null,this.state)}}]),n}(l.Component),v=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(o.a)(this,n),(a=t.call(this,e)).listItem=function(e){return[e.id,e.name,e.service,d.a.createElement(d.a.Fragment,null,d.a.createElement(f.ConfigureButton,{key:"info",onClick:function(){return a.changeContent(d.a.createElement(k,{key:"domain_info",id:e.id}))},title:"Edit domain information"}),d.a.createElement(f.ItemsButton,{key:"items",onClick:function(){return a.changeContent(d.a.createElement(E,{changeSelf:a.changeContent,key:"record_list",domain_id:e.id}))},title:"View domain records"}),d.a.createElement(f.DeleteButton,{key:"del",onClick:function(){return a.deleteList(e.id)},title:"Delete domain"}))]},a.changeContent=function(e){return a.setState({content:e})},a.deleteList=function(e){return window.confirm("Really delete domain")&&Object(m.d)("api/dns/domain_delete",{id:e}).then((function(t){t.deleted&&(a.setState({data:a.state.data.filter((function(t){return t.id!==e}))}),a.changeContent(null))}))},a.state={},a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(m.d)("api/dns/domain_list").then((function(t){t.result="OK",e.setState(t)}))}},{key:"syncDomains",value:function(){var e=this;Object(m.d)("api/dns/domain_list",{sync:!0}).then((function(t){t.result="NS:"+t.ns.status+", Recursors:"+t.rec.status,e.setState(t)}))}},{key:"render",value:function(){var e=this;return d.a.createElement(d.a.Fragment,null,d.a.createElement(h.ContentList,{key:"cl",header:"Domains",thead:["ID","Domain","Server",""],trows:this.state.data,listItem:this.listItem,result:this.state.result},d.a.createElement(f.ReloadButton,{key:"reload",onClick:function(){return e.componentDidMount()}}),d.a.createElement(f.AddButton,{key:"add",onClick:function(){return e.changeContent(d.a.createElement(k,{key:"domain_info",id:"new"}))},title:"Add domain"}),d.a.createElement(f.SyncButton,{key:"sync",onClick:function(){return e.syncDomains()},title:"Sync external DNS servers with cache"}),d.a.createElement(f.HealthButton,{key:"stats",onClick:function(){return e.changeContent(d.a.createElement(C,{key:"recursor_statistics"}))},title:"View DNS statistics"})),d.a.createElement(h.ContentData,{key:"cda",mountUpdate:function(t){return e.changeContent=t}}))}}]),n}(l.Component),k=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(o.a)(this,n),(a=t.call(this,e)).onChange=function(e){return a.setState({data:Object(i.a)({},a.state.data,Object(r.a)({},e.target.name,e.target.value))})},a.changeContent=function(e){return a.setState({content:e})},a.updateInfo=function(){return Object(m.d)("api/dns/domain_info",Object(i.a)({op:"update"},a.state.data)).then((function(e){return a.setState(e)}))},a.state={data:null},a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(e){e!==this.props&&this.componentDidMount()}},{key:"componentDidMount",value:function(){var e=this;Object(m.d)("api/dns/domain_info",{id:this.props.id}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;if(this.state.data){var t="new"!==this.state.data.id;return d.a.createElement(h.InfoArticle,{key:"ia_dom",header:"Domain"},d.a.createElement(h.InfoColumns,{key:"ic"},t&&d.a.createElement(p.TextLine,{key:"node",id:"node",text:this.state.infra.node}),t&&d.a.createElement(p.TextLine,{key:"service",id:"service",text:this.state.infra.service}),t&&d.a.createElement(p.TextLine,{key:"foreign_id",id:"foreign_id",label:"Foreign ID",text:this.state.infra.foreign_id}),!t&&d.a.createElement(p.SelectInput,{key:"server_id",id:"server_id",label:"Server",value:this.state.data.server_id,onChange:this.onChange},this.state.servers.map((function(e,t){return d.a.createElement("option",{key:"srv_"+t,value:e.id},"".concat(e.service,"@").concat(e.node))}))),d.a.createElement(p.TextInput,{key:"name",id:"name",value:this.state.data.name,onChange:this.onChange}),d.a.createElement(p.TextInput,{key:"master",id:"master",value:this.state.data.master,onChange:this.onChange}),d.a.createElement(p.TextInput,{key:"type",id:"type",value:this.state.data.type,onChange:this.onChange}),d.a.createElement(p.TextLine,{key:"serial",id:"serial",text:this.state.data.serial})),d.a.createElement(f.SaveButton,{key:"save",onClick:function(){return e.updateInfo()},title:"Save domain information"}))}return d.a.createElement(h.Spinner,null)}}]),n}(l.Component),C=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(o.a)(this,n),(a=t.call(this,e)).state={},a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(m.d)("api/dns/statistics").then((function(t){for(var n=[],r=function(){var e=Object(a.a)(o[i],2),t=e[0],r=e[1],c=t.split("_");r.forEach((function(e){return n.push([c[0],c[1],e[0],e[1],e[2]])}))},i=0,o=Object.entries(t.queries);i<o.length;i++)r();for(var c=[],s=function(){var e=Object(a.a)(l[u],2),t=e[0],n=e[1],r=t.split("_");n.forEach((function(e){return c.push([r[0],r[1],e[0],e[1]])}))},u=0,l=Object.entries(t.remotes);u<l.length;u++)s();e.setState({queries:n,remotes:c})}))}},{key:"render",value:function(){return this.state.queries&&this.state.remotes?d.a.createElement(h.Flex,{key:"statistics_flex"},d.a.createElement(h.ContentReport,{key:"queries_cr",header:"Looked up FQDN",thead:["Node","Service","Hits","FQDN","Type"],trows:this.state.queries,listItem:function(e){return e}}),d.a.createElement(h.ContentReport,{key:"remotes_cr",header:"Queriers",thead:["Node","Service","Hits","Who"],trows:this.state.remotes,listItem:function(e){return e}})):d.a.createElement(h.Spinner,null)}}]),n}(l.Component),E=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(o.a)(this,n),(a=t.call(this,e)).changeContent=function(e){return a.props.changeSelf(e)},a.listItem=function(e){return[e.name,e.content,e.type,e.ttl,d.a.createElement(d.a.Fragment,null,d.a.createElement(f.ConfigureButton,{key:"info",onClick:function(){return a.changeContent(d.a.createElement(g,Object.assign({key:"record_info",domain_id:a.props.domain_id,op:"info"},e)))},title:"Configure record"}),["A","AAAA","CNAME","PTR"].includes(e.type)&&d.a.createElement(f.DeleteButton,{key:"del",onClick:function(){return a.deleteList(e.name,e.type)},title:"Delete record"}))]},a.deleteList=function(e,t){return window.confirm("Delete record?")&&Object(m.d)("api/dns/record_delete",{domain_id:a.props.domain_id,name:e,type:t}).then((function(n){return n.deleted&&a.setState({data:a.state.data.filter((function(n){return!(n.name===e&&n.type===t)}))})}))},a.state={},a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(e){e!==this.props&&this.componentDidMount()}},{key:"componentDidMount",value:function(){var e=this;Object(m.d)("api/dns/record_list",{domain_id:this.props.domain_id}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this,t=this.state.status;if(t){if("OK"===t){var n=this.state.data;return d.a.createElement(h.ContentReport,{key:"rl_cr",header:"Records",thead:["Name","Content","Type","TTL",""],trows:n,listItem:this.listItem,result:this.state.result},d.a.createElement(f.ReloadButton,{key:"reload",onClick:function(){return e.componentDidMount()}}),d.a.createElement(f.AddButton,{key:"add",onClick:function(){return e.changeContent(d.a.createElement(g,{key:"record_info",domain_id:e.props.domain_id,name:"new",op:"new"}))},title:"Add DNS record"}))}return d.a.createElement(h.CodeArticle,{key:"ca_rl"},"Error retrieving record list: ",JSON.stringify(this.state.info))}return d.a.createElement(h.Spinner,null)}}]),n}(l.Component),g=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(o.a)(this,n),(a=t.call(this,e)).onChange=function(e){return a.setState({data:Object(i.a)({},a.state.data,Object(r.a)({},e.target.name,e.target.value))})},a.updateInfo=function(){return Object(m.d)("api/dns/record_info",Object(i.a)({op:a.state.op},a.state.data)).then((function(e){a.setState(Object(i.a)({op:"OK"===e.status?"update":a.state.op},e))}))},a.state={data:null,info:void 0},"info"===a.props.op?(a.state.data={domain_id:a.props.domain_id,name:a.props.name,type:a.props.type,ttl:a.props.ttl,content:a.props.content},a.state.op="update"):(a.state.data={domain_id:a.props.domain_id,name:"",type:"A",ttl:3600,content:""},a.state.op="insert"),a}return Object(c.a)(n,[{key:"render",value:function(){var e=this;return this.state.data?d.a.createElement(h.InfoArticle,{key:"rec_art",header:"Record"},d.a.createElement(h.InfoColumns,{key:"ic"},d.a.createElement(p.TextInput,{key:"name",id:"name",value:this.state.data.name,title:"E.g. A:FQDN, PTR:x.y.z.in-addr.arpa",onChange:this.onChange,placeholder:"name"}),d.a.createElement(p.TextInput,{key:"type",id:"type",value:this.state.data.type,onChange:this.onChange,placeholder:"A, PTR or CNAME typically"}),d.a.createElement(p.TextInput,{key:"ttl",id:"ttl",label:"TTL",value:this.state.data.ttl,onChange:this.onChange}),d.a.createElement(p.TextInput,{key:"content",id:"content",value:this.state.data.content,title:"E.g. A:IP, PTR:x.y.x-inaddr.arpa, CNAME:A - remember dot on PTR/CNAME",onChange:this.onChange,placeholder:"content"}),this.props.serial&&d.a.createElement(p.TextLine,{key:"serial",id:"serial",text:this.props.serial})),d.a.createElement(f.SaveButton,{key:"save",onClick:function(){return e.updateInfo()},title:"Save record information"}),d.a.createElement(h.Result,{key:"result",result:"OK"!==this.state.status?JSON.stringify(this.state.info):"OK"})):d.a.createElement(h.Spinner,null)}}]),n}(l.Component)}}]);
//# sourceMappingURL=13.3089cb5f.chunk.js.map