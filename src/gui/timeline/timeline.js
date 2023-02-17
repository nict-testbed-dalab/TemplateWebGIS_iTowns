import * as itowns from "itowns";
import { $Env } from "./env";
import { setupZoomRange, setupBtnRange, setupPlayButtons } from "./main";

import { addColorLayer, updateBargraphLayer, updateAmedasBargraphLayer } from "../../layer/layer";

import * as fnc from "./fnc";
import { getParam } from "../../camera/camera";
import { formatDate } from "../../layer/layer";
import { addgeo_obj } from "../../layer/geojson";

let now = new Date();

export function setupTimeline(view, menu, amedas_graph_config, graph_config, graph_config_b, bargraphLayer_b, graph_config_r, bargraphLayer_r, graph_config_y, bargraphLayer_y) {
    $(window).on("load", function()
    {
        let inurl = new URL(location).toString();
        let inparam = $.nictSTARSViewURL.parseURL(inurl);

        let st;
        let et;
        let ct;
        if(inparam["st"] != null && inparam["st"] != ""){
            st = inparam["st"];
        }
        if(inparam["et"] != null && inparam["et"] != ""){
            et = inparam["et"];
        }
        if(inparam["ct"] != null && inparam["ct"] != ""){
            ct = inparam["ct"];
        }

        let st_time = new Date($Env.startTime  .getTime());
        let et_time = new Date($Env.endTime    .getTime());
        let ct_time = new Date($Env.currentTime.getTime());

        let ct_yyyy = formatDate(ct_time, 'YYYY');

        if(st != null && st != ""){
            st_time = toDate(st);
        }
        if(et != null && et != ""){
            et_time = toDate(et);
        }
        if(ct != null && ct != ""){
            ct_time = toDate(ct);
        }

        let time1; // レンジバーの左端の時間
        let time2; // タイムラインの時間

        fnc.adjustRangeBar();

        // let objOptions        = $("#timeline").k2goTimeline("getOptions");
        // let objRangeStartTime = new Date(objOptions.currentTime.getTime() - $("#timeline").width() / 16 * objOptions.scale);
        // let objRangeEndTime   = new Date(objOptions.currentTime.getTime() + $("#timeline").width() / 16 * objOptions.scale);

        $("#timeline").k2goTimeline(
        {
            startTime   : st_time,  // 左端の日時を1日前の日にちに設定
            endTime     : et_time,  // 右端の日時を現在時刻に設定
            currentTime : ct_time,  // 摘み（ポインタ）の日時を現在時刻に設定
            minTime     : new Date($Env.minTime    .getTime()),  // 過去方向への表示可能範囲を今年の1月1日に設定
            maxTime     : new Date($Env.maxTime.getTime()), // 未来方向への表示可能範囲を設定
            // rangeStartTime : objRangeStartTime,
            // rangeEndTime : objRangeEndTime,  
            timeChange  : function(pTimeInfo)
            {
                $("#date").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "%y-%mm-%dd %H:%M:%S.%N"));
                let $start   = { date : $("#start_time   input[type='date']"), time : $("#start_time   input[type='time']") };
                let $end     = { date : $("#end_time     input[type='date']"), time : $("#end_time     input[type='time']") };
                let $current = { date : $("#current_time2 input[type='date']"), time : $("#current_time2 input[type='time']") };

                $start  .date.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.  startTime, "%y-%mm-%dd"));
                $start  .time.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.  startTime, "%H:%M:%S"  ));

                $end    .date.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.    endTime, "%y-%mm-%dd"));
                $end    .time.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.    endTime, "%H:%M:%S"  ));

                $current.date.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "%y-%mm-%dd"));
                $current.time.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "%H:%M:%S"  ));

                isFuture(pTimeInfo, now);
 
                ViewChg( pTimeInfo.currentTime, view, menu );
                
                getParam(formatDate(pTimeInfo.currentTime, 'YYYYMMDDhhmm'), formatDate(pTimeInfo.startTime, 'YYYYMMDDhhmm'), formatDate(pTimeInfo.endTime, 'YYYYMMDDhhmm'), view, menu);
            
                //TODO: 3D棒グラフの時系列表示
                fnc.adjustCurrentTime();
                let $current_p = pTimeInfo.currentTime;
                if (formatDate($current_p, 'YYYY') != ct_yyyy && graph_config) {
                    ct_yyyy = formatDate($current_p, 'YYYY');
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_b, bargraphLayer_b, 2);
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_r, bargraphLayer_r, 3);
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_y, bargraphLayer_y, 4);
                }

                // TODO: 日進市のデータを現在時刻から10分前までのやつを表示する
                let currentYear    = formatDate(pTimeInfo.currentTime, 'YYYY');
                let currentMonth   = formatDate(pTimeInfo.currentTime, 'MM');
                let currentDate    = formatDate(pTimeInfo.currentTime, 'DD');
                let currentHours   = formatDate(pTimeInfo.currentTime, 'hh');
                let currentMinutes = formatDate(pTimeInfo.currentTime, 'mm');
                let currentSeconds = formatDate(pTimeInfo.currentTime, 'ss');

                let preTime = new Date((pTimeInfo.currentTime).getTime()-((pTimeInfo.endTime).getTime() - (pTimeInfo.startTime).getTime()) * 0.05);
                
                let preYear    = formatDate(preTime, 'YYYY');
                let preMonth   = formatDate(preTime, 'MM');
                let preDate    = formatDate(preTime, 'DD');
                let preHours   = formatDate(preTime, 'hh');
                let preMinutes = formatDate(preTime, 'mm');
                let preSeconds = formatDate(preTime, 'ss');
                
                time1 = Number(preYear + preMonth + preDate + preHours + preMinutes + preSeconds);
                time2 = Number(currentYear + currentMonth + currentDate + currentHours + currentMinutes + currentSeconds);
                
                addgeo_obj(itowns, view, time1, time2);
            },
            pickDoubleTap : function(pTimeInfo, pWhich)
            {
                // pTimeInfo.  startTimeから左端の日時を取得
                // pTimeInfo.    endTimeから右端の日時を取得
                // pTimeInfo.currentTimeから摘み（ポインタ）の日時を取得
                // pWhichの値は、1が左ボタン、-1が右ボタンをクリック
            },
            rangeChange : function(pTimeInfo)
            {
                // pTimeInfo.rangeStartTimeからレンジバーの左端の日時を取得
                // pTimeInfo.  rangeEndTimeからレンジバーの右端の日時を取得
                fnc.adjustCurrentTime();

                $("#range_start_time span").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.rangeStartTime, "%y-%mm-%dd %H:%M:%S"));
                $("#range_end_time   span").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.rangeEndTime  , "%y-%mm-%dd %H:%M:%S"));
        
            },
            railClick      : function(pTimeInfo) {
                //TODO: 3D棒グラフの時系列表示
                fnc.adjustCurrentTime();
                let $current_p = pTimeInfo.currentTime;
                updateAmedasBargraphLayer(view, menu, formatDate($current_p, 'YYYYMMDDhhmm'), amedas_graph_config);
                if (formatDate($current_p, 'YYYY') != ct_yyyy) {
                    ct_yyyy = formatDate($current_p, 'YYYY');
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_b, bargraphLayer_b, 2);
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_r, bargraphLayer_r, 3);
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_y, bargraphLayer_y, 4);
                }
            },
            pickTapHold    : function(pTimeInfo) {                      /*putEventInfo("pick tap hold"   );*/ },
            pickMoveStart  : function(pTimeInfo) {                      /*putEventInfo("pick move start" );*/ },
            pickMove       : function(pTimeInfo) {                      /*putEventInfo("pick move"       );*/ },
            pickMoveEnd    : function(pTimeInfo) {
                //TODO: 3D棒グラフの時系列表示
                fnc.adjustCurrentTime();
                let $current_p = pTimeInfo.currentTime;
                updateAmedasBargraphLayer(view, menu, formatDate($current_p, 'YYYYMMDDhhmm'), amedas_graph_config);
                if (formatDate($current_p, 'YYYY') != ct_yyyy && graph_config) {
                    ct_yyyy = formatDate($current_p, 'YYYY');
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_b, bargraphLayer_b, 2);
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_r, bargraphLayer_r, 3);
                    updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_y, bargraphLayer_y, 4);
                }
            }
        },
        function(pTimeInfo)
        {
            let objOptions        = $("#timeline").k2goTimeline("getOptions");
            let objRangeStartTime = new Date(objOptions.currentTime.getTime() - $("#timeline").width() / 16 * objOptions.scale);
            let objRangeEndTime   = new Date(objOptions.currentTime.getTime() + $("#timeline").width() / 16 * objOptions.scale);

            $("#timeline").k2goTimeline("setOptions", { rangeStartTime : objRangeStartTime, rangeEndTime : objRangeEndTime });

        });

        /*-----* pickadate *----------------------------------------------------------*/
        $("#date_box #cal").pickadate(
            {
                selectYears : true,
                clear       : false,
                onOpen      : function()
                {
                    let objOptions = $("timeline").k2goTimeline("getOptions");
            
                    this.set("min"   , new Date(objOptions.minTime    .getTime()    ));
                    this.set("max"   , new Date(objOptions.maxTime    .getTime() - 1));
                    this.set("select", new Date(objOptions.currentTime.getTime()    ));
                },
                onClose : function()
                {
                    let objOptions = $("timeline").k2goTimeline("getOptions");
                    let objDate    = new Date(this.get("select", "yyyy/mm/dd") + $("#timeline").k2goTimeline("formatDate", objOptions.currentTime, " %H:%M:%S"));
            
                    objDate.setMilliseconds(objOptions.currentTime.getMilliseconds());
            
                    if(objOptions.currentTime.getTime() != objDate.getTime())
                    {
                        let objTimeInfo = {};
                
                        objTimeInfo.minTime     = new Date(objOptions.minTime    .getTime());
                        objTimeInfo.maxTime     = new Date(objOptions.maxTime    .getTime());
                        objTimeInfo.startTime   = new Date(objOptions.minTime    .getTime() > objOptions.startTime.getTime() ? objOptions.minTime.getTime() : objOptions.startTime.getTime());
                        objTimeInfo.endTime     = new Date(objOptions.maxTime    .getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime.getTime() : objOptions.endTime  .getTime());
                        objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime());
                
                        let intDiff1 = objTimeInfo.currentTime.getTime() - objTimeInfo.startTime  .getTime();
                        let intDiff2 = objTimeInfo.endTime    .getTime() - objTimeInfo.currentTime.getTime();
                
                        objTimeInfo.currentTime.setTime(objDate.getTime());
                        objTimeInfo.startTime  .setTime(objDate.getTime() - intDiff1);
                        objTimeInfo.endTime    .setTime(objDate.getTime() + intDiff2);
                
                        if (objOptions.minTime.getTime() > objTimeInfo.startTime.getTime()) objTimeInfo.startTime.setTime(objOptions.minTime.getTime());
                        if (objOptions.maxTime.getTime() < objTimeInfo.endTime  .getTime()) objTimeInfo.endTime  .setTime(objOptions.maxTime.getTime());
                
                        $Env.creating = true;
                        $("#lockWindow").addClass("show");
                
                        $("#timeline").k2goTimeline("create",
                        {
                            timeInfo : objTimeInfo,
                            callback : function(pTimeInfo)
                            {
                                fnc.adjustRangeBar();
                                $Env.creating = false;
                                $("#lockWindow").removeClass("show");
                            }
                        });
                    }
                    // 閉じるときに地図にフォーカス
                    $("#viewerDiv").focus();
                }
            }
        );
        // zoom-rangeの連動
        setupZoomRange();

        // RangeBarの連動
        setupBtnRange();

        // 再生ボタ等の連動
        setupPlayButtons();
    });
}

// レイヤ描画のスライダー連動
function ViewChg( currentTime, view, menu ) {

    for(let i = 0; i < initialLayers.length; i++) {
        itowns.Fetcher.json(initialLayers[i].path).then(function _(config) {
            if(config.source.timeline) {
                let Lay = view.getLayerById(config.id);
                switch (config.source.type) {
                    // カラーレイヤ
                    case "color":
                        if(Lay !== undefined) {
                            let vis = Lay.visible;
                            let opa = Lay.opacity;
                            if(Lay) {
                                vis = Lay.visible;
                                opa = Lay.opacity;

                                view.removeLayer(config.id);
                                menu.removeLayersGUI(config.id);
                            }
                            addColorLayer(config.id, config.source.protocol, config.source, view, menu, config.source.timeline, currentTime);
                            view.getLayerById(config.id).visible = vis;
                            view.getLayerById(config.id).opacity = opa;
                        }
                        break;
                    default:
                        console.log(config.id + "は追加できませんでした。");
                        break;
                }
            }
        });
    }
}


export function toDate (str) {
    let arr = (str.substr(0, 4) + '/' + str.substr(4, 2) + '/' + str.substr(6, 2) + '/' + str.substr(8, 2) + '/' + str.substr(10, 2) + '/' + str.substr(12, 2)).split('/');
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5] );
};

// 未来チェック
function isFuture( pTimeInfo, now) {
    if(pTimeInfo.currentTime > now) {
        $("#date").css("color", "red");
    } else {
        $("#date").css("color", "#7da2cc;");
    };
}