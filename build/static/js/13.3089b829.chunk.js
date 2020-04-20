(this.webpackJsonprims=this.webpackJsonprims||[]).push([[13],{43:function(e,t,a){"use strict";a.r(t),a.d(t,"Main",(function(){return b}));var n=a(19),i=a(16),r=a(4),l=a(5),c=a(7),s=a(6),o=a(8),m=a(0),u=a.n(m),d=a(14),p=a(13),h=a(15),f=a(17),_=a(20),b=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(s.a)(t).call(this,e))).compileNavItems=function(){return a.context.loadNavigation(u.a.createElement(f.NavBar,{key:"multimedia_navbar"},u.a.createElement(f.NavInfo,{key:"mm_nav_ip",title:a.state.ip})))},a.changeContent=function(e){return a.setState({content:e})},a.reloadList=function(){return Object(d.c)("api/multimedia/list").then((function(e){return a.setState(e)}))},a.deleteList=function(e){return window.confirm("Delete file "+e.file+"?")&&Object(d.c)("api/multimedia/delete",e).then((function(t){return t.deleted&&a.setState({data:a.state.data.filter((function(t){return!(t.path===e.path&&t.file===e.file)})),content:null})}))},a.listItem=function(e,t){return[e.file,u.a.createElement(m.Fragment,{key:"mm_buttons_"+t},u.a.createElement(_.InfoButton,{key:"mm_btn_info_"+t,onClick:function(){return a.changeContent(u.a.createElement(k,{key:"multimedia_title_"+t,path:e.path,file:e.file}))},title:"Title info"}),u.a.createElement(_.SearchButton,{key:"mm_btn_lookup_"+t,onClick:function(){return a.changeContent(u.a.createElement(y,{key:"multimedia_lookup_"+t,path:e.path,file:e.file}))},title:"Lookup info"}),u.a.createElement(_.DocButton,{key:"mm_btn_subs_"+t,onClick:function(){return a.changeContent(u.a.createElement(x,{key:"multimedia_subs_"+t,path:e.path,file:e.file}))},title:"Subtitles"}),u.a.createElement(_.DeleteButton,{key:"mm_btn_delete_"+t,onClick:function(){return a.deleteList(e)},title:"Delete file"}))]},a.state={content:void 0,ip:void 0},a}return Object(o.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(d.c)("api/system/external_ip").then((function(t){Object.assign(e.state,{ip:t&&"OK"===t.status?t.ip:"0.0.0.0"}),e.compileNavItems()})),this.reloadList()}},{key:"componentDidUpdate",value:function(e){e!==this.props&&this.compileNavItems()}},{key:"render",value:function(){var e=this;return this.state.data?u.a.createElement(m.Fragment,{key:"mm_fragment"},u.a.createElement(p.ContentList,{key:"mm_cl",header:"Media files",thead:["File",""],trows:this.state.data,listItem:this.listItem,result:this.state.result},u.a.createElement(_.ReloadButton,{key:"mm_btn_reload",onClick:function(){return e.reloadList()}}),u.a.createElement(_.DeleteButton,{key:"mm_btn_cleanup",onClick:function(){return window.confirm("Really clean up files?")&&e.changeContent(u.a.createElement(E,{key:"multimedia_cleanup_"+Object(d.d)()}))},title:"Cleanup multimedia directory"})),u.a.createElement(p.ContentData,{key:"mm_cd"},this.state.content)):u.a.createElement(p.Spinner,null)}}]),t}(m.Component);b.contextType=p.RimsContext;var k=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(s.a)(t).call(this,e))).onChange=function(e){return a.setState({data:Object(i.a)({},a.state.data,Object(n.a)({},e.target.name,e.target.value))})},a.threadChange=function(e){return a.setState(Object(n.a)({},e.target.name,e.target.checked))},a.updateInfo=function(){return Object(d.c)("api/multimedia/check_titlt",Object(i.a)({op:"update"},a.state.data)).then((function(e){return a.setState(e)}))},a.transferFile=function(){window.confirm("Transfer file to repository?")&&(a.state.thread?Object(d.c)("api/system/worker",{module:"multimedia",function:"transfer",output:!0,args:{path:a.props.path,file:a.props.file}}).then((function(e){return a.setState({op:"transfer",result:e})})):(a.setState({wait:u.a.createElement(p.Spinner,null)}),Object(d.c)("api/multimedia/transfer",{path:a.props.path,file:a.props.file}).then((function(e){return a.setState({op:"transfer",result:e,wait:null})}))))},a.processFile=function(){window.confirm("Process file?")&&(a.state.thread?Object(d.c)("api/system/worker",{module:"multimedia",function:"process",output:!0,args:Object(i.a)({path:a.props.path,file:a.props.file},a.state.data)}).then((function(e){return a.setState({op:"process",result:e})})):(a.setState({wait:u.a.createElement(p.Spinner,null)}),Object(d.c)("api/multimedia/process",Object(i.a)({path:a.props.path,file:a.props.file},a.state.data)).then((function(e){return a.setState({op:"process",result:e,wait:null})}))))},a.state={thread:!0,wait:null},a}return Object(o.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(d.c)("api/multimedia/check_title",{path:this.props.path,file:this.props.file}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){var e=this;if(this.state.op){if(this.state.thread||"transfer"===this.state.op)return u.a.createElement(p.InfoArticle,{key:"mm_trans_article",header:this.state.thread?"Task activation":"Transfer"},u.a.createElement(h.TextLine,{key:"mm_trans_res",id:"result",text:JSON.stringify(this.state.result)}));if("NOT_OK"===this.state.result.status)return u.a.createElement(p.CodeArticle,{key:"mm_error_code",header:"Process Error"},JSON.stringify(this.state.result.info,null,2));var t=this.state.result.data;return u.a.createElement(p.InfoArticle,{key:"mm_proc_article",header:"Process success"},"Elapsed time for processing file: ",this.state.result.seconds," seconds",u.a.createElement(p.InfoColumns,{key:"mm_proc_ic"},u.a.createElement(h.TextLine,{key:"mm_proc_prefix",id:"prefix",text:t.prefix}),u.a.createElement(h.TextLine,{key:"mm_proc_suffix",id:"suffix",text:t.suffix}),u.a.createElement(h.TextLine,{key:"mm_proc_dest",id:"dest",label:"Destination",text:JSON.stringify(t.dest)}),u.a.createElement(h.TextLine,{key:"mm_proc_rename",id:"rename",text:JSON.stringify(t.rename)}),u.a.createElement(h.TextLine,{key:"mm_proc_aac",id:"aac",label:"Add AAC",text:JSON.stringify(t.aac_probe)}),u.a.createElement(h.TextLine,{key:"mm_proc_chg_aac",id:"chg_aac",label:"Param AAC",text:t.changes.aac}),u.a.createElement(h.TextLine,{key:"mm_proc_chg_aud",id:"chg_aud",label:"Param Audio",text:t.changes.audio}),u.a.createElement(h.TextLine,{key:"mm_proc_chg_sub",id:"chg_sub",label:"Param Subtitles",text:t.changes.subtitle}),u.a.createElement(h.TextLine,{key:"mm_proc_chg_srt",id:"chg_srt",label:"Param SRT files",text:t.changes.srt})))}if(this.state.data){var a=this.state.data;return u.a.createElement(p.InfoArticle,{key:"mm_tit_article",header:"Title"},u.a.createElement(p.InfoColumns,{key:"mm_tit_ic"},u.a.createElement(h.TextLine,{key:"mm_tit_type",id:"type",text:a.type}),u.a.createElement(h.TextLine,{key:"mm_tit_title",id:"title",text:a.title}),u.a.createElement(h.TextLine,{key:"mm_tit_path",id:"path",text:a.path}),u.a.createElement(h.TextInput,{key:"mm_tit_name",id:"name",value:a.name,onChange:this.onChange}),a.epside&&u.a.createElement(h.TextInput,{key:"mm_tit_eposide",id:"episode",value:a.episode,onChange:this.onChange}),u.a.createElement(h.TextInput,{key:"mm_tit_info",id:"info",value:a.info,onChange:this.onChange}),u.a.createElement(h.CheckboxInput,{key:"mm_tit_thread",id:"thread",label:"Thread",value:this.state.thread,onChange:this.threadChange,title:"Thread or direct execution"})),u.a.createElement(_.StartButton,{key:"mm_tit_btn_proc",onClick:function(){return e.processFile()},title:"Process file"}),u.a.createElement(_.SyncButton,{key:"mm_tit_btn_trans",onClick:function(){return e.transferFile()},title:"Transfer file"}),this.state.wait)}return u.a.createElement(p.Spinner,null)}}]),t}(m.Component),y=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(s.a)(t).call(this,e))).state={},a}return Object(o.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(d.c)("api/multimedia/check_content",{path:this.props.path,file:this.props.file}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){if(this.state.data){var e=this.state.data;return u.a.createElement(p.InfoArticle,{key:"mm_lu_article",header:"Lookup"},u.a.createElement(p.InfoColumns,{key:"mm_lu_ic"},u.a.createElement(h.TextLine,{key:"mm_lu_file",id:"file",label:"File",text:this.props.file}),u.a.createElement(h.TextLine,{key:"mm_lu_status",id:"status",label:"Result",text:this.state.status}),u.a.createElement(h.TextLine,{key:"mm_lu_error",id:"error",label:"Error",text:this.state.info}),u.a.createElement(h.TextLine,{key:"mm_lu_v_def",id:"video_default",label:"Video default",text:JSON.stringify(!e.video.set_default),title:"Video stream has default language"}),u.a.createElement(h.TextLine,{key:"mm_lu_v_lang",id:"video_lang",label:"Video language",text:e.video.language,title:"Language set in video stream information"}),u.a.createElement(h.TextLine,{key:"mm_lu_a_add",id:"audio_add",label:"Audio keep",text:e.audio.add.join()}),u.a.createElement(h.TextLine,{key:"mm_lu_a_rem",id:"audio_rem",label:"Audio remove",text:e.audio.remove.join()}),u.a.createElement(h.TextLine,{key:"mm_lu_a_aac",id:"audio_aac",label:"Add AAC",text:JSON.stringify(e.audio.add_aac)}),u.a.createElement(h.TextLine,{key:"mm_lu_s_add",id:"sub_add",label:"Subtitle keep",text:e.subtitle.add.join()}),u.a.createElement(h.TextLine,{key:"mm_lu_s_rem",id:"sub_rem",label:"Subtitle remove",text:e.subtitle.remove.join()}),u.a.createElement(h.TextLine,{key:"mm_lu_a_lang",id:"sub_lang",label:"Subtitle languages",text:e.subtitle.languages.join()})))}return u.a.createElement(p.Spinner,null)}}]),t}(m.Component),x=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(s.a)(t).call(this,e))).state={},a}return Object(o.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(d.c)("api/multimedia/check_srt",{path:this.props.path,file:this.props.file}).then((function(t){return e.setState(t)}))}},{key:"render",value:function(){return this.state.data?u.a.createElement(p.InfoArticle,{key:"mm_sub_art",header:"Extra subtitles"},u.a.createElement(p.InfoColumns,{key:"mm_sub_ic"},u.a.createElement(h.TextLine,{key:"mm_sub_path",id:"path",text:this.props.path}),u.a.createElement(h.TextLine,{key:"mm_sub_item",id:"item",text:this.props.file}),u.a.createElement(h.TextLine,{key:"mm_sub_name",id:"name",text:this.state.data.name}),u.a.createElement(h.TextLine,{key:"mm_sub_code",id:"code",text:this.state.data.code}),u.a.createElement(h.TextLine,{key:"mm_sub_file",id:"file",text:this.state.data.file}))):u.a.createElement(p.Spinner,null)}}]),t}(m.Component),E=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(s.a)(t).call(this,e))).state={},a}return Object(o.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(d.c)("api/multimedia/cleanup").then((function(t){return e.setState(t)}))}},{key:"render",value:function(){return this.state.data?u.a.createElement(p.ContentReport,{key:"mm_clean_cr",header:"delete",thead:["Type","Path","Item","Status","Info"],trows:this.state.data,listItem:function(e){return[e.type,e.path,e.item,e.status,e.info]}}):u.a.createElement(p.Spinner,null)}}]),t}(m.Component)}}]);
//# sourceMappingURL=13.3089b829.chunk.js.map