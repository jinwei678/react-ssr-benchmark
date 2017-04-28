var React = require('react');var FastReact = require('fast-react-server');var A=React.createElement('body', {className: "index"}, [
  React.createElement('div', {id: "shortcut"}, [
    React.createElement('div', {className: "w"}, [
      React.createElement('ul', {className: "fl", clstag: "h|keycount|2016|01a"}, [
        React.createElement('li', {className: "dorpdown", id: "ttbar-mycity"})
      ]),
      React.createElement('ul', {className: "fr"}, [
        React.createElement('li', {className: "fore1", id: "ttbar-login", clstag: "h|keycount|2016|01b"}, [
          React.createElement('a', {target: "_blank", href: "javascript:login();", className: "link-login"}, ["你好，请登录"]),"  ", React.createElement('a', {href: "javascript:regist();", className: "link-regist style-red"}, ["免费注册"])
        ]),
        React.createElement('li', {className: "spacer"}),
        React.createElement('li', {className: "fore2", clstag: "h|keycount|2016|01c"}, [
          React.createElement('div', {className: "dt"}, [React.createElement('a', {target: "_blank", href: "//order.jd.com/center/list.action"}, ["我的订单"])])
        ]),
        React.createElement('li', {className: "spacer"}),
        React.createElement('li', {className: "fore3 dorpdown", id: "ttbar-myjd", clstag: "h|keycount|2016|01d"}, [
          React.createElement('div', {className: "dt cw-icon"}, [React.createElement('a', {target: "_blank", href: "//home.jd.com/"}, ["我的京东"]),React.createElement('i', {className: "iconfont"}, [""]),React.createElement('i', {className: "ci-right"}, [React.createElement('s', null, ["◇"])])]),
          React.createElement('div', {className: "dd dorpdown-layer"})
        ]),
        React.createElement('li', {className: "spacer"}),
        React.createElement('li', {className: "fore4", clstag: "h|keycount|2016|01e"}, [
          React.createElement('div', {className: "dt"}, [React.createElement('a', {target: "_blank", href: "//vip.jd.com/"}, ["京东会员"])])
        ]),
        React.createElement('li', {className: "spacer"}),
        React.createElement('li', {className: "fore5", clstag: "h|keycount|2016|01f"}, [
          React.createElement('div', {className: "dt"}, [React.createElement('a', {target: "_blank", href: "//b.jd.com/"}, ["企业采购"])])
        ]),
        React.createElement('li', {className: "spacer"}),
        React.createElement('li', {className: "fore8 dorpdown", id: "ttbar-serv", clstag: "h|keycount|2016|01g"}, [
          React.createElement('div', {className: "dt cw-icon"}, ["客户服务", React.createElement('i', {className: "iconfont"}, [""]),React.createElement('i', {className: "ci-right"}, [React.createElement('s', null, ["◇"])])]),
          React.createElement('div', {className: "dd dorpdown-layer"})
        ]),
        React.createElement('li', {className: "spacer"}),
        React.createElement('li', {className: "fore9 dorpdown", id: "ttbar-navs", clstag: "h|keycount|2016|01h"}, [
          React.createElement('div', {className: "dt cw-icon"}, ["网站导航", React.createElement('i', {className: "iconfont"}, [""]),React.createElement('i', {className: "ci-right"}, [React.createElement('s', null, ["◇"])])]),
          React.createElement('div', {className: "dd dorpdown-layer"})
        ]),
        React.createElement('li', {className: "spacer"}),
        React.createElement('li', {className: "fore10 mobile", id: "J_mobile", clstag: "h|keycount|2016|01i"}, [
          React.createElement('div', {className: "dt mobile_txt"}, ["手机京东"]),
          React.createElement('div', {className: "mobile_static"}, [
            React.createElement('div', {className: "mobile_static_qrcode"})
          ]),
          React.createElement('div', {id: "J_mobile_pop", className: "mod_loading mobile_pop"}
          )
        ])
      ])
    ])
  ]),

  React.createElement('div', {id: "header"}, [
    React.createElement('div', {className: "w"}, [
      React.createElement('div', {id: "logo", className: "logo", clstag: "h|keycount|2016|02a"}, [
        React.createElement('h1', {className: "logo_tit"}, [React.createElement('a', {href: "//www.jd.com", className: "logo_tit_lk"}, ["京东"])]),
        React.createElement('h2', {className: "logo_subtit"}, ["京东,多快好省"]),
        React.createElement('div', {className: "logo_extend"})
      ]),

      React.createElement('div', {id: "search"}, [
        React.createElement('div', {className: "search-m"}, [
          React.createElement('div', {className: "search_logo"}, [
            React.createElement('a', {href: "//www.jd.com", className: "search_logo_lk", clstag: "h|keycount|2016|02b"}, ["京东，多快好省"])
          ]),
          React.createElement('ul', {id: "shelper"}),

          React.createElement('div', {className: "form"}, [
            React.createElement('input', {clstag: "h|keycount|2016|03a", type: "text", onkeydown: "javascript:if(event.keyCode==13) search('key');", autocomplete: "off", id: "key", accesskey: "s", className: "text"}),
            React.createElement('button', {clstag: "h|keycount|2016|03c", onclick: "search('key');return false;", className: "button"}, [React.createElement('i', {className: "iconfont"}, [""])])
          ])
        ])
      ]),

      React.createElement('div', {id: "settleup", className: "dorpdown", clstag: "h|keycount|2016|04a"}, [
        React.createElement('div', {className: "cw-icon"}, [
          React.createElement('i', {className: "ci-left"}),
          React.createElement('i', {className: "ci-right"}),
          React.createElement('i', {className: "iconfont"}, [""]),
          React.createElement('a', {target: "_blank", href: "//cart.jd.com/cart.action"}, ["我的购物车"])
        ]),
        React.createElement('div', {className: "dorpdown-layer"}, [
          React.createElement('div', {className: "spacer"}),
          React.createElement('div', {id: "settleup-content"}, [
            React.createElement('span', {className: "loading"})
          ])
        ])
      ]),

      React.createElement('div', {id: "hotwords", clstag: "h|keycount|2016|03b"}),



      React.createElement('div', {id: "navitems"}, [

		React.createElement('ul', {id: "navitems-group1"}, [
		  React.createElement('li', {clstag: "h|keycount|2016|05a", className: "fore1"}, [
			React.createElement('a', {target: "_blank", href: "//miaosha.jd.com/"}, ["秒杀"])
		  ]),
		  React.createElement('li', {clstag: "h|keycount|2016|05b", className: "fore2"}, [
			React.createElement('a', {target: "_blank", href: "https://a.jd.com/"}, ["优惠券"])
		  ]),
		  React.createElement('li', {clstag: "h|keycount|2016|05c", className: "fore3"}, [
			React.createElement('a', {target: "_blank", href: "//red.jd.com/"}, ["闪购"])
		  ]),
		  React.createElement('li', {clstag: "h|keycount|2016|05d", className: "fore4"}, [
			React.createElement('a', {target: "_blank", href: "//paimai.jd.com/"}, ["拍卖"])
		  ])
		]),
		React.createElement('div', {className: "spacer"}),
		React.createElement('ul', {id: "navitems-group2"}, [
		  React.createElement('li', {clstag: "h|keycount|2016|05e", className: "fore1"}, [
			React.createElement('a', {target: "_blank", href: "https://channel.jd.com/fashion.html "}, ["服装城"])
		  ]),
		  React.createElement('li', {clstag: "h|keycount|2016|05f", className: "fore2"}, [
			React.createElement('a', {target: "_blank", href: "//chaoshi.jd.com/"}, ["京东超市"])
		  ]),
		  React.createElement('li', {clstag: "h|keycount|2016|05g", className: "fore3"}, [
			React.createElement('a', {target: "_blank", href: "//fresh.jd.com/"}, ["生鲜"])
		  ]),
		  React.createElement('li', {clstag: "h|keycount|2016|05h", className: "fore4"}, [
			React.createElement('a', {target: "_blank", href: "//www.jd.hk/"}, ["全球购"])
		  ])
		]),
		React.createElement('div', {className: "spacer"}),
		React.createElement('ul', {id: "navitems-group3"}, [
		  React.createElement('li', {clstag: "h|keycount|2016|05i", className: "fore1"}, [
			React.createElement('a', {target: "_blank", href: "//jr.jd.com/"}, ["京东金融"])
		  ])
		])
      ]),
      React.createElement('div', {id: "treasure", clstag: "h|keycount|2016|07a"})
    ])
  ]),
  React.createElement('div', null, [React.createElement('a', {href: "//yp.jd.com/737a388d45369e8d237.html"}, ["新飞冰箱"]),React.createElement('a', {href: "//yp.jd.com/sitemap.html"}, ["优评地图"]),React.createElement('a', {href: "//www.jd.com/chanpin/311739.html"}, ["华为P10"]),React.createElement('a', {href: "//xin.jd.com/"}, ["新通路"]),React.createElement('a', {href: "//gou.jd.com/"}, ["超值购"]),React.createElement('a', {href: "//www.jd.com/newWare.html"}, ["最新商品"]),React.createElement('a', {href: "//club.jd.com/review/3133813-3-1.html"}, ["iPhone7怎么样"]),React.createElement('a', {href: "//www.jd.com/chanpin/15006.html"}, ["低帮鞋"]),React.createElement('a', {href: "//mall.jd.com/index-1000001383.html"}, ["沁园净水器"]),React.createElement('a', {href: "//mall.jd.com/index-1000000192.html"}, ["金士顿"]),React.createElement('a', {href: "//www.jd.com/pinpai/30338.html"}, ["Nike"]),React.createElement('a', {href: "//www.jd.com/pinpai/18512.html"}, ["New Balance"]),React.createElement('a', {href: "//club.jd.com/review/2402692-3-1.html"}, ["小米5怎么样"]),React.createElement('a', {href: "//club.jd.com/review/1178681-3-1.html"}, ["合生元奶粉怎么样"]),React.createElement('a', {href: "//so.m.jd.com/pinpai/9211.html"}, ["杰克琼斯"]),React.createElement('a', {href: "//www.jd.com/chanpin/86.html"}, ["女装羽绒服"]),React.createElement('a', {href: "//yp.jd.com/7376d932f5d63621a19.html"}, ["bcd-215dk"]),React.createElement('a', {href: "//yp.jd.com/737991d93f9bee04603.html"}, ["制冰冰箱"]),React.createElement('a', {href: "//yp.jd.com/737af5baf5dfc86610c.html"}, ["冰琪琳机器"]),React.createElement('a', {href: "//yp.jd.com/737cc643bbf9c2d1124.html"}, ["冰箱 对开"]),React.createElement('a', {href: "//yp.jd.com/73711a90e2f006a7ce3.html"}, ["bcd-215skcc"]),React.createElement('a', {href: "//yp.jd.com/737e7b73ec4c8eb776c.html"}, ["冰箱对开双门"]),React.createElement('a', {href: "//yp.jd.com/737c7d81347f587468f.html"}, ["BCD-202TD 冰箱"]),React.createElement('a', {href: "//yp.jd.com/737b72fec07bfedecc9.html"}, ["艾思卡勒112-286"]),React.createElement('a', {href: "//yp.jd.com/7379f571ee8cde21a33.html"}, ["冰箱 美的"]),React.createElement('a', {href: "//yp.jd.com/737dd349e72e2d51bc7.html"}, ["bcd-215kcb"]),React.createElement('a', {href: "//yp.jd.com/7374ae74407948a0b6e.html"}, ["冰箱迷你家用"]),React.createElement('a', {href: "//yp.jd.com/73704749394ccb47942.html"}, ["aymg112-2"]),React.createElement('a', {href: "//yp.jd.com/737328887fcb92af799.html"}, ["bcd-603wd"]),React.createElement('a', {href: "//yp.jd.com/737b2da69bcafca5961.html"}, ["abpg169-1-2"]),React.createElement('a', {href: "//yp.jd.com/737ba4d42d747b1e278.html"}, ["bcd-331wbcz"]),React.createElement('a', {href: "//yp.jd.com/73718fafb369027b176.html"}, ["BCD-117BSJ"]),React.createElement('a', {href: "//yp.jd.com/737ff05247821404337.html"}, ["bcd-216e3gr"]),React.createElement('a', {href: "//yp.jd.com/7373e742dbd9a3f5a81.html"}, ["艾尔之光冰"]),React.createElement('a', {href: "//yp.jd.com/7375d0ff5614c212c29.html"}, ["bcd-215tgmk(E)215"]),React.createElement('a', {href: "//yp.jd.com/737752e5e9c2a0b9165.html"}, ["aymg112-1"])]),
  React.createElement('div', {className: "fs"}, [
    React.createElement('div', {className: "grid_c1 fs_inner"}, [


      React.createElement('div', {className: "fs_col1"}, [
        React.createElement('div', {className: "J_cate cate"}, [
          React.createElement('ul', {className: "JS_navCtn cate_menu"}, [
            React.createElement('li', {className: "cate_menu_item", 'data-index': "1", clstag: "h|keycount|2016|0601a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//jiadian.jd.com"}, ["家用电器"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "2", clstag: "h|keycount|2016|0602a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//shouji.jd.com/"}, ["手机"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//wt.jd.com"}, ["运营商"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//shuma.jd.com/"}, ["数码"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "3", clstag: "h|keycount|2016|0603a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//diannao.jd.com/"}, ["电脑"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//bg.jd.com"}, ["办公"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "4", clstag: "h|keycount|2016|0604a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/home.html"}, ["家居"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/furniture.html"}, ["家具"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/decoration.html"}, ["家装"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/kitchenware.html"}, ["厨具"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "5", clstag: "h|keycount|2016|0605a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/1315-1342.html"}, ["男装"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/1315-1343.html"}, ["女装"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/children.html"}, ["童装"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/1315-1345.html"}, ["内衣"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "6", clstag: "h|keycount|2016|0606a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/beauty.html"}, ["美妆个护"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/pet.html"}, ["宠物"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "7", clstag: "h|keycount|2016|0607a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/womensshoes.html"}, ["女鞋"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/bag.html"}, ["箱包"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/watch.html"}, ["钟表"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/jewellery.html"}, ["珠宝"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "8", clstag: "h|keycount|2016|0608a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/mensshoes.html"}, ["男鞋"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/yundongcheng.html"}, ["运动"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/outdoor.html"}, ["户外"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "9", clstag: "h|keycount|2016|0609a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "http://car.jd.com/"}, ["汽车"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//che.jd.com/"}, ["汽车用品"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "10", clstag: "h|keycount|2016|0610a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//baby.jd.com"}, ["母婴"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//toy.jd.com/"}, ["玩具乐器"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "11", clstag: "h|keycount|2016|0611a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/food.html"}, ["食品"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//jiu.jd.com"}, ["酒类"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//fresh.jd.com"}, ["生鲜"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//china.jd.com"}, ["特产"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "12", clstag: "h|keycount|2016|0612a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//health.jd.com"}, ["医药保健"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/9192-9196.html"}, ["计生情趣"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "13", clstag: "h|keycount|2016|0613a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//book.jd.com/"}, ["图书"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//mvd.jd.com/"}, ["音像"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//e.jd.com/ebook.html"}, ["电子书"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "14", clstag: "h|keycount|2016|0614a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//jipiao.jd.com/"}, ["机票"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//hotel.jd.com/"}, ["酒店"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//trip.jd.com/"}, ["旅游"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//ish.jd.com/"}, ["生活"])]),
            React.createElement('li', {className: "cate_menu_item", 'data-index': "15", clstag: "h|keycount|2016|0615a"}, [" ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//licai.jd.com/"}, ["理财"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//z.jd.com/"}, ["众筹"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//baitiao.jd.com"}, ["白条"]),React.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", React.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//bao.jd.com/"}, ["保险"])])

          ]),
          React.createElement('div', {className: "JS_popCtn cate_pop mod_loading"})
        ])
      ]),


      React.createElement('div', {className: "fs_col2"}, [

        React.createElement('div', {className: "J_slider slider"}, [
          React.createElement('div', {className: "J_slider_main slider_main"}),
          React.createElement('div', {className: "J_slider_extend slider_extend clearfix"})
        ])
      ]),

      React.createElement('div', {className: "fs_col3"}, [

        React.createElement('div', {className: "J_user user mod_loading"}
        ),


        React.createElement('div', {className: "news J_news"}, [
          React.createElement('div', {className: "mod_tab news_tab J_news_tab"}, [
            React.createElement('div', {className: "mod_tab_head J_tab_head clearfix"}, [
              React.createElement('a', {href: "javascript:;", className: "mod_tab_head_item news_first mod_tab_head_item_on", clstag: "h|keycount|2016|10a"}, ["促销"]),
              React.createElement('a', {href: "javascript:;", className: "mod_tab_head_item news_last", clstag: "h|keycount|2016|10b"}, ["公告"]),
              React.createElement('div', {className: "news_tab_active J_news_tab_active"}),
              React.createElement('a', {href: "//www.jd.com/moreSubject.aspx", target: "_blank", className: "news_more", clstag: "h|keycount|2016|10c"}, ["更多"])
            ]),
            React.createElement('div', {className: "mod_tab_content J_tab_content", clstag: "h|keycount|2016|10d"}, [
              React.createElement('div', {className: "mod_tab_content_item mod_tab_content_item_on"}, [
                React.createElement('ul', {className: "news_list"}, [

            	  React.createElement('li', {className: "news_item"}, [React.createElement('a', {href: "//dgposy.jd.com/", target: "_blank", className: "news_link"}, ["宝生元春季家装厨卫大放送"])]),
            	  React.createElement('li', {className: "news_item"}, [React.createElement('a', {href: "https://sale.jd.com/act/REu2gb0BYlNI1.html", target: "_blank", className: "news_link"}, ["家电满5000送1999礼券"])]),
            	  React.createElement('li', {className: "news_item"}, [React.createElement('a', {href: "https://sale.jd.com/act/A3sa5X0HWTSM.html", target: "_blank", className: "news_link"}, ["疯狂星期五，爆品2件5折"])]),
            	  React.createElement('li', {className: "news_item"}, [React.createElement('a', {href: "https://sale.jd.com/act/RO4H8trivp1.html", target: "_blank", className: "news_link"}, ["200元E卡免费抽"])])
                ])
              ]),
              React.createElement('div', {className: "mod_tab_content_item"}, [
                React.createElement('ul', {className: "news_list"}, [

            	  React.createElement('li', {className: "news_item"}, [React.createElement('a', {href: "//www.jd.com/news.aspx?id=33743", target: "_blank", className: "news_link"}, ["京东热水器品类安装收费封顶"])]),
            	  React.createElement('li', {className: "news_item"}, [React.createElement('a', {href: "//www.jd.com/news.aspx?id=33549", target: "_blank", className: "news_link"}, ["英国超市ASDA入驻京东"])]),
            	  React.createElement('li', {className: "news_item"}, [React.createElement('a', {href: "//www.jd.com/news.aspx?id=33548", target: "_blank", className: "news_link"}, ["京东与欧莱雅中国合作升级 "])]),
            	  React.createElement('li', {className: "news_item"}, [React.createElement('a', {href: "//www.jd.com/news.aspx?id=33462", target: "_blank", className: "news_link"}, ["京东生鲜即刻赔 告别退货难"])])
                ])
              ])
            ])
          ])
        ]),


        React.createElement('div', {id: "J_service", className: "service"}, [
          React.createElement('div', {className: "service_entry"}, [
            React.createElement('ul', {className: "J_tab_head service_list"}, [


              React.createElement('li', {className: "service_item service_frame mod_tab_head_item"}, [
                React.createElement('a', {target: "_blank", href: "//chongzhi.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11a"}, [React.createElement('i', {className: "service_ico service_ico_huafei"}),
                  React.createElement('span', {className: "service_txt"}, ["话费"])
                ])
              ]),

              React.createElement('li', {className: "service_item service_frame mod_tab_head_item"}, [
                React.createElement('a', {target: "_blank", href: "//jipiao.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11b"}, [React.createElement('i', {className: "service_ico service_ico_jipiao"}),
                  React.createElement('span', {className: "service_txt"}, ["机票"])
                ])
              ]),

              React.createElement('li', {className: "service_item service_frame mod_tab_head_item"}, [
                React.createElement('a', {target: "_blank", href: "//hotel.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11c"}, [React.createElement('i', {className: "service_ico service_ico_jiudian"}),
                  React.createElement('span', {className: "service_txt"}, ["酒店"])
                ])
              ]),

              React.createElement('li', {className: "service_item service_frame mod_tab_head_item"}, [
                React.createElement('a', {target: "_blank", href: "//game.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11d"}, [React.createElement('i', {className: "service_ico service_ico_youxi"}),
                  React.createElement('span', {className: "service_txt"}, ["游戏"])
                ])
              ]),

              React.createElement('li', {className: "service_item "}, [
                React.createElement('a', {target: "_blank", href: "//b.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11e"}, [React.createElement('i', {className: "service_ico service_ico_qyg"}),
                  React.createElement('span', {className: "service_txt"}, ["企业购"])
                ])
              ]),

              React.createElement('li', {className: "service_item "}, [
                React.createElement('a', {target: "_blank", href: "//jiayouka.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11f"}, [
                  React.createElement('span', {className: "service_corner"}, [
                    React.createElement('i', {className: "service_corner_txt"}, ["惠"]),React.createElement('i', {className: "service_corner_ico"})
                  ]),React.createElement('i', {className: "service_ico service_ico_jiayou"}),
                  React.createElement('span', {className: "service_txt"}, ["加油卡"])
                ])
              ]),

              React.createElement('li', {className: "service_item "}, [
                React.createElement('a', {target: "_blank", href: "//movie.jd.com/index.html", className: "service_lk", clstag: "h|keycount|2016|11g"}, [React.createElement('i', {className: "service_ico service_ico_dianying"}),
                  React.createElement('span', {className: "service_txt"}, ["电影票"])
                ])
              ]),

              React.createElement('li', {className: "service_item "}, [
                React.createElement('a', {target: "_blank", href: "//train.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11h"}, [React.createElement('i', {className: "service_ico service_ico_huoche"}),
                  React.createElement('span', {className: "service_txt"}, ["火车票"])
                ])
              ]),

              React.createElement('li', {className: "service_item "}, [
                React.createElement('a', {target: "_blank", href: "//z.jd.com/sceneIndex.html?from=jrscyn_20162", className: "service_lk", clstag: "h|keycount|2016|11i"}, [React.createElement('i', {className: "service_ico service_ico_zhongchou"}),
                  React.createElement('span', {className: "service_txt"}, ["众筹"])
                ])
              ]),

              React.createElement('li', {className: "service_item "}, [
                React.createElement('a', {target: "_blank", href: "//licai.jd.com/?from=jrscyn_20161", className: "service_lk", clstag: "h|keycount|2016|11j"}, [React.createElement('i', {className: "service_ico service_ico_licai"}),
                  React.createElement('span', {className: "service_txt"}, ["理财"])
                ])
              ]),

              React.createElement('li', {className: "service_item "}, [
                React.createElement('a', {target: "_blank", href: "//o.jd.com/market/index.action", className: "service_lk", clstag: "h|keycount|2016|11k"}, [React.createElement('i', {className: "service_ico service_ico_lipin"}),
                  React.createElement('span', {className: "service_txt"}, ["礼品卡"])
                ])
              ]),

              React.createElement('li', {className: "service_item "}, [
                React.createElement('a', {target: "_blank", href: "//baitiao.jd.com/?from=jrscyn_20160", className: "service_lk", clstag: "h|keycount|2016|11l"}, [React.createElement('i', {className: "service_ico service_ico_baitiao"}),
                  React.createElement('span', {className: "service_txt"}, ["白条"])
                ])
              ])

            ])
          ]),

          React.createElement('div', {className: "J_tab_content service_pop"}, [
            React.createElement('div', {className: "mod_tab_content_item service_pop_item mod_loading"}),
            React.createElement('div', {className: "mod_tab_content_item service_pop_item mod_loading"}),
            React.createElement('div', {className: "mod_tab_content_item service_pop_item mod_loading"}),
            React.createElement('div', {className: "mod_tab_content_item service_pop_item mod_loading"}),
            React.createElement('a', {className: "J_service_pop_close service_pop_close iconfont", href: "javascript:;"}, [""])
          ])
        ])

      ])
    ]),
    React.createElement('div', {id: "J_fs_act", className: "fs_act"})
  ]),

  React.createElement('div', {className: "J_f J_lazyload J_sk mod_lazyload need_ani sk", id: "seckill", 'data-tpl': "seckill_tpl", 'data-custom': "true"}
  ),
  React.createElement('div', {className: "J_f J_lazyload J_fbt mod_lazyload need_ani fbt", id: "fbt", 'data-tpl': "fbt_tpl", 'data-custom': "true"}
  ),
  React.createElement('div', {className: "J_f J_lazyload mod_lazyload need_ani coupon", id: "coupon_lazy", 'data-tpl': "floor_coupon_tpl", 'data-backup': "coupons", 'data-source': "cms:coupons"}
  ),
  React.createElement('div', {className: "J_f J_lazyload mod_lazyload need_ani rec", id: "rec_1", 'data-tpl': "rec_tpl", 'data-backup': "banner_1", 'data-source': "cms:banner_1"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani entry entry_c3 entry_1", id: "entry_1", 'data-tpl': "entry_tpl", 'data-backup': "entry", 'data-source': "cms:entry"}

  ),
  React.createElement('div', {className: "J_f J_lazyload mod_lazyload rec", id: "rec_2", 'data-tpl': "rec_tpl", 'data-backup': "banner_2", 'data-source': "cms:banner_2"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn chn_t", id: "portal_1", 'data-tpl': "portal_tpl", 'data-backup': "basic_1", 'data-source': "cms:basic_1"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_2", 'data-backup': "basic_2", 'data-source': "cms:basic_2", 'data-tpl': "portal_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_3", 'data-backup': "basic_3", 'data-source': "cms:basic_3", 'data-tpl': "portal_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_4", 'data-backup': "basic_4", 'data-source': "cms:basic_4", 'data-tpl': "portal_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload mod_lazyload rec", id: "rec_3", 'data-backup': "banner_3", 'data-source': "cms:banner_3", 'data-tpl': "rec_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_5", 'data-backup': "basic_5", 'data-source': "cms:basic_5", 'data-tpl': "portal_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_6", 'data-backup': "basic_6", 'data-source': "cms:basic_6", 'data-tpl': "portal_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_7", 'data-backup': "basic_7", 'data-source': "cms:basic_7", 'data-tpl': "portal_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_8", 'data-backup': "basic_8", 'data-source': "cms:basic_8", 'data-tpl': "portal_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload mod_lazyload need_ani entry entry_c7 entry_2", id: "entry_2", 'data-backup': "special_2", 'data-source': "cms:special_2", 'data-tpl': "entry_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload mod_lazyload rec", id: "rec_4", 'data-backup': "banner_4", 'data-source': "cms:banner_4", 'data-tpl': "rec_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload more J_more", id: "more", 'data-custom': "true", 'data-tpl': "more_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload mod_lazyload mod_footer", id: "footer", 'data-tpl': "mod_footer_tpl"}

  ),
  React.createElement('div', {className: "J_f J_lazyload J_lift mod_lazyload lift", id: "lift", 'data-tpl': "elevator_tpl", 'data-forcerender': "true"}

  )

])

;var B=FastReact.createElement('body', {className: "index"}, [
  FastReact.createElement('div', {id: "shortcut"}, [
    FastReact.createElement('div', {className: "w"}, [
      FastReact.createElement('ul', {className: "fl", clstag: "h|keycount|2016|01a"}, [
        FastReact.createElement('li', {className: "dorpdown", id: "ttbar-mycity"})
      ]),
      FastReact.createElement('ul', {className: "fr"}, [
        FastReact.createElement('li', {className: "fore1", id: "ttbar-login", clstag: "h|keycount|2016|01b"}, [
          FastReact.createElement('a', {target: "_blank", href: "javascript:login();", className: "link-login"}, ["你好，请登录"]),"  ", FastReact.createElement('a', {href: "javascript:regist();", className: "link-regist style-red"}, ["免费注册"])
        ]),
        FastReact.createElement('li', {className: "spacer"}),
        FastReact.createElement('li', {className: "fore2", clstag: "h|keycount|2016|01c"}, [
          FastReact.createElement('div', {className: "dt"}, [FastReact.createElement('a', {target: "_blank", href: "//order.jd.com/center/list.action"}, ["我的订单"])])
        ]),
        FastReact.createElement('li', {className: "spacer"}),
        FastReact.createElement('li', {className: "fore3 dorpdown", id: "ttbar-myjd", clstag: "h|keycount|2016|01d"}, [
          FastReact.createElement('div', {className: "dt cw-icon"}, [FastReact.createElement('a', {target: "_blank", href: "//home.jd.com/"}, ["我的京东"]),FastReact.createElement('i', {className: "iconfont"}, [""]),FastReact.createElement('i', {className: "ci-right"}, [FastReact.createElement('s', null, ["◇"])])]),
          FastReact.createElement('div', {className: "dd dorpdown-layer"})
        ]),
        FastReact.createElement('li', {className: "spacer"}),
        FastReact.createElement('li', {className: "fore4", clstag: "h|keycount|2016|01e"}, [
          FastReact.createElement('div', {className: "dt"}, [FastReact.createElement('a', {target: "_blank", href: "//vip.jd.com/"}, ["京东会员"])])
        ]),
        FastReact.createElement('li', {className: "spacer"}),
        FastReact.createElement('li', {className: "fore5", clstag: "h|keycount|2016|01f"}, [
          FastReact.createElement('div', {className: "dt"}, [FastReact.createElement('a', {target: "_blank", href: "//b.jd.com/"}, ["企业采购"])])
        ]),
        FastReact.createElement('li', {className: "spacer"}),
        FastReact.createElement('li', {className: "fore8 dorpdown", id: "ttbar-serv", clstag: "h|keycount|2016|01g"}, [
          FastReact.createElement('div', {className: "dt cw-icon"}, ["客户服务", FastReact.createElement('i', {className: "iconfont"}, [""]),FastReact.createElement('i', {className: "ci-right"}, [FastReact.createElement('s', null, ["◇"])])]),
          FastReact.createElement('div', {className: "dd dorpdown-layer"})
        ]),
        FastReact.createElement('li', {className: "spacer"}),
        FastReact.createElement('li', {className: "fore9 dorpdown", id: "ttbar-navs", clstag: "h|keycount|2016|01h"}, [
          FastReact.createElement('div', {className: "dt cw-icon"}, ["网站导航", FastReact.createElement('i', {className: "iconfont"}, [""]),FastReact.createElement('i', {className: "ci-right"}, [FastReact.createElement('s', null, ["◇"])])]),
          FastReact.createElement('div', {className: "dd dorpdown-layer"})
        ]),
        FastReact.createElement('li', {className: "spacer"}),
        FastReact.createElement('li', {className: "fore10 mobile", id: "J_mobile", clstag: "h|keycount|2016|01i"}, [
          FastReact.createElement('div', {className: "dt mobile_txt"}, ["手机京东"]),
          FastReact.createElement('div', {className: "mobile_static"}, [
            FastReact.createElement('div', {className: "mobile_static_qrcode"})
          ]),
          FastReact.createElement('div', {id: "J_mobile_pop", className: "mod_loading mobile_pop"}
          )
        ])
      ])
    ])
  ]),

  FastReact.createElement('div', {id: "header"}, [
    FastReact.createElement('div', {className: "w"}, [
      FastReact.createElement('div', {id: "logo", className: "logo", clstag: "h|keycount|2016|02a"}, [
        FastReact.createElement('h1', {className: "logo_tit"}, [FastReact.createElement('a', {href: "//www.jd.com", className: "logo_tit_lk"}, ["京东"])]),
        FastReact.createElement('h2', {className: "logo_subtit"}, ["京东,多快好省"]),
        FastReact.createElement('div', {className: "logo_extend"})
      ]),

      FastReact.createElement('div', {id: "search"}, [
        FastReact.createElement('div', {className: "search-m"}, [
          FastReact.createElement('div', {className: "search_logo"}, [
            FastReact.createElement('a', {href: "//www.jd.com", className: "search_logo_lk", clstag: "h|keycount|2016|02b"}, ["京东，多快好省"])
          ]),
          FastReact.createElement('ul', {id: "shelper"}),

          FastReact.createElement('div', {className: "form"}, [
            FastReact.createElement('input', {clstag: "h|keycount|2016|03a", type: "text", onkeydown: "javascript:if(event.keyCode==13) search('key');", autocomplete: "off", id: "key", accesskey: "s", className: "text"}),
            FastReact.createElement('button', {clstag: "h|keycount|2016|03c", onclick: "search('key');return false;", className: "button"}, [FastReact.createElement('i', {className: "iconfont"}, [""])])
          ])
        ])
      ]),

      FastReact.createElement('div', {id: "settleup", className: "dorpdown", clstag: "h|keycount|2016|04a"}, [
        FastReact.createElement('div', {className: "cw-icon"}, [
          FastReact.createElement('i', {className: "ci-left"}),
          FastReact.createElement('i', {className: "ci-right"}),
          FastReact.createElement('i', {className: "iconfont"}, [""]),
          FastReact.createElement('a', {target: "_blank", href: "//cart.jd.com/cart.action"}, ["我的购物车"])
        ]),
        FastReact.createElement('div', {className: "dorpdown-layer"}, [
          FastReact.createElement('div', {className: "spacer"}),
          FastReact.createElement('div', {id: "settleup-content"}, [
            FastReact.createElement('span', {className: "loading"})
          ])
        ])
      ]),

      FastReact.createElement('div', {id: "hotwords", clstag: "h|keycount|2016|03b"}),



      FastReact.createElement('div', {id: "navitems"}, [

		FastReact.createElement('ul', {id: "navitems-group1"}, [
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05a", className: "fore1"}, [
			FastReact.createElement('a', {target: "_blank", href: "//miaosha.jd.com/"}, ["秒杀"])
		  ]),
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05b", className: "fore2"}, [
			FastReact.createElement('a', {target: "_blank", href: "https://a.jd.com/"}, ["优惠券"])
		  ]),
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05c", className: "fore3"}, [
			FastReact.createElement('a', {target: "_blank", href: "//red.jd.com/"}, ["闪购"])
		  ]),
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05d", className: "fore4"}, [
			FastReact.createElement('a', {target: "_blank", href: "//paimai.jd.com/"}, ["拍卖"])
		  ])
		]),
		FastReact.createElement('div', {className: "spacer"}),
		FastReact.createElement('ul', {id: "navitems-group2"}, [
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05e", className: "fore1"}, [
			FastReact.createElement('a', {target: "_blank", href: "https://channel.jd.com/fashion.html "}, ["服装城"])
		  ]),
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05f", className: "fore2"}, [
			FastReact.createElement('a', {target: "_blank", href: "//chaoshi.jd.com/"}, ["京东超市"])
		  ]),
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05g", className: "fore3"}, [
			FastReact.createElement('a', {target: "_blank", href: "//fresh.jd.com/"}, ["生鲜"])
		  ]),
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05h", className: "fore4"}, [
			FastReact.createElement('a', {target: "_blank", href: "//www.jd.hk/"}, ["全球购"])
		  ])
		]),
		FastReact.createElement('div', {className: "spacer"}),
		FastReact.createElement('ul', {id: "navitems-group3"}, [
		  FastReact.createElement('li', {clstag: "h|keycount|2016|05i", className: "fore1"}, [
			FastReact.createElement('a', {target: "_blank", href: "//jr.jd.com/"}, ["京东金融"])
		  ])
		])
      ]),
      FastReact.createElement('div', {id: "treasure", clstag: "h|keycount|2016|07a"})
    ])
  ]),
  FastReact.createElement('div', null, [FastReact.createElement('a', {href: "//yp.jd.com/737a388d45369e8d237.html"}, ["新飞冰箱"]),FastReact.createElement('a', {href: "//yp.jd.com/sitemap.html"}, ["优评地图"]),FastReact.createElement('a', {href: "//www.jd.com/chanpin/311739.html"}, ["华为P10"]),FastReact.createElement('a', {href: "//xin.jd.com/"}, ["新通路"]),FastReact.createElement('a', {href: "//gou.jd.com/"}, ["超值购"]),FastReact.createElement('a', {href: "//www.jd.com/newWare.html"}, ["最新商品"]),FastReact.createElement('a', {href: "//club.jd.com/review/3133813-3-1.html"}, ["iPhone7怎么样"]),FastReact.createElement('a', {href: "//www.jd.com/chanpin/15006.html"}, ["低帮鞋"]),FastReact.createElement('a', {href: "//mall.jd.com/index-1000001383.html"}, ["沁园净水器"]),FastReact.createElement('a', {href: "//mall.jd.com/index-1000000192.html"}, ["金士顿"]),FastReact.createElement('a', {href: "//www.jd.com/pinpai/30338.html"}, ["Nike"]),FastReact.createElement('a', {href: "//www.jd.com/pinpai/18512.html"}, ["New Balance"]),FastReact.createElement('a', {href: "//club.jd.com/review/2402692-3-1.html"}, ["小米5怎么样"]),FastReact.createElement('a', {href: "//club.jd.com/review/1178681-3-1.html"}, ["合生元奶粉怎么样"]),FastReact.createElement('a', {href: "//so.m.jd.com/pinpai/9211.html"}, ["杰克琼斯"]),FastReact.createElement('a', {href: "//www.jd.com/chanpin/86.html"}, ["女装羽绒服"]),FastReact.createElement('a', {href: "//yp.jd.com/7376d932f5d63621a19.html"}, ["bcd-215dk"]),FastReact.createElement('a', {href: "//yp.jd.com/737991d93f9bee04603.html"}, ["制冰冰箱"]),FastReact.createElement('a', {href: "//yp.jd.com/737af5baf5dfc86610c.html"}, ["冰琪琳机器"]),FastReact.createElement('a', {href: "//yp.jd.com/737cc643bbf9c2d1124.html"}, ["冰箱 对开"]),FastReact.createElement('a', {href: "//yp.jd.com/73711a90e2f006a7ce3.html"}, ["bcd-215skcc"]),FastReact.createElement('a', {href: "//yp.jd.com/737e7b73ec4c8eb776c.html"}, ["冰箱对开双门"]),FastReact.createElement('a', {href: "//yp.jd.com/737c7d81347f587468f.html"}, ["BCD-202TD 冰箱"]),FastReact.createElement('a', {href: "//yp.jd.com/737b72fec07bfedecc9.html"}, ["艾思卡勒112-286"]),FastReact.createElement('a', {href: "//yp.jd.com/7379f571ee8cde21a33.html"}, ["冰箱 美的"]),FastReact.createElement('a', {href: "//yp.jd.com/737dd349e72e2d51bc7.html"}, ["bcd-215kcb"]),FastReact.createElement('a', {href: "//yp.jd.com/7374ae74407948a0b6e.html"}, ["冰箱迷你家用"]),FastReact.createElement('a', {href: "//yp.jd.com/73704749394ccb47942.html"}, ["aymg112-2"]),FastReact.createElement('a', {href: "//yp.jd.com/737328887fcb92af799.html"}, ["bcd-603wd"]),FastReact.createElement('a', {href: "//yp.jd.com/737b2da69bcafca5961.html"}, ["abpg169-1-2"]),FastReact.createElement('a', {href: "//yp.jd.com/737ba4d42d747b1e278.html"}, ["bcd-331wbcz"]),FastReact.createElement('a', {href: "//yp.jd.com/73718fafb369027b176.html"}, ["BCD-117BSJ"]),FastReact.createElement('a', {href: "//yp.jd.com/737ff05247821404337.html"}, ["bcd-216e3gr"]),FastReact.createElement('a', {href: "//yp.jd.com/7373e742dbd9a3f5a81.html"}, ["艾尔之光冰"]),FastReact.createElement('a', {href: "//yp.jd.com/7375d0ff5614c212c29.html"}, ["bcd-215tgmk(E)215"]),FastReact.createElement('a', {href: "//yp.jd.com/737752e5e9c2a0b9165.html"}, ["aymg112-1"])]),
  FastReact.createElement('div', {className: "fs"}, [
    FastReact.createElement('div', {className: "grid_c1 fs_inner"}, [


      FastReact.createElement('div', {className: "fs_col1"}, [
        FastReact.createElement('div', {className: "J_cate cate"}, [
          FastReact.createElement('ul', {className: "JS_navCtn cate_menu"}, [
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "1", clstag: "h|keycount|2016|0601a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//jiadian.jd.com"}, ["家用电器"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "2", clstag: "h|keycount|2016|0602a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//shouji.jd.com/"}, ["手机"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//wt.jd.com"}, ["运营商"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//shuma.jd.com/"}, ["数码"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "3", clstag: "h|keycount|2016|0603a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//diannao.jd.com/"}, ["电脑"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//bg.jd.com"}, ["办公"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "4", clstag: "h|keycount|2016|0604a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/home.html"}, ["家居"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/furniture.html"}, ["家具"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/decoration.html"}, ["家装"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/kitchenware.html"}, ["厨具"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "5", clstag: "h|keycount|2016|0605a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/1315-1342.html"}, ["男装"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/1315-1343.html"}, ["女装"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/children.html"}, ["童装"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/1315-1345.html"}, ["内衣"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "6", clstag: "h|keycount|2016|0606a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/beauty.html"}, ["美妆个护"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/pet.html"}, ["宠物"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "7", clstag: "h|keycount|2016|0607a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/womensshoes.html"}, ["女鞋"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/bag.html"}, ["箱包"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/watch.html"}, ["钟表"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/jewellery.html"}, ["珠宝"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "8", clstag: "h|keycount|2016|0608a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/mensshoes.html"}, ["男鞋"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/yundongcheng.html"}, ["运动"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/outdoor.html"}, ["户外"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "9", clstag: "h|keycount|2016|0609a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "http://car.jd.com/"}, ["汽车"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//che.jd.com/"}, ["汽车用品"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "10", clstag: "h|keycount|2016|0610a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//baby.jd.com"}, ["母婴"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//toy.jd.com/"}, ["玩具乐器"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "11", clstag: "h|keycount|2016|0611a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/food.html"}, ["食品"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//jiu.jd.com"}, ["酒类"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//fresh.jd.com"}, ["生鲜"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//china.jd.com"}, ["特产"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "12", clstag: "h|keycount|2016|0612a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//health.jd.com"}, ["医药保健"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//channel.jd.com/9192-9196.html"}, ["计生情趣"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "13", clstag: "h|keycount|2016|0613a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//book.jd.com/"}, ["图书"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//mvd.jd.com/"}, ["音像"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//e.jd.com/ebook.html"}, ["电子书"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "14", clstag: "h|keycount|2016|0614a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//jipiao.jd.com/"}, ["机票"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//hotel.jd.com/"}, ["酒店"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//trip.jd.com/"}, ["旅游"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//ish.jd.com/"}, ["生活"])]),
            FastReact.createElement('li', {className: "cate_menu_item", 'data-index': "15", clstag: "h|keycount|2016|0615a"}, [" ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//licai.jd.com/"}, ["理财"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//z.jd.com/"}, ["众筹"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//baitiao.jd.com"}, ["白条"]),FastReact.createElement('span', {className: "cate_menu_line"}, ["/"]),"  ", FastReact.createElement('a', {target: "_blank", className: "cate_menu_lk", href: "//bao.jd.com/"}, ["保险"])])

          ]),
          FastReact.createElement('div', {className: "JS_popCtn cate_pop mod_loading"})
        ])
      ]),


      FastReact.createElement('div', {className: "fs_col2"}, [

        FastReact.createElement('div', {className: "J_slider slider"}, [
          FastReact.createElement('div', {className: "J_slider_main slider_main"}),
          FastReact.createElement('div', {className: "J_slider_extend slider_extend clearfix"})
        ])
      ]),

      FastReact.createElement('div', {className: "fs_col3"}, [

        FastReact.createElement('div', {className: "J_user user mod_loading"}
        ),


        FastReact.createElement('div', {className: "news J_news"}, [
          FastReact.createElement('div', {className: "mod_tab news_tab J_news_tab"}, [
            FastReact.createElement('div', {className: "mod_tab_head J_tab_head clearfix"}, [
              FastReact.createElement('a', {href: "javascript:;", className: "mod_tab_head_item news_first mod_tab_head_item_on", clstag: "h|keycount|2016|10a"}, ["促销"]),
              FastReact.createElement('a', {href: "javascript:;", className: "mod_tab_head_item news_last", clstag: "h|keycount|2016|10b"}, ["公告"]),
              FastReact.createElement('div', {className: "news_tab_active J_news_tab_active"}),
              FastReact.createElement('a', {href: "//www.jd.com/moreSubject.aspx", target: "_blank", className: "news_more", clstag: "h|keycount|2016|10c"}, ["更多"])
            ]),
            FastReact.createElement('div', {className: "mod_tab_content J_tab_content", clstag: "h|keycount|2016|10d"}, [
              FastReact.createElement('div', {className: "mod_tab_content_item mod_tab_content_item_on"}, [
                FastReact.createElement('ul', {className: "news_list"}, [

            	  FastReact.createElement('li', {className: "news_item"}, [FastReact.createElement('a', {href: "//dgposy.jd.com/", target: "_blank", className: "news_link"}, ["宝生元春季家装厨卫大放送"])]),
            	  FastReact.createElement('li', {className: "news_item"}, [FastReact.createElement('a', {href: "https://sale.jd.com/act/REu2gb0BYlNI1.html", target: "_blank", className: "news_link"}, ["家电满5000送1999礼券"])]),
            	  FastReact.createElement('li', {className: "news_item"}, [FastReact.createElement('a', {href: "https://sale.jd.com/act/A3sa5X0HWTSM.html", target: "_blank", className: "news_link"}, ["疯狂星期五，爆品2件5折"])]),
            	  FastReact.createElement('li', {className: "news_item"}, [FastReact.createElement('a', {href: "https://sale.jd.com/act/RO4H8trivp1.html", target: "_blank", className: "news_link"}, ["200元E卡免费抽"])])
                ])
              ]),
              FastReact.createElement('div', {className: "mod_tab_content_item"}, [
                FastReact.createElement('ul', {className: "news_list"}, [

            	  FastReact.createElement('li', {className: "news_item"}, [FastReact.createElement('a', {href: "//www.jd.com/news.aspx?id=33743", target: "_blank", className: "news_link"}, ["京东热水器品类安装收费封顶"])]),
            	  FastReact.createElement('li', {className: "news_item"}, [FastReact.createElement('a', {href: "//www.jd.com/news.aspx?id=33549", target: "_blank", className: "news_link"}, ["英国超市ASDA入驻京东"])]),
            	  FastReact.createElement('li', {className: "news_item"}, [FastReact.createElement('a', {href: "//www.jd.com/news.aspx?id=33548", target: "_blank", className: "news_link"}, ["京东与欧莱雅中国合作升级 "])]),
            	  FastReact.createElement('li', {className: "news_item"}, [FastReact.createElement('a', {href: "//www.jd.com/news.aspx?id=33462", target: "_blank", className: "news_link"}, ["京东生鲜即刻赔 告别退货难"])])
                ])
              ])
            ])
          ])
        ]),


        FastReact.createElement('div', {id: "J_service", className: "service"}, [
          FastReact.createElement('div', {className: "service_entry"}, [
            FastReact.createElement('ul', {className: "J_tab_head service_list"}, [


              FastReact.createElement('li', {className: "service_item service_frame mod_tab_head_item"}, [
                FastReact.createElement('a', {target: "_blank", href: "//chongzhi.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11a"}, [FastReact.createElement('i', {className: "service_ico service_ico_huafei"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["话费"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item service_frame mod_tab_head_item"}, [
                FastReact.createElement('a', {target: "_blank", href: "//jipiao.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11b"}, [FastReact.createElement('i', {className: "service_ico service_ico_jipiao"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["机票"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item service_frame mod_tab_head_item"}, [
                FastReact.createElement('a', {target: "_blank", href: "//hotel.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11c"}, [FastReact.createElement('i', {className: "service_ico service_ico_jiudian"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["酒店"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item service_frame mod_tab_head_item"}, [
                FastReact.createElement('a', {target: "_blank", href: "//game.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11d"}, [FastReact.createElement('i', {className: "service_ico service_ico_youxi"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["游戏"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item "}, [
                FastReact.createElement('a', {target: "_blank", href: "//b.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11e"}, [FastReact.createElement('i', {className: "service_ico service_ico_qyg"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["企业购"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item "}, [
                FastReact.createElement('a', {target: "_blank", href: "//jiayouka.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11f"}, [
                  FastReact.createElement('span', {className: "service_corner"}, [
                    FastReact.createElement('i', {className: "service_corner_txt"}, ["惠"]),FastReact.createElement('i', {className: "service_corner_ico"})
                  ]),FastReact.createElement('i', {className: "service_ico service_ico_jiayou"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["加油卡"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item "}, [
                FastReact.createElement('a', {target: "_blank", href: "//movie.jd.com/index.html", className: "service_lk", clstag: "h|keycount|2016|11g"}, [FastReact.createElement('i', {className: "service_ico service_ico_dianying"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["电影票"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item "}, [
                FastReact.createElement('a', {target: "_blank", href: "//train.jd.com/", className: "service_lk", clstag: "h|keycount|2016|11h"}, [FastReact.createElement('i', {className: "service_ico service_ico_huoche"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["火车票"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item "}, [
                FastReact.createElement('a', {target: "_blank", href: "//z.jd.com/sceneIndex.html?from=jrscyn_20162", className: "service_lk", clstag: "h|keycount|2016|11i"}, [FastReact.createElement('i', {className: "service_ico service_ico_zhongchou"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["众筹"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item "}, [
                FastReact.createElement('a', {target: "_blank", href: "//licai.jd.com/?from=jrscyn_20161", className: "service_lk", clstag: "h|keycount|2016|11j"}, [FastReact.createElement('i', {className: "service_ico service_ico_licai"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["理财"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item "}, [
                FastReact.createElement('a', {target: "_blank", href: "//o.jd.com/market/index.action", className: "service_lk", clstag: "h|keycount|2016|11k"}, [FastReact.createElement('i', {className: "service_ico service_ico_lipin"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["礼品卡"])
                ])
              ]),

              FastReact.createElement('li', {className: "service_item "}, [
                FastReact.createElement('a', {target: "_blank", href: "//baitiao.jd.com/?from=jrscyn_20160", className: "service_lk", clstag: "h|keycount|2016|11l"}, [FastReact.createElement('i', {className: "service_ico service_ico_baitiao"}),
                  FastReact.createElement('span', {className: "service_txt"}, ["白条"])
                ])
              ])

            ])
          ]),

          FastReact.createElement('div', {className: "J_tab_content service_pop"}, [
            FastReact.createElement('div', {className: "mod_tab_content_item service_pop_item mod_loading"}),
            FastReact.createElement('div', {className: "mod_tab_content_item service_pop_item mod_loading"}),
            FastReact.createElement('div', {className: "mod_tab_content_item service_pop_item mod_loading"}),
            FastReact.createElement('div', {className: "mod_tab_content_item service_pop_item mod_loading"}),
            FastReact.createElement('a', {className: "J_service_pop_close service_pop_close iconfont", href: "javascript:;"}, [""])
          ])
        ])

      ])
    ]),
    FastReact.createElement('div', {id: "J_fs_act", className: "fs_act"})
  ]),

  FastReact.createElement('div', {className: "J_f J_lazyload J_sk mod_lazyload need_ani sk", id: "seckill", 'data-tpl': "seckill_tpl", 'data-custom': "true"}
  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_fbt mod_lazyload need_ani fbt", id: "fbt", 'data-tpl': "fbt_tpl", 'data-custom': "true"}
  ),
  FastReact.createElement('div', {className: "J_f J_lazyload mod_lazyload need_ani coupon", id: "coupon_lazy", 'data-tpl': "floor_coupon_tpl", 'data-backup': "coupons", 'data-source': "cms:coupons"}
  ),
  FastReact.createElement('div', {className: "J_f J_lazyload mod_lazyload need_ani rec", id: "rec_1", 'data-tpl': "rec_tpl", 'data-backup': "banner_1", 'data-source': "cms:banner_1"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani entry entry_c3 entry_1", id: "entry_1", 'data-tpl': "entry_tpl", 'data-backup': "entry", 'data-source': "cms:entry"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload mod_lazyload rec", id: "rec_2", 'data-tpl': "rec_tpl", 'data-backup': "banner_2", 'data-source': "cms:banner_2"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn chn_t", id: "portal_1", 'data-tpl': "portal_tpl", 'data-backup': "basic_1", 'data-source': "cms:basic_1"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_2", 'data-backup': "basic_2", 'data-source': "cms:basic_2", 'data-tpl': "portal_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_3", 'data-backup': "basic_3", 'data-source': "cms:basic_3", 'data-tpl': "portal_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_4", 'data-backup': "basic_4", 'data-source': "cms:basic_4", 'data-tpl': "portal_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload mod_lazyload rec", id: "rec_3", 'data-backup': "banner_3", 'data-source': "cms:banner_3", 'data-tpl': "rec_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_5", 'data-backup': "basic_5", 'data-source': "cms:basic_5", 'data-tpl': "portal_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_6", 'data-backup': "basic_6", 'data-source': "cms:basic_6", 'data-tpl': "portal_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_7", 'data-backup': "basic_7", 'data-source': "cms:basic_7", 'data-tpl': "portal_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload need_ani chn", id: "portal_8", 'data-backup': "basic_8", 'data-source': "cms:basic_8", 'data-tpl': "portal_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload mod_lazyload need_ani entry entry_c7 entry_2", id: "entry_2", 'data-backup': "special_2", 'data-source': "cms:special_2", 'data-tpl': "entry_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload mod_lazyload rec", id: "rec_4", 'data-backup': "banner_4", 'data-source': "cms:banner_4", 'data-tpl': "rec_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_f_lift mod_lazyload more J_more", id: "more", 'data-custom': "true", 'data-tpl': "more_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload mod_lazyload mod_footer", id: "footer", 'data-tpl': "mod_footer_tpl"}

  ),
  FastReact.createElement('div', {className: "J_f J_lazyload J_lift mod_lazyload lift", id: "lift", 'data-tpl': "elevator_tpl", 'data-forcerender': "true"}

  )

])

;exports.A = A;exports.B = B;exports.info={"count":346,"maxDepth":10,"depthMap":{"1":24,"2":40,"3":11,"4":32,"5":40,"6":47,"7":95,"8":14,"9":33,"10":10}}