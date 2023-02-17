// 凡例の表示
export function layerGuide(selectedLayerIds, layerVis, jinryu_exist_date) {
    // NC（降水 【時系列】）
    if (selectedLayerIds != null && selectedLayerIds == "降水【時系列】") {
        if (layerVis) {
            let colorbarUrl = "./JSONLayers/legend/img/wni_colorbar.png";
            let scaleUrl = "./JSONLayers/legend/img/wni_colorbar_scale.png";
            let $legend = $("<div class=\"" + "wni" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
            $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
            $("#legend").append($legend);
        }
        else {
            // $("#legend").empty();
            $(".wni").remove();
        }
    }
    // 日射量
    if (selectedLayerIds != null && selectedLayerIds == "日射【時系列】") {
        if (layerVis) {
            let $legend = '';
            let colorbarUrl = "./JSONLayers/legend/img/amjp_colorbar.png";
            let scaleUrl = "./JSONLayers/legend/img/amjp_colorbar_scale.png";
            $legend = $("<div class=\"" + "amjp" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
            $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
            $("#legend").append($legend);
        }
        else {
            // $("#legend").empty();
            $(".amjp").remove();
        }
      }
      // 気温
      if (selectedLayerIds != null && selectedLayerIds == "温度【時系列】") {
        if (layerVis) {
            let colorbarUrl = "./JSONLayers/legend/img/amjp_colorbar.png";
            let scaleUrl = "./JSONLayers/legend/img/amjp_colorbar_scale_temp.png";
            let $legend = $("<div class=\"" + "amjp_temp" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
            $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_opacity_0.8");
            $("#legend").append($legend);
        }
        else {
            // $("#legend").empty();
            $(".amjp_temp").remove();
        }
      }
      // 湿度
      if (selectedLayerIds != null && selectedLayerIds == "湿度【時系列】") {
        if (layerVis) {
            let colorbarUrl = "./JSONLayers/legend/img/amjp_colorbar.png";
            let scaleUrl = "./JSONLayers/legend/img/amjp_colorbar_scale_humidity.png";
            let $legend = $("<div class=\"" + "amjp_humidity" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
            $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
            $("#legend").append($legend);
        }
        else {
            // $("#legend").empty();
            $(".amjp_humidity").remove();
        }
      }
      // 風速
      if (selectedLayerIds != null && selectedLayerIds == "風向【時系列】") {
        if (layerVis) {
            let colorbarUrl = "./JSONLayers/legend/img/wnd_colorbar.png";
            let scaleUrl = "./JSONLayers/legend/img/amjp_colorbar_scale_wnd.png";
            let $legend = $("<div class=\"" + "amjp_wnd" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
            $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
            $("#legend").append($legend);
        }
        else {
            // $("#legend").empty();
            $(".amjp_wnd").remove();
        }
      }

      // 公共施設
      if (selectedLayerIds != null && selectedLayerIds == "公共施設") {
        if (layerVis) {
            let $legend = '';
            $legend += '<div><span style="background-color: #00EE00"></span>建物</div>';
            $legend += '<div><span style="background-color: #FFAAFF"></span>その他</div>';
            $legend += '<div><span style="background-color: #FFFF66"></span>国の機関</div>';
            $legend += '<div><span style="background-color: #770000"></span>地方公共団体</div>';
            $legend += '<div><span style="background-color: #006600"></span>厚生機関</div>';
            $legend += '<div><span style="background-color: #8EB8FF"></span>警察機関</div>';
            $legend += '<div><span style="background-color: #FFFF00"></span>消防署</div>';
            $legend += '<div><span style="background-color: #000080"></span>学校</div>';
            $legend += '<div><span style="background-color: #FF22FF"></span>病院</div>';
            $legend += '<div><span style="background-color: #A16EFF"></span>郵便局</div>';
            $legend += '<div><span style="background-color: #C0C0C0"></span>福祉施設</div>';
            $("#pop_legend").append($legend);
            $("#pop_legend").addClass("pop_legend");
            $("#pop_legend").css("display" , "block");
        } else {
            $("#pop_legend").empty();
            $("#pop_legend").removeClass("pop_legend");
        }
      }
      // 学校
      if (selectedLayerIds != null && selectedLayerIds == "学校") {
        if (layerVis) {
            let $legend = '';
            $legend += '<div><span style="background-color: #00EE00"></span>小学校</div>';
            $legend += '<div><span style="background-color: #FFAAFF"></span>中学校</div>';
            $legend += '<div><span style="background-color: #FFFF66"></span>中等教育学校</div>';
            $legend += '<div><span style="background-color: #770000"></span>高等学校</div>';
            $legend += '<div><span style="background-color: #006600"></span>高等専門学校</div>';
            $legend += '<div><span style="background-color: #8EB8FF"></span>短期大学</div>';
            $legend += '<div><span style="background-color: #FFFF00"></span>大学</div>';
            $legend += '<div><span style="background-color: #000080"></span>特別支援学校</div>';
            $("#pop_legend").append($legend);
            $("#pop_legend").addClass("pop_legend");
            $("#pop_legend").css("display" , "block");
        } else {
            $("#pop_legend").empty();
            $("#pop_legend").removeClass("pop_legend");
        }
      }
      // 人口
      if (selectedLayerIds != null && selectedLayerIds == "人口(町丁目)") {
        if (layerVis) {
            let $legend = '';
            $legend += '<div><span style="background-color: #FF3300"></span>15,000超</div>';
            $legend += '<div><span style="background-color: #FF9966"></span>15,000</div>';
            $legend += '<div><span style="background-color: #FFCC33"></span>12,500</div>';
            $legend += '<div><span style="background-color: #FFFF33"></span>10,000</div>';
            $legend += '<div><span style="background-color: #CCFF00"></span>7,500</div>';
            $legend += '<div><span style="background-color: #99FF66"></span>5,000</div>';
            $legend += '<div><span style="background-color: #E0FFFF"></span>2,500</div>';
            $("#pop_legend").append($legend);
            $("#pop_legend").addClass("pop_legend");
            $("#pop_legend").css("display" , "block");
        } else {
            $("#pop_legend").empty();
            $("#pop_legend").removeClass("pop_legend");
        }
      }
      // 人流
      if (selectedLayerIds != null && selectedLayerIds == "人流(GPS)") {
        if (layerVis) {
            let $legend = '';
            if (jinryu_exist_date != ""){
                $legend += '<div>人流データがある日と場所<BR>' + jinryu_exist_date + '</div>';
            }
            $legend += '<div>デバイスID(すべて)</div>';
            $legend += '<div><span style="background-color: #00FF3B"></span>0003</div>';
            $legend += '<div><span style="background-color: #00F9A9"></span>0004</div>';
            $legend += '<div><span style="background-color: #B6FF01"></span>0005</div>';
            $legend += '<div><span style="background-color: #00ECFF"></span>0006</div>';
            $legend += '<div><span style="background-color: #005FFF"></span>0007</div>';
            $legend += '<div><span style="background-color: #D2691E"></span>000A</div>';
            $legend += '<div><span style="background-color: #CD5C5C"></span>000B</div>';
            $legend += '<div><span style="background-color: #A52A2A"></span>000C</div>';
            $legend += '<div><span style="background-color: #8B0000"></span>000D</div>';
            $legend += '<div><span style="background-color: #DC143C"></span>0011</div>';
            $("#jinryu_legend").append($legend);
            $("#jinryu_legend").addClass("jinryu_legend");
            $("#jinryu_legend").css("display" , "block");
        } else {
            $("#jinryu_legend").empty();
            $("#jinryu_legend").removeClass("jinryu_legend");
        }
      }
}

// 要素の取得
let elements = document.getElementsByClassName("drag-and-drop");

// 要素内のクリックされた位置を取得するグローバル（のような）変数
let x;
let y;

// マウスが要素内で押されたとき、又はタッチされたとき発火
for(let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mousedown", mdown, false);
    elements[i].addEventListener("touchstart", mdown, false);
}

// マウスが押された際の関数
function mdown(e) {

    // クラス名に .drag を追加
    this.classList.add("drag");

    // タッチデイベントとマウスのイベントの差異を吸収
    if(e.type === "mousedown") {
        let event = e;
    } else {
        let event = e.changedTouches[0];
    }

    // 要素内の相対座標を取得
    x = event.pageX - this.offsetLeft;
    y = event.pageY - this.offsetTop;

    // ムーブイベントにコールバック
    document.body.addEventListener("mousemove", mmove, false);
    document.body.addEventListener("touchmove", mmove, false);

}

// マウスカーソルが動いたときに発火
function mmove(e) {

    // ドラッグしている要素を取得
    let drag = document.getElementsByClassName("drag")[0];

    // 同様にマウスとタッチの差異を吸収
    if(e.type === "mousemove") {
        let event = e;
    } else {
        let event = e.changedTouches[0];
    }

    // フリックしたときに画面を動かさないようにデフォルト動作を抑制
    e.preventDefault();

    // マウスが動いた場所に要素を動かす
    drag.style.top = event.pageY - y + "px";
    drag.style.left = event.pageX - x + "px";

    // マウスボタンが離されたとき、またはカーソルが外れたとき発火
    drag.addEventListener("mouseup", mup, false);
    document.body.addEventListener("mouseleave", mup, false);
    drag.addEventListener("touchend", mup, false);
    document.body.addEventListener("touchleave", mup, false);

}

// マウスボタンが上がったら発火
function mup(e) {
    let drag = document.getElementsByClassName("drag")[0];

    // ムーブベントハンドラの消去
    document.body.removeEventListener("mousemove", mmove, false);
    // drag.removeEventListener("mouseup", mup, false);
    document.body.removeEventListener("touchmove", mmove, false);
    // drag.removeEventListener("touchend", mup, false);

    // クラス名 .drag も消す
    // drag.classList.remove("drag");
}

export function setupSyataiLagend(sourceId, layerVis, targetData, amedasRainVis, amedasTempVis, amedasSnowVis) {
    $("#pop_legend").empty();
    $("#pop_legend").removeClass("syatai_legend");
    if(sourceId === "layer_garbagetruck" || sourceId === "layer_garbagetruck_trajectory") {
        if (layerVis) {
            // $("#pop_legend").empty();
            // $("#pop_legend").removeClass("syatai_legend");

            let $legend = '';
            $legend += '<div class="car_number">'
            $legend += '<div>車体</div>';
            $legend += '<div><span style="background-color: #32cd32"></span>_1</div>';
            $legend += '<div><span style="background-color: #191970"></span>_2</div>';
            $legend += '<div><span style="background-color: #ffa07a"></span>_3</div>';
            $legend += '<div><span style="background-color: #8b4513"></span>_4</div>';
            $legend += '<div><span style="background-color: #2f4f4f"></span>_5</div>';
            $legend += '<div><span style="background-color: #c71585"></span>_6</div>';
            $legend += '<div><span style="background-color: #d2691e"></span>_7</div>';
            $legend += '</div>'
            $legend += '<div class="speed">'
            $legend += '<div>km/h</div>';
            $legend += '<div><span style="background-color: #f60807"></span></div>';
            $legend += '<div><span style="background-color: #FF3366"></span>50</div>';
            $legend += '<div><span style="background-color: #FF9900"></span>40</div>';
            $legend += '<div><span style="background-color: #669900"></span>30</div>';
            $legend += '<div><span style="background-color: #008080"></span>20</div>';
            $legend += '<div><span style="background-color: #00bfff"></span>10</div>';
            $legend += '<div><span style="background-color: #555555"></span>5</div>';  
            $legend += '</div>'      
            $("#pop_legend").append($legend);
            $("#pop_legend").addClass("syatai_legend");
            $("#pop_legend").css("display" , "block");
        } 
        // else {
        //     $("#pop_legend").empty();
        //     $("#pop_legend").removeClass("syatai_legend");
        // }
    } else if(sourceId === "layer_amedas") {

        //24時間降雨量
        if(targetData === "precipitation24h") {
            if(amedasRainVis) {

                let $legend = '';
                $legend += '<div class="speed">'
                $legend += '<div>mm</div>';
                $legend += '<div><span style="background-color: #B40068"></span></div>';
                $legend += '<div><span style="background-color: #FF2800"></span>300</div>';
                $legend += '<div><span style="background-color: #FF9900"></span>250</div>';
                $legend += '<div><span style="background-color: #FFF500"></span>200</div>';
                $legend += '<div><span style="background-color: #0041FF"></span>150</div>';
                $legend += '<div><span style="background-color: #2190FF"></span>100</div>';
                $legend += '<div><span style="background-color: #A0D2FF"></span>80</div>';
                $legend += '<div><span style="background-color: #555555"></span>50</div>';
                $legend += '</div>'   
                $("#pop_legend").append($legend);
                $("#pop_legend").addClass("syatai_legend");
                $("#pop_legend").css("display" , "block");
            } 
            // else {
            //     $("#pop_legend").empty();
            //     $("#pop_legend").removeClass("syatai_legend");
            // }
        } else if(targetData === "temp") {
            //気温
            if(amedasTempVis) {

                let $legend = '';
                $legend += '<div class="speed">'
                $legend += '<div>℃</div>';
                $legend += '<div><span style="background-color: #6C0068"></span></div>';
                $legend += '<div><span style="background-color: #FF2800"></span>35</div>';
                $legend += '<div><span style="background-color: #FF9900"></span>30</div>';
                $legend += '<div><span style="background-color: #FFF500"></span>25</div>';
                $legend += '<div><span style="background-color: #FFFF96"></span>20</div>';
                $legend += '<div><span style="background-color: #797B7D"></span>15</div>';
                $legend += '<div><span style="background-color: #B9EBFF"></span>10</div>';
                $legend += '<div><span style="background-color: #0096FF"></span>5</div>';
                $legend += '<div><span style="background-color: #0041FF"></span>0</div>';
                $legend += '<div><span style="background-color: #002080"></span>-5</div>';
                $legend += '</div>'   
                $("#pop_legend").append($legend);
                $("#pop_legend").addClass("syatai_legend");
                $("#pop_legend").css("display" , "block");
            } 
            // else {
            //     $("#pop_legend").empty();
            //     $("#pop_legend").removeClass("syatai_legend");
            // }
        } else if(targetData === "snow"){
            //積雪量
            if(amedasSnowVis) {

                let $legend = '';
                $legend += '<div class="speed">'
                $legend += '<div>cm</div>';
                $legend += '<div><span style="background-color: #B40068"></span></div>';
                $legend += '<div><span style="background-color: #FF2800"></span>200</div>';
                $legend += '<div><span style="background-color: #FF9900"></span>150</div>';
                $legend += '<div><span style="background-color: #FFF500"></span>100</div>';
                $legend += '<div><span style="background-color: #0041FF"></span>50</div>';
                $legend += '<div><span style="background-color: #2190FF"></span>20</div>';
                $legend += '<div><span style="background-color: #A0D2FF"></span>5</div>';
                $legend += '<div><span style="background-color: #555555"></span>1</div>';
                $legend += '</div>'   
                $("#pop_legend").append($legend);
                $("#pop_legend").addClass("syatai_legend");
                $("#pop_legend").css("display" , "block");
            } 
            // else {
            //     $("#pop_legend").empty();
            //     $("#pop_legend").removeClass("syatai_legend");
            // }
        } else {
            console.log("表示できる凡例がありません");
        }
    }
}