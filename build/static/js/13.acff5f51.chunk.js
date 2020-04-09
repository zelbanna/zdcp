(this.webpackJsonprims=this.webpackJsonprims||[]).push([[13],{37:function(t,e,n){"use strict";n.r(e),n.d(e,"Main",(function(){return p}));var a=n(2),i=n(3),r=n(5),l=n(4),c=n(6),u=n(0),o=n.n(u),m=n(8),s=n(1),f=n(10),h=n(11),d=n(7),p=function(t){function e(t){var n;return Object(a.a)(this,e),(n=Object(r.a)(this,Object(l.a)(e).call(this,t))).changeContent=function(t){return n.setState({content:t})},n.reloadList=function(){return Object(m.b)("api/multimedia/list").then((function(t){return n.setState(t)}))},n.deleteList=function(t){return window.confirm("Delete file "+t.file+"?")&&Object(m.b)("api/multimedia/delete",t).then((function(e){return e.deleted&&n.setState({data:n.state.data.filter((function(e){return!(e.path===t.path&&e.file===t.file)})),content:null})}))},n.listItem=function(t,e){return[t.file,o.a.createElement(u.Fragment,{key:"mm_buttons_"+e},o.a.createElement(d.InfoButton,{key:"mm_btn_info_"+e,onClick:function(){return n.changeContent(o.a.createElement(_,{key:"multimedia_title_"+e,path:t.path,file:t.file}))},title:"Title info"}),o.a.createElement(d.SearchButton,{key:"mm_btn_lookup_"+e,onClick:function(){return n.changeContent(o.a.createElement(k,{key:"multimedia_lookup_"+e,path:t.path,file:t.file}))},title:"Lookup info"}),o.a.createElement(d.DocButton,{key:"mm_btn_subs_"+e,onClick:function(){return n.changeContent(o.a.createElement(y,{key:"multimedia_subs_"+e,path:t.path,file:t.file}))},title:"Subtitles"}),o.a.createElement(d.DeleteButton,{key:"mm_btn_delete_"+e,onClick:function(){return n.deleteList(t)},title:"Delete file"}))]},n.state={content:void 0,ip:void 0},n}return Object(c.a)(e,t),Object(i.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(m.b)("api/system/external_ip").then((function(e){var n=e&&"OK"===e.status?e.ip:"0.0.0.0";t.context.loadNavigation(o.a.createElement(h.a,{key:"multimedia_navbar"},o.a.createElement(h.e,{key:"mm_nav_ip",title:n})))})),this.reloadList()}},{key:"render",value:function(){var t=this;return this.state.data?o.a.createElement(u.Fragment,{key:"mm_fragment"},o.a.createElement(s.ContentList,{key:"mm_cl",header:"Media files",thead:["File",""],trows:this.state.data,listItem:this.listItem,result:this.state.result},o.a.createElement(d.ReloadButton,{key:"mm_btn_reload",onClick:function(){return t.reloadList()}}),o.a.createElement(d.DeleteButton,{key:"mm_btn_cleanup",onClick:function(){return window.confirm("Really clean up files?")&&t.changeContent(o.a.createElement(b,{key:"multimedia_cleanup"}))},title:"Cleanup multimedia directory"})),o.a.createElement(s.ContentData,{key:"mm_cd"},this.state.content)):o.a.createElement(s.Spinner,null)}}]),e}(u.Component);p.contextType=s.RimsContext;var b=function(t){function e(t){var n;return Object(a.a)(this,e),(n=Object(r.a)(this,Object(l.a)(e).call(this,t))).state={},n}return Object(c.a)(e,t),Object(i.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(m.b)("api/multimedia/cleanup").then((function(e){return t.setState(e)}))}},{key:"render",value:function(){return this.state.data?o.a.createElement(s.ContentReport,{key:"mm_clean_cr",header:"delete",thead:["Type","Path","Item","Status","Info"],trows:this.state.data,listItem:function(t){return[t.type,t.path,t.item,t.status,t.info]}}):o.a.createElement(s.Spinner,null)}}]),e}(u.Component),_=function(t){function e(){return Object(a.a)(this,e),Object(r.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(c.a)(e,t),Object(i.a)(e,[{key:"render",value:function(){return o.a.createElement("div",null,"Title TODO")}}]),e}(u.Component),k=function(t){function e(){return Object(a.a)(this,e),Object(r.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(c.a)(e,t),Object(i.a)(e,[{key:"render",value:function(){return o.a.createElement("div",null,"Lookup TODO")}}]),e}(u.Component),y=function(t){function e(t){var n;return Object(a.a)(this,e),(n=Object(r.a)(this,Object(l.a)(e).call(this,t))).state={},n}return Object(c.a)(e,t),Object(i.a)(e,[{key:"componentDidMount",value:function(){var t=this;Object(m.b)("api/multimedia/check_srt",{path:this.props.path,file:this.props.file}).then((function(e){return t.setState(e)}))}},{key:"render",value:function(){return this.state.data?o.a.createElement("article",{className:"info"},o.a.createElement("h1",null,this.state.data.file),o.a.createElement(s.InfoColumns,{key:"mm_sub_ic"},o.a.createElement(f.TextLine,{key:"mm_sub_name",id:"name",text:this.state.data.name}),o.a.createElement(f.TextLine,{key:"mm_sub_code",id:"code",text:this.state.data.code}),o.a.createElement(f.TextLine,{key:"mm_sub_file",id:"file",text:this.state.data.file}))):o.a.createElement(s.Spinner,null)}}]),e}(u.Component)}}]);
//# sourceMappingURL=13.acff5f51.chunk.js.map