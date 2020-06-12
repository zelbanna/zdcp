(this.webpackJsonprims=this.webpackJsonprims||[]).push([[3],{43:function(e,t,n){"use strict";n.r(t),n.d(t,"Main",(function(){return k})),n.d(t,"NetworkList",(function(){return f})),n.d(t,"AddressInfo",(function(){return C}));var a=n(18),r=n(14),i=n(3),o=n(4),s=n(5),c=n(6),l=n(0),d=n.n(l),u=n(12),h=n(13),m=n(15),p=n(19),k=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).changeContent=function(e){return a.setState(e)},a.state=d.a.createElement(f,{key:"network_list"}),a}return Object(o.a)(n,[{key:"render",value:function(){return d.a.createElement(l.Fragment,null,this.state)}}]),n}(l.Component),f=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).listItem=function(e){return[e.id,e.netasc,e.description,e.service,d.a.createElement(l.Fragment,null,d.a.createElement(p.ConfigureButton,{key:"net_btn_info_"+e.id,onClick:function(){return a.changeContent(d.a.createElement(_,{key:"network_"+e.id,id:e.id}))},title:"Edit network properties"}),d.a.createElement(p.ItemsButton,{key:"net_btn_items2_"+e.id,onClick:function(){return a.changeContent(d.a.createElement(b,{key:"address_list_"+e.id,network_id:e.id,changeSelf:a.changeContent}))},title:"View addresses"}),"v4"===e.class&&d.a.createElement(p.ViewButton,{key:"net_btn_layout_"+e.id,onClick:function(){return a.changeContent(d.a.createElement(v,{key:"address_layout_"+e.id,network_id:e.id,changeSelf:a.changeContent}))},title:"View usage map"}),"v4"===e.class&&d.a.createElement(p.CheckButton,{key:"net_btn_resv_"+e.id,onClick:function(){return a.changeContent(d.a.createElement(g,{key:"resv_list_"+e.id,network_id:e.id,changeSelf:a.changeContent}))},title:"Reserved addresses for network"}),d.a.createElement(p.DeleteButton,{key:"net_btn_delete_"+e.id,onClick:function(){return a.deleteList(e.id)},title:"Delete network"}),d.a.createElement(p.ReloadButton,{key:"net_btn_rset_"+e.id,onClick:function(){return a.resetStatus(e.id)},title:"Reset state for network addresses"}))]},a.changeContent=function(e){return a.setState({content:e})},a.deleteList=function(e){return window.confirm("Really delete network")&&Object(u.d)("api/ipam/network_delete",{id:e}).then((function(t){return t.deleted&&a.setState({data:a.state.data.filter((function(t){return t.id!==e})),content:null})}))},a.resetStatus=function(e){return Object(u.d)("api/ipam/clear",{network_id:e}).then((function(e){return a.setState({result:e.count})}))},a.state={},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/network_list").then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;return d.a.createElement(l.Fragment,null,d.a.createElement(h.ContentList,{key:"nl_cl",header:"Networks",thead:["ID","Network","Description","DHCP",""],trows:this.state.data,listItem:this.listItem,result:this.state.result},d.a.createElement(p.ReloadButton,{key:"nl_btn_reload",onClick:function(){return e.componentDidMount()}}),d.a.createElement(p.AddButton,{key:"nl_btn_add",onClick:function(){return e.changeContent(d.a.createElement(_,{key:"network_new_"+Object(u.e)(),id:"new"}))},title:"Add network"}),d.a.createElement(p.LogButton,{key:"nl_btn_doc",onClick:function(){return e.changeContent(d.a.createElement(y,{key:"network_leases"}))},title:"View IPAM/DHCP leases"})),d.a.createElement(h.ContentData,{key:"nl_cd"},this.state.content))}}]),n}(l.Component),_=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var o;return Object(i.a)(this,n),(o=t.call(this,e)).onChange=function(e){return o.setState({data:Object(r.a)({},o.state.data,Object(a.a)({},e.target.name,e.target.value))})},o.changeContent=function(e){return o.setState({content:e})},o.updateInfo=function(){return Object(u.d)("api/ipam/network_info",Object(r.a)({op:"update"},o.state.data)).then((function(e){return o.setState(e)}))},o.state={data:null,found:!0},o}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/network_info",{id:this.props.id,extra:["servers","domains"]}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;return this.state.data?d.a.createElement(h.InfoArticle,{key:"net_article",header:"Network"},d.a.createElement(h.InfoColumns,{key:"network_content"},d.a.createElement(m.TextLine,{key:"id",id:"id",label:"ID",text:this.state.data.id}),d.a.createElement(m.TextInput,{key:"description",id:"description",value:this.state.data.description,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"network",id:"network",value:this.state.data.network,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"mask",id:"mask",value:this.state.data.mask,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"gateway",id:"gateway",value:this.state.data.gateway,onChange:this.onChange}),d.a.createElement(m.SelectInput,{key:"server_id",id:"server_id",label:"Server",value:this.state.data.server_id,onChange:this.onChange},this.state.servers.map((function(e,t){return d.a.createElement("option",{key:t,value:e.id},"".concat(e.service,"@").concat(e.node))}))),d.a.createElement(m.SelectInput,{key:"reverse_zone_id",id:"reverse_zone_id",label:"Reverse Zone",value:this.state.data.reverse_zone_id,onChange:this.onChange},this.state.domains.map((function(e,t){return d.a.createElement("option",{key:t,value:e.id},"".concat(e.server," (").concat(e.name,")"))})))),d.a.createElement(p.SaveButton,{key:"network_btn_save",onClick:function(){return e.updateInfo()},title:"Save"})):d.a.createElement(h.Spinner,null)}}]),n}(l.Component),v=function(e){Object(c.a)(a,e);var t=Object(s.a)(a);function a(){var e;Object(i.a)(this,a);for(var r=arguments.length,o=new Array(r),s=0;s<r;s++)o[s]=arguments[s];return(e=t.call.apply(t,[this].concat(o))).changeContent=function(t){return e.props.changeSelf(t)},e.changeDevice=function(t){return n.e(0).then(n.bind(null,38)).then((function(n){return e.changeContent(d.a.createElement(n.Info,{key:"di_"+t,id:t}))}))},e.createDevice=function(t,a){return n.e(0).then(n.bind(null,38)).then((function(n){return e.changeContent(d.a.createElement(n.New,{key:"dn_new",ipam_network_id:t,ip:a}))}))},e}return Object(o.a)(a,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/address_list",{network_id:this.props.network_id,dict:"ip_integer",extra:["device_id","reservation","ip_integer"]}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;if(!this.state)return d.a.createElement(h.Spinner,null);var t=function(){for(var t=e.state.data,n=Object(u.c)(e.state.network),a=[],r=function(r){var i=n+r;i in t?t[i].device_id?a.push(d.a.createElement(p.IpamRedButton,{key:"btn_"+i,onClick:function(){return e.changeDevice(t[i].device_id)},text:r%256})):a.push(d.a.createElement(p.IpamGreyButton,{key:"btn_"+i,text:r%256})):a.push(d.a.createElement(p.IpamGreenButton,{key:"btn_"+i,onClick:function(){return e.createDevice(e.props.network_id,Object(u.b)(i))},text:r%256}))},i=0;i<e.state.size;i++)r(i);return{v:d.a.createElement(h.Article,{key:"il_art",header:e.state.network+"/"+e.state.mask},a)}}();return"object"===typeof t?t.v:void 0}}]),a}(l.Component),y=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).listItem=function(e){return[e.ip,e.mac,e.hostname,e.oui,e.starts,e.ends]},a.state={},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/server_leases",{type:"active"}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){return d.a.createElement(h.ContentReport,{key:"lease_cr",header:"Leases",thead:["IP","Mac","Hostname","OUI","Starts","End"],trows:this.state.data,listItem:this.listItem})}}]),n}(l.Component),b=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).changeContent=function(e){return a.props.changeSelf(e)},a.listItem=function(e){return[e.id,e.ip,e.hostname,e.domain,d.a.createElement(l.Fragment,null,d.a.createElement(h.StateLeds,{state:e.state}),d.a.createElement(p.ConfigureButton,{key:"al_btn_info_"+e.id,onClick:function(){return a.changeContent(d.a.createElement(C,{key:"address_info_"+e.id,id:e.id}))},title:"Edit address entry"}),d.a.createElement(p.DocButton,{key:"al_btn_logs_"+e.id,onClick:function(){return a.changeContent(d.a.createElement(E,{key:"address_logs_"+e.id,id:e.id}))},title:"IPAM state logs"}),d.a.createElement(p.DeleteButton,{key:"al_btn_delete_"+e.id,onClick:function(){return a.deleteList(e.id)},title:"Delete address entry"}))]},a.deleteList=function(e){return window.confirm("Delete address?")&&Object(u.d)("api/ipam/address_delete",{id:e}).then((function(t){return t.deleted&&a.setState({data:a.state.data.filter((function(t){return t.id!==e}))})}))},a.state={data:null,result:null},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/address_list",{network_id:this.props.network_id,extra:["hostname","a_domain_id","device_id"]}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;return d.a.createElement(h.ContentReport,{key:"al_cr",header:"Allocated IP Addresses",thead:["ID","IP","Hostname","Domain",""],trows:this.state.data,listItem:this.listItem,result:this.state.result},d.a.createElement(p.ReloadButton,{key:"al_btn_reload",onClick:function(){return e.componentDidMount()}}),d.a.createElement(p.AddButton,{key:"al_btn_add",onClick:function(){return e.changeContent(d.a.createElement(C,{key:"address_new_"+Object(u.e)(),network_id:e.props.network_id,id:"new"}))},title:"Add address entry"}))}}]),n}(l.Component),C=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var o;return Object(i.a)(this,n),(o=t.call(this,e)).onChange=function(e){return o.setState({data:Object(r.a)({},o.state.data,Object(a.a)({},e.target.name,e.target.value))})},o.updateInfo=function(){o.setState({status:void 0}),Object(u.d)("api/ipam/address_info",Object(r.a)({op:"update"},o.state.data)).then((function(e){return o.setState(e)}))},o.state={data:null},o}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/address_info",{id:this.props.id,network_id:this.props.network_id}).then((function(t){return e.setState(t)})),Object(u.d)("api/dns/domain_list",{filter:"forward"}).then((function(t){return e.setState({domains:t.data})}))}},{key:"render",value:function(){var e=this;if(this.state&&this.state.data&&this.state.domains){var t="";return this.state.status&&(t="OK"===this.state.status?"OK":this.state.info),d.a.createElement(h.InfoArticle,{key:"ip_article",header:"IP Address"},d.a.createElement(h.InfoColumns,{key:"ip_content"},d.a.createElement(m.TextLine,{key:"id",id:"id",label:"ID",text:this.state.data.id}),d.a.createElement(m.TextLine,{key:"network",id:"network",text:this.state.extra.network}),d.a.createElement(m.TextInput,{key:"ip",id:"ip",label:"IP",value:this.state.data.ip,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"hostname",id:"hostname",value:this.state.data.hostname,onChange:this.onChange,title:"Hostname when creating FQDN for DNS entry"}),d.a.createElement(m.SelectInput,{key:"a_domain_id",id:"a_domain_id",label:"Domain",value:this.state.data.a_domain_id,onChange:this.onChange},this.state.domains.map((function(e,t){return d.a.createElement("option",{key:t,value:e.id},e.name)})))),d.a.createElement(p.SaveButton,{key:"ip_save",onClick:function(){return e.updateInfo()},title:"Save"}),d.a.createElement(h.Result,{key:"ip_operation",result:t}))}return d.a.createElement(h.Spinner,null)}}]),n}(l.Component),E=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).listItem=function(e,t){return[e.time,d.a.createElement(h.StateLeds,{state:e.state})]},a.clearList=function(){return Object(u.d)("api/ipam/address_events",{op:"clear",id:a.props.id}).then((function(e){return a.setState({events:[]})}))},a.state={},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/address_events",{id:this.props.id}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;return d.a.createElement(h.ContentReport,{key:"alo_cr_"+this.props.id,header:"State changes",thead:["Time",""],trows:this.state.events,listItem:this.listItem},d.a.createElement(p.DeleteButton,{key:"alo_btn_clear",onClick:function(){return e.clearList()},title:"clear logs"}))}}]),n}(l.Component),g=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).deleteList=function(e){return Object(u.d)("api/ipam/reservation_delete",{id:e}).then((function(t){return t.deleted&&a.setState({data:a.state.data.filter((function(t){return t.id!==e}))})}))},a.listItem=function(e,t){return[e.ip,e.type,d.a.createElement(p.DeleteButton,{key:"resv_list_delete_"+e.id,onClick:function(){return a.deleteList(e.id)}})]},a.addEntry=function(){return a.props.changeSelf(d.a.createElement(w,{key:"resv_new_"+a.props.network_id,network_id:a.props.network_id,changeSelf:a.props.changeSelf}))},a.state={},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/reservation_list",{network_id:this.props.network_id}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;return this.state.data?d.a.createElement(h.ContentReport,{key:"resv_list_"+this.props.server_id,header:"Reservations",thead:["IP","Type",""],trows:this.state.data,listItem:this.listItem},d.a.createElement(p.AddButton,{key:"resv_list_add_btn",onClick:function(){return e.addEntry()}})):d.a.createElement(h.Spinner,null)}}]),n}(l.Component),w=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var r;return Object(i.a)(this,n),(r=t.call(this,e)).onChange=function(e){return r.setState(Object(a.a)({},e.target.name,e.target.value))},r.updateInfo=function(){return Object(u.d)("api/ipam/reservation_new",{network_id:r.props.network_id,ip:r.state.ip,type:r.state.type,a_domain_id:r.state.a_domain_id,start:r.state.start,end:r.state.end}).then((function(e){return r.setState({result:e})}))},r.state={ip:"",start:"",end:"",result:void 0,type:"dhcp"},r}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(u.d)("api/ipam/network_info",{id:this.props.network_id}).then((function(t){return e.setState(Object(r.a)({},t.data))})),Object(u.d)("api/dns/domain_list",{filter:"forward"}).then((function(t){return e.setState({domains:t.data})}))}},{key:"render",value:function(){var e=this;if(this.state.domains){var t=this.props.network_id,n=this.state.result?JSON.stringify(this.state.result.resv):"";return d.a.createElement(h.InfoArticle,{key:"dn_article",header:"Reservation Address/Scope"},d.a.createElement("span",null,"Allocate address with either 'ip' or 'start' to 'end' (e.g. a scope)"),d.a.createElement(h.InfoColumns,{key:"dn_content"},d.a.createElement(m.TextLine,{key:"id",id:"network_id",label:"Network ID",text:t}),d.a.createElement(m.TextLine,{key:"network",id:"network",text:this.state.network+"/"+this.state.mask}),d.a.createElement(m.TextInput,{key:"ip",id:"ip",label:"IP",value:this.state.ip,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"start",id:"start",label:"Start IP",value:this.state.start,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"end",id:"end",label:"End IP",value:this.state.end,onChange:this.onChange}),d.a.createElement(m.SelectInput,{key:"type",id:"type",label:"Type",value:this.state.type,onChange:this.onChange},d.a.createElement("option",{key:"dhcp",value:"dhcp"},"dhcp"),d.a.createElement("option",{key:"reservation",value:"reservation"},"reservation")),d.a.createElement(m.SelectInput,{key:"a_domain_id",id:"a_domain_id",label:"Domain",value:this.state.a_domain_id,onChange:this.onChange},this.state.domains.map((function(e,t){return d.a.createElement("option",{key:t,value:e.id},e.name)})))),this.props.changeSelf&&d.a.createElement(p.BackButton,{key:"dn_btn_back",onClick:function(){return e.props.changeSelf(d.a.createElement(g,{key:"resv_list_"+t,network_id:t,changeSelf:e.props.changeSelf}))}}),d.a.createElement(p.SaveButton,{key:"dn_btn_save",onClick:function(){return e.updateInfo()},title:"Save"}),d.a.createElement(h.Result,{key:"dn_operation",result:n}))}return d.a.createElement(h.Spinner,null)}}]),n}(l.Component)}}]);
//# sourceMappingURL=3.a7d1d849.chunk.js.map