import * as itowns from "itowns";
import {mf_movePotision} from "../layer/geojson";

// ボタンの欄にも開閉機能を追加しました
export function setupButtonsPanels(view) {
    $("#open_movelink").click(function(){
        console.log("Now click open_button");
        $("#movelink_div").slideToggle(1, function() {
            let status = ($("#movelink_div").is(':hidden'));
            console.log("Current movelink_div = " + status);
            if (status) {
                $('.navbar').css('display', 'none');
                $('#movelink').css('width', '70px');
            
            } else {
                $('#movelink').css('height', 'auto');
                $('#movelink').css('width', 'min-content');
                $('.navbar').css('display', 'flex');
            }
            if($("#open_movelink").children('i').is('.fa-minus')){
                $("#open_movelink").children('i').removeClass();
                $("#open_movelink").children('i').addClass('fa fa-plus fa-lg');
            } else {
                $("#open_movelink").children('i').removeClass();
                $("#open_movelink").children('i').addClass('fa fa-minus fa-lg');
            }
        });
    });

    setupButtons(view);
}

/* ■移動 */
function setupButtons(view) {
    // 画面キャプチャ
    document.getElementById("button_single_capture").onclick = function() {setupSingleCapture();};

    // 連続画面キャプチャ
    document.getElementById("button_multi_capture").onclick = function() {setupMultiCapture();};    

    // データ取得(日進市)
    document.getElementById("get_nisin").onclick = function() {

        $("#prepro_db_data_type").val("");
        $("#prepro_db_data_type").val("layer_garbagetruck");

        $('select#col_name option').remove();
        let options = '<option value="speed">速度</option><option value="pm25">PM2.5</option>';
        $("#col_name").append(options);

        $("#prepro_controller").removeClass("hidden");
        mf_movePotision(view, "EPSG:4326", "137.04070772112493,35.124126658165906", 30.493333333333332, 0);
    };

    // データ取得(アメダス)
    document.getElementById("get_amedas").onclick = function() {

        $("#prepro_db_data_type").val("");
        $("#prepro_db_data_type").val("layer_amedas");

        $('select#col_name option').remove();
        let options = '<option value="precipitation24h">24時間降雨量</option><option value="temp">気温</option><option value="snow">積雪深</option>';
        $("#col_name").append(options);

        $("#prepro_controller").removeClass("hidden");
    };
}

//画面キャプチャ
function setupSingleCapture() {
    let fileName = $("#timeline").k2goTimeline("formatDate", $("#timeline").k2goTimeline("getOptions").currentTime, "%y%mm%dd%H%M%S.jpg")
    singleCapture(fileName);
    console.log(itowns);
}

//連続画面キャプチャ
function setupMultiCapture() {
    $("#button_multi_capture").toggleClass("highlight");
    $("#button_multi_capture").toggleClass("active");
    let timeOpt = $("#timeline").k2goTimeline("getOptions");
    console.log(new Date(timeOpt.currentTime.getTime() + 120 * 60 * 1000));
    multiCapture(timeOpt.currentTime, timeOpt.currentTime, new Date(timeOpt.currentTime.getTime() + 120 * 60 * 1000), 10 * 60 * 1000,
        function(){
            return $("#button_multi_capture").hasClass("active");
        },
        function(cTime){
            console.log(cTime);
            let timelineObj = $("#timeline").k2goTimeline("getOptions");
            $("#timeline").k2goTimeline("create", {
                timeInfo : {
                    currentTime : cTime,
                    startTime : timelineObj.startTime,
                    endTime : timelineObj.endTime,
                    minTime : timelineObj.minTime,
                    maxTime : timelineObj.maxTime,
                }
            });
        },
        function(cTime){
            return $("#timeline").k2goTimeline("formatDate", cTime, "%y%mm%dd%H%M%S.jpg");
        },
        function(pResult){
            if (!pResult.status) {
                // キャンセルの時とエラーの時の処理を分ける
                $("#button_multi_capture").removeClass("highlight");
                $("#button_multi_capture").removeClass("active");
                alert("キャンセルしました。");
                return false;
            }
            return true;
        }
    );
}