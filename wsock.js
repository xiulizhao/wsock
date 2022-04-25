(function(root, factory) {

  /* CommonJS */
  if (typeof exports == "object") module.exports = factory();

  /* AMD module */
  else if (typeof define == "function" && define.amd) define(factory);

  /* Browser global */
  else root.wwclass = factory();
}(this, function() {
  "use strict";

  var wwclassName = /*INSBEGIN:WWCLSNAME*/
    "wsock"
  /*INSEND:WWCLSNAME*/
  ;

  // 加载依赖资源, 如没有依赖资源可直接回调
  var loadDependence = function(fncallback) {
    // 若需要配置依赖
    // 添加标识以避免重复加载
    if (!window.wwload.stomp) {
      window.wwload.stomp = "wait";
      requirejs.config({
        paths: {
          "stomp": "libs/stomp-websocket/lib/stomp.min"
        }
      });
      require(["stomp"], function() {
        window.wwload.stomp = true;
        replace();
        fncallback();
      });
    } else if (window.wwload.stomp === "wait") {
      setTimeout(function() {
        loadDependence(fncallback);
      }, 100);
    } else {
      replace();
      fncallback();
    }

    function replace() {
      loadDependence = function(fncallback) {
        fncallback();
      }
    }
  };

  // 本函数处理元素初始化动作
  var init = function() {
    init = function() {
      return true;
    };

    $.wwclass.addEvtinHandler(wwclassName, evtInHandler);

    // 如有其他初始化动作, 请继续在下方添加
  };

  // 处理元素, 传入了元素对象($前缀表明是一个jquery对象).
  var processElement = function($ele) {
    var url = $ele.attr("data--wsurl");
    if (url && ((url.indexOf("ws://") !== 0 && url.indexOf("wss://") !== 0))) {
      var hostName = $ele.attr("data-wshost") || document.location.hostname;
      var sep = (url.length > 0 && url[0] === '/') ? '' : '/';
      if (document.location.protocol == "https:") {
        url = "wss://" + hostName + sep + url;
      } else {
        url = "ws://" + hostName + sep + url;
      }
    }
    if (url) {
      console.log("尝试链接到服务器：", url);
      // var url = $.wwclass.helper.getJSONprop($ele, "data--wsurl");
      var currentClient = $ele.data("wsclient");
      //remove value.
      $ele.removeData("value");
      if (currentClient) {
        //remove client if exist.
        $ele.removeData("wsclient");
        if (currentClient.connected) {
          currentClient.disconnect(function() {
            $ele.trigger("disconnected.ww");
            $ele.attr("data-x-status", "disconnected");
          });
        }
      }

      currentClient = new window.Stomp.client(url);
      //disable debug mode.
      currentClient.debug = function() {};
      $ele.data("wsclient", currentClient);
      currentClient.connect("wware", "wware", function(frame) {
        if (currentClient !== $ele.data("wsclient")) {
          currentClient.disconnect(function() {
            //reconected,so we not trigger event.
            //$ele.trigger("disconnected.ww");
            //$ele.attr("data-x-status", "disconnected");
          });
        } else {
          if (frame && frame.headers && frame.headers.subscription) {
            var substr = frame.headers.subscription.toString();
            $ele.data("value", substr);
            $ele.trigger("connected.ww");
            $ele.attr("data-x-status", "connected");
            $ele.attr("data-x-wid", substr);
            //recieve all notify message.
            currentClient.subscribe(substr, function(frame) {
              if (currentClient !== $ele.data("wsclient")) {
                //@TODO: shall we need unsubscribe? NO, we don't. because we disconnect in next statement.
                currentClient.disconnect(function() {
                  //reconected,so we not trigger event.
                  //$ele.trigger("disconnected.ww");
                  //$ele.attr("data-x-status", "disconnected");
                });
              }

              // console.log("----subscribe", frame.headers._runCommand);
              // $("body").append("<p>" + JSON.stringify(frame) + "</p>");
              if (frame.headers._runCommand) {
                if($ele.attr("data-norun") !== "true") {
                  $.wwclass.runCommand(JSON.parse(frame.headers._runCommand));
                }
              }
            });
          } else {
            // console.log(frame);
            $ele.trigger("disconnected.ww");
            $ele.attr("data-x-status", "disconnected");
            $ele.attr("data-x-wid", "");
          }
        }
      }, function(err) {
        console.log(err);
        $ele.trigger("disconnected.ww");
        $ele.attr("data-x-status", "disconnected");
        $ele.attr("data-x-wid", "");
      });
    }
  };

  // 监听属性相关处理
  var evtInHandler = function($ele, attribute, value) {
    // 处理代码
    switch (attribute) {
      case "data--wsurl":
        processElement($ele);
        break;
      default:
        console.info("监听到 " + attribute + " 属性值改变为 " + value + ", 但是没找到对应处理动作.");
    }
  };

  // 以下部分不需要修改
  if (!$.wwclass) {
    console.error("Can not use without wwclass.js");
    return false;
  }

  var ret = /*INSBEGIN:WWCLSHANDLER*/
    function(set) {
      if (set.length > 0) {
        loadDependence(function() {
          init();
          $(set).each(function(index, targetDom) {
            processElement($(targetDom));
          });
        });
      }
    }
  /*INSEND:WWCLSHANDLER*/
  ;

  return ret;

}));
