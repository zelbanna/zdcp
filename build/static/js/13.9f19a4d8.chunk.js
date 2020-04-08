(this.webpackJsonprims=this.webpackJsonprims||[]).push([[13],{37:function(e,t,n){"use strict";n.r(t),n.d(t,"Main",(function(){return y})),n.d(t,"Info",(function(){return b})),n.d(t,"Report",(function(){return _}));var a=n(9),r=n(13),i=n(3),c=n(4),o=n(6),l=n(5),u=n(7),s=n(0),d=n.n(s),h=n(8),v=n(1),m=n(10),f=n(2),p=n(11),y=function(e){function t(){var e,a;Object(i.a)(this,t);for(var r=arguments.length,c=new Array(r),u=0;u<r;u++)c[u]=arguments[u];return(a=Object(o.a)(this,(e=Object(l.a)(t)).call.apply(e,[this].concat(c)))).changeLocation=function(){return n.e(3).then(n.bind(null,28)).then((function(e){return a.setState(d.a.createElement(e.List,{key:"location_list"}))}))},a.changeContent=function(e){return a.setState(e)},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.context.loadNavigation(d.a.createElement(p.a,{key:"inventory_navbar"},d.a.createElement(p.d,{key:"inv_nav_inv",title:"Inventory"},d.a.createElement(p.c,{key:"inv_nav_srch",title:"Search",onClick:function(){return e.changeContent(d.a.createElement(C,{key:"search_list",changeSelf:e.changeContent}))}}),d.a.createElement(p.c,{key:"inv_nav_vend",title:"Vendor",onClick:function(){return e.changeContent(d.a.createElement(g,{key:"vendor_list",changeSelf:e.changeContent}))}}),d.a.createElement(p.c,{key:"inv_nav_list",title:"List",onClick:function(){return e.changeContent(d.a.createElement(k,{key:"list",changeSelf:e.changeContent}))}})),d.a.createElement(p.b,{key:"inv_nav_loc",title:"Locations",onClick:function(){return e.changeLocation()}})))}},{key:"render",value:function(){return d.a.createElement(s.Fragment,{key:"main_base"},this.state)}}]),t}(s.Component);y.contextType=v.RimsContext;var k=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).listItem=function(e){return[e.id,e.serial,e.model,d.a.createElement(s.Fragment,{key:"inventory_buttons_"+e.id},d.a.createElement(f.InfoButton,{key:"inv_btn_info_"+e.id,onClick:function(){return n.changeContent(d.a.createElement(b,{key:"inventory_"+e.id,id:e.id}))},title:"View inventory item"}),d.a.createElement(f.DeleteButton,{key:"inv_btn_delete_"+e.id,onClick:function(){return n.deleteList(e.id)},title:"Delete inventory item"}))]},n.searchHandler=function(e){return n.setState({searchfield:e.target.value})},n.changeContent=function(e){return n.setState({content:e})},n.deleteList=function(e){return window.confirm("Really delete item")&&Object(h.b)("api/inventory/delete",{id:e}).then((function(t){return t.deleted&&n.setState({data:n.state.data.filter((function(t){return t.id!==e})),content:null})}))},n.state={searchfield:""},n}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(h.b)("api/inventory/list",this.props.args).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;if(this.state.data){var t=this.state.data.filter((function(t){return t.model.includes(e.state.searchfield)||t.serial.includes(e.state.searchfield)}));return d.a.createElement(s.Fragment,{key:"inv_fragment"},d.a.createElement(v.ContentList,{key:"inv_cl",header:"Inventory",thead:["ID","Serial","Model",""],trows:t,listItem:this.listItem,result:this.state.result},d.a.createElement(f.ReloadButton,{key:"inv_btn_reload",onClick:function(){return e.componentDidMount()}}),d.a.createElement(f.AddButton,{key:"inv_btn_add",onClick:function(){return e.changeContent(d.a.createElement(b,{key:"inventory_new_"+Object(h.c)(),id:"new"}))},title:"Add inventory item"}),d.a.createElement(v.SearchField,{key:"dl_searchfield",searchHandler:this.searchHandler,value:this.state.searchfield,placeholder:"Search inventory"})),d.a.createElement(v.ContentData,{key:"inv_cd"},this.state.content))}return d.a.createElement(v.Spinner,null)}}]),t}(s.Component),C=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).changeContent=function(e){return n.props.changeSelf(e)},n.onChange=function(e){return n.setState({data:Object(r.a)({},n.state.data,Object(a.a)({},e.target.name,e.target["checkbox"!==e.target.type?"value":"checked"]))})},n.state={data:{field:"serial",search:""}},n}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return d.a.createElement("article",{className:"lineinput"},d.a.createElement("h1",null,"Inventory Search"),d.a.createElement("div",null,d.a.createElement(m.SelectInput,{key:"field",id:"field",value:this.state.data.field,onChange:this.onChange},d.a.createElement("option",{value:"serial"},"Serial"),d.a.createElement("option",{value:"vendor"},"Vendor")),d.a.createElement(m.TextInput,{key:"search",id:"search",value:this.state.data.search,placeholder:"search",onChange:this.onChange})),d.a.createElement(f.SearchButton,{key:"inv_btn_search",onClick:function(){return e.changeContent(d.a.createElement(k,{key:"inventory_list",args:e.state.data}))},title:"Search inventory"}))}}]),t}(s.Component),b=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).onChange=function(e){return n.setState({data:Object(r.a)({},n.state.data,Object(a.a)({},e.target.name,e.target["checkbox"!==e.target.type?"value":"checked"]))})},n.changeContent=function(e){return n.setState({content:e})},n.updateInfo=function(){return Object(h.b)("api/inventory/info",Object(r.a)({op:"update"},n.state.data)).then((function(e){return n.setState(e)}))},n.state={data:null,found:!0},n}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(h.b)("api/inventory/info",{id:this.props.id}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;if(this.state.data){var t=this.state.data;return d.a.createElement("article",{className:"info"},d.a.createElement("h1",null,"Inventory Item"),d.a.createElement(v.InfoColumns,{key:"inventory_content"},d.a.createElement(m.TextInput,{key:"vendor",id:"vendor",value:t.vendor,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"serial",id:"serial",label:"S/N",value:t.serial,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"product",id:"product",value:t.product,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"model",id:"model",value:t.model,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"description",id:"description",value:t.description,onChange:this.onChange}),d.a.createElement(m.SelectInput,{key:"location_id",id:"location_id",label:"Location",value:t.location_id,onChange:this.onChange},this.state.locations.map((function(e,t){return d.a.createElement("option",{key:"ii_"+t,value:e.id},e.name)}))),d.a.createElement(m.DateInput,{key:"receive_date",id:"receive_date",label:"Received",value:t.receive_date,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"purchase_order",id:"purchase_order",label:"Purchase Order",value:t.purchase_order,onChange:this.onChange}),d.a.createElement(m.CheckboxInput,{key:"license",id:"license",value:t.license,onChange:this.onChange}),t.license&&d.a.createElement(m.TextInput,{key:"license_key",id:"license_key",label:"Key",value:t.license_key,onChange:this.onChange}),d.a.createElement(m.CheckboxInput,{key:"support_contract",id:"support_contract",value:t.support_contract,onChange:this.onChange}),t.support_contract&&d.a.createElement(m.DateInput,{key:"support_end_date",id:"support_end_date",label:"Contract End",value:t.support_end_date,onChange:this.onChange}),d.a.createElement(m.TextInput,{key:"comments",id:"comments",value:t.comments,onChange:this.onChange})),d.a.createElement(f.ReloadButton,{key:"inv_btn_reload",onClick:function(){return e.componentDidMount()}}),d.a.createElement(f.SaveButton,{key:"inv_btn_save",onClick:function(){return e.updateInfo()},title:"Save"}))}return d.a.createElement(v.Spinner,null)}}]),t}(s.Component),g=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).changeContent=function(e){return n.props.changeSelf(e)},n.listItem=function(e){return[d.a.createElement(f.HrefButton,{key:"search_"+e.vendor,text:e.vendor,onClick:function(){return n.changeContent(d.a.createElement(k,{key:"inventory_list",args:{field:"vendor",search:e.vendor}}))}}),e.count]},n.state={},n}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(h.b)("api/inventory/vendor_list").then((function(t){return e.setState(t)}))}},{key:"render",value:function(){return d.a.createElement(s.Fragment,{key:"inv_fragment"},d.a.createElement(v.ContentList,{key:"inv_cl",header:"Vendors",thead:["Name","Count"],trows:this.state.data,listItem:this.listItem}),d.a.createElement(v.ContentData,{key:"inv_cd"},this.state.content))}}]),t}(s.Component),_=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).listItem=function(e){return[e.id,e.serial,e.vendor,e.model,e.product,e.description]},n.state={},n}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(h.b)("api/inventory/list",{extra:["vendor","product","description"],sort:"vendor"}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){return d.a.createElement(v.ContentReport,{key:"inv_cr",header:"Inventory",thead:["ID","Serial","Vendor","Model","Product","Description"],trows:this.state.data,listItem:this.listItem})}}]),t}(s.Component)}}]);
//# sourceMappingURL=13.9f19a4d8.chunk.js.map