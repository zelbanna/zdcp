(this.webpackJsonprims=this.webpackJsonprims||[]).push([[3],{34:function(t,e,n){"use strict";n.r(e),n.d(e,"List",(function(){return k})),n.d(e,"Info",(function(){return p}));var a=n(19),o=n(16),c=n(4),i=n(5),r=n(7),l=n(6),u=n(8),d=n(0),s=n.n(d),f=n(14),m=n(13),h=n(20),b=n(15),k=function(t){function e(t){var n;return Object(c.a)(this,e),(n=Object(r.a)(this,Object(l.a)(e).call(this,t))).changeContent=function(t){return n.setState({content:t})},n.deleteList=function(t){return window.confirm("Really delete location?")&&Object(f.c)("api/location/delete",{id:t}).then((function(e){return e.deleted&&n.setState({data:n.state.data.filter((function(e){return e.id!==t})),content:null})}))},n.listItem=function(t){return[t.id,t.name,s.a.createElement(d.Fragment,{key:"location_buttons_"+t.id},s.a.createElement(h.ConfigureButton,{key:"loc_btn_info_"+t.id,onClick:function(){return n.changeContent(s.a.createElement(p,{key:"location_"+t.id,id:t.id}))},title:"Edit location"}),s.a.createElement(h.DeleteButton,{key:"loc_btn_delete_"+t.id,onClick:function(){return n.deleteList(t.id)},title:"Delete location"}))]},n.state={},n}return Object(u.a)(e,t),Object(i.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(f.c)("api/location/list").then((function(e){return t.setState(e)}))}},{key:"render",value:function(){var t=this;return s.a.createElement(d.Fragment,{key:"loc_fragment"},s.a.createElement(m.ContentList,{key:"loc_cl",header:"Locations",thead:["ID","Name",""],trows:this.state.data,listItem:this.listItem},s.a.createElement(h.ReloadButton,{key:"loc_btn_reload",onClick:function(){return t.componentDidMount()}}),s.a.createElement(h.AddButton,{key:"loc_btn_add",onClick:function(){return t.changeContent(s.a.createElement(p,{key:"location_new_"+Object(f.d)(),id:"new"}))},title:"Add location"})),s.a.createElement(m.ContentData,{key:"loc_cd"},this.state.content))}}]),e}(d.Component),p=function(t){function e(t){var n;return Object(c.a)(this,e),(n=Object(r.a)(this,Object(l.a)(e).call(this,t))).onChange=function(t){return n.setState({data:Object(o.a)({},n.state.data,Object(a.a)({},t.target.name,t.target.value))})},n.changeContent=function(t){return n.setState({content:t})},n.updateInfo=function(){return Object(f.c)("api/location/info",Object(o.a)({op:"update"},n.state.data)).then((function(t){return n.setState(t)}))},n.state={data:null,found:!0},n}return Object(u.a)(e,t),Object(i.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(f.c)("api/location/info",{id:this.props.id}).then((function(e){return t.setState(e)}))}},{key:"render",value:function(){var t=this;return this.state.found?this.state.data?s.a.createElement(m.InfoArticle,{key:"loc_article",header:"Location"},s.a.createElement(m.InfoColumns,{key:"loc_content"},s.a.createElement(b.TextInput,{key:"name",id:"name",value:this.state.data.name,onChange:this.onChange})),s.a.createElement(h.SaveButton,{key:"loc_btn_save",onClick:function(){return t.updateInfo()},title:"Save"})):s.a.createElement(m.Spinner,null):s.a.createElement(m.InfoArticle,{key:"loc_removed"},"Location id: ",this.props.id," removed")}}]),e}(d.Component)}}]);
//# sourceMappingURL=3.e100be41.chunk.js.map