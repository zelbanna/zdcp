(this.webpackJsonprims=this.webpackJsonprims||[]).push([[20],{54:function(e,t,n){"use strict";n.r(t),n.d(t,"Main",(function(){return b}));var a=n(21),r=n(3),o=n(4),c=n(5),i=n(6),s=n(0),u=n.n(s),l=n(12),p=n(16),m=n(13),f=n(1),v=n.n(f),b=function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(e){var o;return Object(r.a)(this,n),(o=t.call(this,e)).compileNavItems=function(){for(var e=[],t=function(){var t=Object(a.a)(r[n],2),c=t[0],i=t[1];"module"===i.type?e.push(u.a.createElement(p.NavDropButton,{key:"mb_"+c,title:c,onClick:function(){return o.context.changeMain(i)}})):"tab"===i.type?e.push(u.a.createElement(p.NavDropButton,{key:"mb_"+c,title:c,onClick:function(){return window.open(i.tab,"_blank")}})):"frame"===i.type?e.push(u.a.createElement(p.NavDropButton,{key:"mb_"+c,title:c,onClick:function(){return o.context.changeMain(u.a.createElement("iframe",{className:v.a.frame,title:c,src:i.frame}))}})):console.log("Unknown panel type:"+JSON.stringify(i))},n=0,r=Object.entries(o.state.data);n<r.length;n++)t();o.context.loadNavigation(u.a.createElement(p.NavBar,{key:"resource_navbar"},u.a.createElement(p.NavDropDown,{key:"resources",title:"Resources"},e)))},o.state={},o}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;Object(l.d)("api/portal/resources",{type:"resource"}).then((function(t){Object.assign(e.state,t),e.compileNavItems()}))}},{key:"componentDidUpdate",value:function(e){e!==this.props&&this.compileNavItems()}},{key:"render",value:function(){return u.a.createElement(s.Fragment,null)}}]),n}(s.Component);b.contextType=m.RimsContext}}]);
//# sourceMappingURL=20.f4b22826.chunk.js.map