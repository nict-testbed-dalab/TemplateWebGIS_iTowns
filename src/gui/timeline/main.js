import * as itowns from "itowns";
import * as fnc from "./fnc"
import { $Env } from "./env";

export function setupPlayButtons() {
    /*-----* initialize *---------------------------------------------------------*/
    $("#panel-conf" ).draggable({ containment: "content", scroll: false });

    $("#play-span"  ).attr("max",   $Env.playSpanTable.length );
    $("#play-span"  ).attr("value", $Env.playSpanTableDefault );
    $("#play-speed" ).attr("max",   $Env.playTable    .length );
    $("#play-speed" ).attr("value", $Env.playTableDefault     );

    setTimeout(function()
    {
        $("#play-span"  ).trigger("change");
        $("#play-speed" ).trigger("change");
    }, 100);
    /******************************************************************************/
    /* play_box.click                                                             */
    /******************************************************************************/
    $("#button_stop").on("click", function ()
    {
        $("#button_play"        ).removeClass("play_frame");
        $("#button_play_reverse").removeClass("play_frame_rev");
        clearTimeout($Env.timeoutIdFwd);
        clearTimeout($Env.timeoutIdBack);
        $("#form-title-play-speed-title").removeClass("fx");
        $("#cal"         ).removeClass("disable2");
        $("#time-btn"    ).removeClass("disable2");
        $("#slider"      ).removeClass("disable2");
        $("#button_range").removeClass("disable2");
        $("#timeline"    ).removeClass("disable2");
    });
    /*-----* button_play *--------------------------------------------------------*/
    $("#button_play").on("click", function()
    {
        $("#form-title-play-speed-title").removeClass("fx");
        setTimeout(function() { $("#form-title-play-speed-title").addClass("fx")}, 100);

        clearTimeout($Env.timeoutIdBack);

        $("#button_play_reverse").removeClass("play_frame_rev");
        $("#button_play"        ).addClass   ("play_frame");

        $("#cal"         ).addClass("disable2");
        $("#time-btn"    ).addClass("disable2");
        $("#slider"      ).addClass("disable2");
        $("#button_range").addClass("disable2");
        $("#timeline"    ).addClass("disable2");

        $Env.timeoutIdFwd = setTimeout(function _loop()
        {
            if (!$("#button_play").hasClass("play_frame")) return;

            let objOptions  = $("#timeline").k2goTimeline("getOptions");

            let abo = new Date(objOptions.maxTime.getTime());
            console.log(abo);

            if ($("#button_range").hasClass("active"))
            {
                if (objOptions.currentTime.getTime() < objOptions.rangeEndTime.getTime())
                {
                    $("#button_fwd").trigger("click", true);
                    $Env.timeoutIdFwd = setTimeout(_loop, $Env.playInterval * 1000);
                }
                else
                {
                    if ($("#button_loop").hasClass("active"))
                    {
                    $("#button_back_edge").trigger("click");
                    $Env.timeoutIdFwd = setTimeout(_loop, $Env.playInterval * 1000);
                    }
                    else
                    $("#button_stop").trigger("click");
                }
            }
            else
            {
                if (objOptions.endTime.getTime() < objOptions.maxTime.getTime())
                {
                    let abo = new Date(objOptions.maxTime.getTime());
                    console.log(abo);
                    let abc = new Date(objOptions.endTime.getTime());
                    console.log(abc);
                    $("#button_fwd").trigger("click", true);
                    $Env.timeoutIdFwd = setTimeout(_loop, $Env.playInterval * 1000);
                }
                else {
                    let abo = new Date(objOptions.maxTime.getTime());
                    console.log(abo);
                    let abc = new Date(objOptions.endTime.getTime());
                    console.log(abc);
                    $("#button_stop").trigger("click");
                }    
            }

        }, 1);
    });
    /*-----* button_play_rev *----------------------------------------------------*/
    $("#button_play_reverse").on("click", function()
    {
        $("#form-title-play-speed-title").removeClass("fx");
        setTimeout(function() { $("#form-title-play-speed-title").addClass("fx")}, 100);

        clearTimeout($Env.timeoutIdFwd);

        $("#button_play"        ).removeClass("play_frame");
        $("#button_play_reverse").   addClass("play_frame_rev");

        $("#cal"         ).addClass("disable2");
        $("#time-btn"    ).addClass("disable2");
        $("#slider"      ).addClass("disable2");
        $("#button_range").addClass("disable2");
        $("#timeline"    ).addClass("disable2");

        $Env.timeoutIdBack = setTimeout(function _loop()
        {
            if (!$("#button_play_reverse").hasClass("play_frame_rev")) return;

            let objOptions  = $("#timeline").k2goTimeline("getOptions");

            if ($("#button_range").hasClass("active"))
            {
                if (objOptions.currentTime.getTime() > objOptions.rangeStartTime.getTime())
                {
                    $("#button_back").trigger("click", true);
                    $Env.timeoutIdBack = setTimeout(_loop, $Env.playInterval * 1000);
                }
                else
                {
                    if ($("#button_loop").hasClass("active"))
                    {
                        $("#button_fwd_edge").trigger("click");
                        $Env.timeoutIdBack = setTimeout(_loop, $Env.playInterval * 1000);
                    }
                    else $("#button_stop").trigger("click");
                }
            }
            else
            {
                if (objOptions.startTime.getTime() > objOptions.minTime.getTime())
                {
                    $("#button_back").trigger("click", true);
                    $Env.timeoutIdBack = setTimeout(_loop, $Env.playInterval * 1000);
                }
                else $("#button_stop").trigger("click");
            }
        }, 1);
    });
    /*-----* button_fwd (Frame Play) *-------------------------------------------*/
    $("#button_fwd").on("click", function(pEvent, pExtra)
    {
        if (!pExtra)
        {
            $("#form-title-play-span-title").addClass("fx");
            setTimeout(function() { $("#form-title-play-span-title").removeClass("fx")}, 400);
        }

        let objOptions  = $("#timeline").k2goTimeline("getOptions");
        let objTimeInfo = {};

        objTimeInfo.minTime = new Date(objOptions.minTime.getTime());
        objTimeInfo.maxTime = new Date(objOptions.maxTime.getTime());
    
        if ($("#button_range").hasClass("active"))
        {
            objTimeInfo.startTime   = new Date(objOptions.startTime  .getTime());
            objTimeInfo.endTime     = new Date(objOptions.endTime    .getTime());
            objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime() + $Env.frameInterval);

            if (objOptions.rangeEndTime.getTime() < objTimeInfo.currentTime.getTime()) objTimeInfo.currentTime = new Date(objOptions.rangeEndTime.getTime());
        }
        else
        {
            objTimeInfo.startTime   = new Date(objOptions.startTime  .getTime() + $Env.frameInterval);
            objTimeInfo.endTime     = new Date(objOptions.endTime    .getTime() + $Env.frameInterval);
            objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime() + $Env.frameInterval);

            let intDiff1 = objTimeInfo.endTime.getTime() - objTimeInfo.  startTime.getTime();
            let intDiff2 = objTimeInfo.endTime.getTime() - objTimeInfo.currentTime.getTime();

            if (objOptions.maxTime.getTime() < objTimeInfo.endTime.getTime())
            {
                objTimeInfo.endTime     = new Date(objOptions.maxTime.getTime());
                objTimeInfo.startTime   = new Date(objOptions.endTime.getTime() - intDiff1);
                objTimeInfo.currentTime = new Date(objOptions.endTime.getTime() - intDiff2);
            }
        }

        $("#timeline").k2goTimeline("create", { timeInfo : objTimeInfo });
    });
    /*-----* button_Fwd_Edge (to Edge) *--------------------------------------------*/
    $("#button_fwd_edge").on("click", function()
    {
        let objOptions  = $("#timeline").k2goTimeline("getOptions");
        let objTimeInfo = {};

        objTimeInfo.startTime = new Date(objOptions.startTime.getTime());
        objTimeInfo.  endTime = new Date(objOptions.endTime.  getTime());
        objTimeInfo.  minTime = new Date(objOptions.minTime.  getTime());
        objTimeInfo.  maxTime = new Date(objOptions.maxTime.  getTime());

        if ($("#button_range").hasClass("active")) objTimeInfo.currentTime = new Date(objOptions.rangeEndTime.getTime());
        else                                       objTimeInfo.currentTime = new Date(objOptions.     endTime.getTime());

        $("#timeline").k2goTimeline("create", { timeInfo : objTimeInfo });
    });
    /*-----* button_back (Frame Play) *------------------------------------------*/
    $("#button_back").on("click", function(pEvent, pExtra)
    {
        if (!pExtra)
        {
            $("#form-title-play-span-title").addClass("fx");
            setTimeout(function() { $("#form-title-play-span-title").removeClass("fx")}, 400);
        }

        let objOptions  = $("#timeline").k2goTimeline("getOptions");
        let objTimeInfo = {};

        objTimeInfo.minTime = new Date(objOptions.minTime.getTime());
        objTimeInfo.maxTime = new Date(objOptions.maxTime.getTime());
    
        if ($("#button_range").hasClass("active"))
        {
            objTimeInfo.startTime   = new Date(objOptions.startTime  .getTime());
            objTimeInfo.endTime     = new Date(objOptions.endTime    .getTime());
            objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime() - $Env.frameInterval);

            if (objOptions.rangeStartTime.getTime() > objTimeInfo.currentTime.getTime()) objTimeInfo.currentTime = new Date(objOptions.rangeStartTime.getTime());
        }
        else
        {
            objTimeInfo.startTime   = new Date(objOptions.startTime  .getTime() - $Env.frameInterval);
            objTimeInfo.endTime     = new Date(objOptions.endTime    .getTime() - $Env.frameInterval);
            objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime() - $Env.frameInterval);

            let intDiff1 = objTimeInfo.endTime.    getTime() - objTimeInfo.startTime.getTime();
            let intDiff2 = objTimeInfo.currentTime.getTime() - objTimeInfo.startTime.getTime()

            if (objOptions.minTime.getTime() > objTimeInfo.startTime.getTime())
            {
            objTimeInfo.startTime   = new Date(objOptions.minTime.getTime());
            objTimeInfo.endTime     = new Date(objOptions.startTime.getTime() + intDiff1);
            objTimeInfo.currentTime = new Date(objOptions.startTime.getTime() + intDiff2);
            }
        }

        $("#timeline").k2goTimeline("create", { timeInfo : objTimeInfo });
    });
    /*-----* button_back_Edge (to Edge) *----------------------------------------*/
    $("#button_back_edge").on("click", function()
    {
        let objOptions  = $("#timeline").k2goTimeline("getOptions");
        let objTimeInfo = {};

        objTimeInfo.startTime = new Date(objOptions.startTime.getTime());
        objTimeInfo.  endTime = new Date(objOptions.endTime.  getTime());
        objTimeInfo.  minTime = new Date(objOptions.minTime.  getTime());
        objTimeInfo.  maxTime = new Date(objOptions.maxTime.  getTime());

        if ($("#button_range").hasClass("active")) objTimeInfo.currentTime = new Date(objOptions.rangeStartTime.getTime());
        else                                       objTimeInfo.currentTime = new Date(objOptions.     startTime.getTime());

        $("#timeline").k2goTimeline("create", { timeInfo : objTimeInfo });
    });
    /*-----* loop *---------------------------------------------------------------*/
    $("#button_loop").on("click", function()
    {
        $("#button_loop").toggleClass("active");
    });
    /******************************************************************************/
    /* panel-conf                                                                 */
    /******************************************************************************/
    /*-----* play-speed *---------------------------------------------------------*/
    $("#play-speed").on("input change", function() 
    {
        $("#display1").html($Env.playTable[$(this).val() - 1] + " Sec");
        $Env.playInterval = $Env.playTable[Math.round($(this).val()) - 1];
    });
    /*-----* play-span *----------------------------------------------------------*/
    $("#play-span").on("input change", function()
    {
        $("#display2").html(fnc.makeTime(Math.floor($Env.playSpanTable[Math.round($(this).val()) - 1])));
        $Env.frameInterval = $Env.playSpanTable[Math.round($(this).val()) - 1];
    });
    /*-----* panel-conf action *-------------------------------------------------*/
    $("#button_conf").on("click", function()
    {
        if ($("#button_conf").hasClass("active"))
        {
            $("#button_conf").removeClass("active")
            $("#panel-conf" ).removeClass("active");
        }
        else
        {
            $("#button_conf").addClass("active")
            $("#panel-conf" ).addClass("active");
        }
    });

    $("#panel-conf-close").on("click", function()
    {
        $("#panel-conf ").removeClass("active");
        $("#button_conf").removeClass("active");
    });
}


/******************************************************************************/
/* zoom-range event                                                           */
/******************************************************************************/
/*-----* zoom-range.input *---------------------------------------------------*/
export function setupZoomRange() {
    $("#zoom-range").on("input", function()
    {
        fnc.changeZoomLevel();
    
        if (!$Env.creating)
        {
            
            let intValue = parseInt($(this).val(), 10);

            if (intValue != fnc.getZoomLevel())
            {
                $Env.creating = true;

                let objOptions         = $("#timeline").k2goTimeline("getOptions");
                let objZoomInfo        = $Env.zoomTable[intValue];
                let objOffsetPixelInfo = {}; // ピクセルサイズを格納
                let objTimeInfo        = {}; // Date オブジェクト格納
                let intPixelSize;
                
                objOffsetPixelInfo.startTime   = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.minTime.getTime() > objOptions.startTime.getTime() ? objOptions.minTime : objOptions.startTime);
                objOffsetPixelInfo.endTime     = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.maxTime.getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime : objOptions.endTime  );
                objOffsetPixelInfo.currentTime = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.currentTime);
                
                intPixelSize = objZoomInfo.value / (objOffsetPixelInfo.endTime - objOffsetPixelInfo.startTime);

                objTimeInfo.minTime      = new Date(objOptions.minTime    .getTime());
                objTimeInfo.maxTime      = new Date(objOptions.maxTime    .getTime());
                objTimeInfo.currentTime  = new Date(objOptions.currentTime.getTime());
                objTimeInfo.startTime    = new Date(objOptions.currentTime.getTime() - intPixelSize * (objOffsetPixelInfo.currentTime - objOffsetPixelInfo.startTime  ));
                objTimeInfo.endTime      = new Date(objOptions.currentTime.getTime() + intPixelSize * (objOffsetPixelInfo.endTime     - objOffsetPixelInfo.currentTime));
            
                if( objTimeInfo.startTime.getTime() < objTimeInfo.minTime.getTime() ) objTimeInfo.startTime.setTime(objTimeInfo.minTime.getTime()) ;
                if( objTimeInfo.endTime  .getTime() > objTimeInfo.maxTime.getTime() ) objTimeInfo.endTime  .setTime(objTimeInfo.maxTime.getTime()) ;

                $("#timeline").k2goTimeline("create",
                {
                    timeInfo : objTimeInfo,
                    callback : function(pTimeInfo)
                    {
                        $Env.creating = false;
                        $("#zoom-range").trigger("input");
                    }
                });
            }
        }
    });
    /*-----* zoom-range.change *--------------------------------------------------*/
    $("#zoom-range").on("change", function()
    {
        fnc.adjustRangeBar();
    });
    /*-----* plus or minus.click *------------------------------------------------*/
    $("#slider").on("click", "> a", function()
    {
        let intValue = parseInt($("#zoom-range").val(), 10);

        if ($(this).attr("id") == "button_minus") intValue --; 
        else                                      intValue ++;                  

        $("#zoom-range").val(intValue);
        $("#zoom-range").trigger("input" );
        $("#zoom-range").trigger("change");
    });
}

/******************************************************************************/
/* button_range.click                                                         */
/******************************************************************************/
export function setupBtnRange() {
    $("#button_range").on("click", function()
    {
        $(this).toggleClass("active");

        if ($(this).hasClass("active"))
        {
            $(".k2go-timeline-rail"    ).css     ({ pointerEvents : "none"   });
            $(".k2go-timeline-rail > *").css     ({ pointerEvents : "auto"   });
            $("#button_loop"           ).css     ({ visibility    : "visible"}); 
            $("#cal"                   ).addClass("disable1");
            $("#current_time"          ).addClass("disable1");
            //$(".k2go-timeline-range"   ).addClass("k2go-timeline-range-show");
            //$(".k2go-timeline-rail > *").css     ({ right: "0" }); 
            //$(".k2go-timeline-rail > *").css     ({ width: "192px" }); 

            if (fnc.checkRangeBar())
            {
                $("#timeline").k2goTimeline("showRangeBar");
            }
            else
            {
                let objOptions        = $("#timeline").k2goTimeline("getOptions");
                let objStartTime      = new Date(objOptions .minTime   .getTime() > objOptions.startTime.getTime() ? objOptions.minTime.getTime() : objOptions.startTime.getTime());
                let objEndTime        = new Date(objOptions .maxTime   .getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime.getTime() : objOptions.endTime  .getTime());
                let objRangeStartTime = new Date(objOptions.currentTime.getTime() - $("#timeline").width() / 16 * objOptions.scale);
                let objRangeEndTime   = new Date(objOptions.currentTime.getTime() + $("#timeline").width() / 16 * objOptions.scale);

                //両端の限界を作成
                if (objRangeStartTime.getTime() < objStartTime.getTime())
                {
                    objRangeStartTime = new Date(objStartTime.getTime());
                    objRangeEndTime   = new Date(objStartTime.getTime() + $("#timeline").width() / 8 * objOptions.scale);
                }

                if (objRangeEndTime.getTime() > objEndTime.getTime())
                {
                    objRangeEndTime   = new Date(objEndTime.getTime());
                    objRangeStartTime = new Date(objEndTime.getTime() - $("#timeline").width() / 8 * objOptions.scale);
                }

                $("#timeline").k2goTimeline("showRangeBar", { rangeStartTime : objRangeStartTime, rangeEndTime : objRangeEndTime });
                objOptions    .rangeChange (                { rangeStartTime : objRangeStartTime, rangeEndTime : objRangeEndTime });
            }
        }
        else
        {
            $("#timeline"              ).k2goTimeline("hiddenRangeBar");
            $("#timeline"              ).k2goTimeline("setOptions", { disableZoom : false });
            $(".k2go-timeline-rail"    ).css         ({ pointerEvents  : "" });
            $(".k2go-timeline-rail > *").css         ({ pointerEvents  : "" });
            $("#button_loop"           ).css         ({ visibility: "hidden"}); 
            $("#button_loop"           ).removeClass ("active"); 
            $("#cal"                   ).removeClass ("disable1");
            $("#current_time"          ).removeClass ("disable1");
            $(".k2go-timeline-range"          ).removeClass("k2go-timeline-range-show");

            $Env.loop = false;
        }
    });
}

/******************************************************************************/
/* current_time.click                                                         */
/******************************************************************************/
$("#current_time").on("click", function()
{
    let $this = $(this);
    /*-----* time current *-------------------------------------------------------*/
    if($this.hasClass("timeCurrent"))
    {
        let objTimeInfo = {};

        objTimeInfo.minTime     = new Date($Env.minTime    .getTime());
        objTimeInfo.maxTime     = new Date($Env.maxTime.getTime());
        objTimeInfo.startTime   = new Date($Env.startTime  .getTime());
        objTimeInfo.endTime     = new Date($Env.endTime.getTime());
        objTimeInfo.currentTime = new Date($Env.currentTime.getTime());

        // let intDiff1 = objTimeInfo.currentTime.getTime() - objTimeInfo.startTime  .getTime();
        // let intDiff2 = objTimeInfo.endTime    .getTime() - objTimeInfo.currentTime.getTime();

        objTimeInfo.currentTime.setTime(Date.now());
        // objTimeInfo.startTime  .setTime(objTimeInfo.currentTime.getTime() - intDiff1);
        // objTimeInfo.endTime    .setTime(objTimeInfo.currentTime.getTime() + intDiff2);
        // objTimeInfo.maxTime    .setTime(objTimeInfo.currentTime.getTime() + intDiff2);

        console.log(objTimeInfo);

        // if (objOptions.minTime.getTime() > objTimeInfo.startTime.getTime()) objTimeInfo.startTime.setTime(objOptions.minTime.getTime());
        // if (objOptions.maxTime.getTime() < objTimeInfo.endTime  .getTime()) objTimeInfo.endTime  .setTime(objOptions.maxTime.getTime());

        $Env.creating = true;
        $("#lockWindow").addClass("show");

        $("#timeline").k2goTimeline("create",
        {
            timeInfo : objTimeInfo,
            callback : function(pTimeInfo)
            {
                $this.data("removeTimeNow", setTimeout(function()
                {
                    $this.removeClass("timeNow"    );
                    $this.addClass   ("timeCurrent");
                }, 5000));
            
                $this.addClass   ("timeNow"    );
                $this.removeClass("timeCurrent");

                $Env.creating = false;
                fnc.adjustRangeBar();
                fnc.putEventInfo("change time now");
                $("#lockWindow").removeClass("show");
            }
        });
    }
    /*-----* time now *-----------------------------------------------------------*/
    else if ($this.hasClass("timeNow"))
    {
        clearTimeout($("#current_time").data("removeTimeNow"));
    
        $this.addClass   ("timeNowPlay");
        $this.removeClass("timeNow"    );

        $("#cal"         ).addClass("disable2");
        $("#play_box"    ).addClass("disable2");
        $("#slider"      ).addClass("disable2");
        $("#button_range").addClass("disable2");
        
        $Env.starting = true;

        $("#timeline").k2goTimeline("start",
        {
            fps      : 10,
            realTime : true,
            stop     : function()
            {
                $("#cal"         ).removeClass("disable2"   );
                $("#play_box"    ).removeClass("disable2"   );
                $("#slider"      ).removeClass("disable2"   );
                $("#button_range").removeClass("disable2"   );
                $("#lockWindow"  ).removeClass("show"       );
                $this             .addClass   ("timeCurrent");
                $this             .removeClass("timeNowPlay");
                $this             .trigger    ("click"      );
                fnc.adjustRangeBar();
                $Env.starting = false;
            }
        });
    }
    /*-----* time now play *------------------------------------------------------*/
    else
    {
        $("#lockWindow").addClass    ("show");
        $("#timeline"  ).k2goTimeline("stop");
    }
});

/******************************************************************************/
/* play_box.click                                                             */
/******************************************************************************/
// $("#play_box").on("click", "a", function()
// {
//     let $this       = $(this);
//     let flgStarting = $Env.starting;
//     let intSpeed    = $Env.speed;

//     $("#lockWindow").addClass    ("show");
//     $("#timeline"  ).k2goTimeline("stop");

//     setTimeout(function _sleep()
//     {
//         if ($Env.starting)
//         {
//             setTimeout(_sleep, 10);
//             return;
//         }

//         $Env.speed = intSpeed;
//     /*-----* play *-----------------------------------------------------*/
//         if ($this.attr("id") == "button_play")
//         { 
//             if($('#play-mode-normal').hasClass('active')) {
            
//                 $Env.speed = $Env.playTable[ $('#play-speed2').val() - 1 ];

//                 // fnc.startTimeline();
//                 $("#lockWindow").removeClass("show");
//                 console.log('通常再生中');
//             } else {
//                 $("#button_play_reverse").removeClass("play_frame_rev");
//                 clearTimeout($Env.timeoutIdBack);
//                 $('#button_play').addClass('play_frame');
//                 // fnc.framePlayFwd();
//                 console.log('コマ再生中');
//             }
//         }
//     /*-----* reverse *-----------------------------------------------------*/
//         else if ($this.attr("id") == "button_play_reverse") {
//             if($('#play-mode-span').hasClass('active')) {
//                 clearTimeout($Env.timeoutIdFwd);
//                 $("#button_play").removeClass("play_frame");
//                 $("#button_play_reverse").addClass("play_frame_rev");
//                 // fnc.framePlayBack();
//                 console.log('逆コマ再生中');
//             }
//         }
//     /*-----* stop *---------------------------------------------------------------*/
//         else if ($this.attr("id") == "button_stop")
//         {
//             $Env.speed = 0;
//             $("#lockWindow").removeClass("show");
//         }
//     /*-----* loop *---------------------------------------------------------------*/
//         // else if ($this.attr("id") == "button_loop")
//         // {
//         //     $this.toggleClass("active");
//         //     $Env.loop = $this.hasClass("active");
//         //     // if (flgStarting) fnc.startTimeline();
//         //     $("#lockWindow").removeClass("show");
//         // }
//     /*-----* fwd or back *--------------------------------------------------------*/
//         else
//         {
//             $Env.creating = true;

//             let objOptions  = $("#timeline").k2goTimeline("getOptions");
//             let objTimeInfo = {};
//             let objEdgeStartTime;
//             let objEdgeEndTime;
//             let intDiff;

//             objTimeInfo.minTime     = new Date(objOptions.minTime    .getTime());
//             objTimeInfo.maxTime     = new Date(objOptions.maxTime    .getTime());
//             objTimeInfo.startTime   = new Date(objOptions.minTime    .getTime() > objOptions.startTime.getTime() ? objOptions.minTime.getTime() : objOptions.startTime.getTime());
//             objTimeInfo.endTime     = new Date(objOptions.maxTime    .getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime.getTime() : objOptions.endTime  .getTime());
//             objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime());

//             if ($("#button_range").hasClass("active"))
//             {
//                 objEdgeStartTime = new Date(objOptions.rangeStartTime.getTime());
//                 objEdgeEndTime   = new Date(objOptions.rangeEndTime  .getTime());
//             }
//             else
//             {
//                 objEdgeStartTime = new Date(objTimeInfo.startTime.getTime());
//                 objEdgeEndTime   = new Date(objTimeInfo.endTime  .getTime());
//             }

//             intDiff = (objEdgeEndTime.getTime() - objEdgeStartTime.getTime()) * 0.01;

//             if ($this.attr("id") == "button_back_edge")
//             {
//                 objTimeInfo.currentTime.setTime(objEdgeStartTime.getTime());
//             }
//             else if ($this.attr("id") == "button_fwd_edge")
//             {
//                 objTimeInfo.currentTime.setTime(objEdgeEndTime.getTime());
//             }
//             else if ($this.attr("id") == "button_back")
//             {
//                                                                                     objTimeInfo.currentTime.setTime(objTimeInfo.currentTime.getTime() - intDiff);
//                 if (objTimeInfo.currentTime.getTime() < objEdgeStartTime.getTime()) objTimeInfo.currentTime.setTime(objEdgeStartTime       .getTime()          );
//             }
//             else if ($this.attr("id") == "button_fwd")
//             {
//                                                                                 objTimeInfo.currentTime.setTime(objTimeInfo.currentTime.getTime() + intDiff);
//                 if (objTimeInfo.currentTime.getTime() > objEdgeEndTime.getTime()) objTimeInfo.currentTime.setTime(objEdgeEndTime         .getTime()          );
//             }

//             $("#timeline").k2goTimeline("create",
//             {
//                 timeInfo : objTimeInfo,
//                 callback : function(pTimeInfo)
//                 {
//                     // if (flgStarting) fnc.startTimeline();
//                     $Env.creating = false;
//                     $("#lockWindow").removeClass("show");
//                 }
//             });
//         }
//     }, 1);
// });

/******************************************************************************/
/* view_url event                                                             */
/******************************************************************************/
/*-----* input_group_button.click *--------------------------------------------*/
$(".input_group_button").on("click", function()
{
  $("#view_url_input").select();
  document.execCommand("Copy");
});
/*-----* view_url_box_close.click *-------------------------------------------*/
$(".view_url_box_close").on("click", function()
{
  $("#view_url").css("display" , "none");
});

/******************************************************************************/
/* window.resize                                                              */
/******************************************************************************/
$(window).on("resize", function()
{
  if (typeof $(window).data("resize") == "number")
  {
    clearTimeout($(window).data("resize"));
    $(window).removeData("resize");
  }

  $(window).data("resize", setTimeout(function()
  {
    fnc.adjustRangeBar();

    $("#timeline").k2goTimeline("setOptions", { maxScale : $Env.zoomTable[0].value / $("#timeline").width(), minScale : $Env.zoomTable[$Env.zoomTable.length - 1].value / $("#timeline").width() });

    fnc.putEventInfo("resize");
    $(window).removeData("resize");
  }, 300));
});
/******************************************************************************/
/* document.mousemove                                                         */
/******************************************************************************/
$(document).on("mousemove", function(pEvent)
{
  let $rangeBar = $(".k2go-timeline-range-show");

  if ($rangeBar.length > 0)
  {
    let intLeft  = $rangeBar.offset().left;
    let intRight = $rangeBar.width () + intLeft;

    $("#timeline").k2goTimeline("setOptions", { disableZoom : !(intLeft <= pEvent.pageX && pEvent.pageX <= intRight) });
  }
});

