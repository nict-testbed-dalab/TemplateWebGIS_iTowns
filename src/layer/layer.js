import * as itowns from "itowns";

import { layerGuide } from "../legend/legend";

import { CreateBargraphLayer } from "../3dBarGraph/3dBarGraph";
import { $3DBargraph_Env, point_1, point_2, point_3, point_4 } from "../3dBarGraph/3dBargraph_env";

import { $Env } from "../gui/timeline/env";

let date = new Date();

let inurl = new URL(location).toString();
let inparam = $.nictSTARSViewURL.parseURL(inurl);
let layerIds;
let layerIdsNames = [];
let layerIdsOpacity = [];

// 存在する年月日を取得
var jinryu_exist_date = "";

// 削除したレイヤの一覧を入れる配列
let deleteLayerList = [];

if(inparam["layerIds"] != null && inparam["layerIds"] != ""){
    // decodeURI
    // atmosphereが配列の最初に入ってくる
    layerIds = decodeURI(inparam["layerIds"]).split(',');
    layerIds.shift();
    layerIds.filter( function( value ) {
        layerIdsNames.push(value.split(":")[0]);
        layerIdsOpacity.push(value.split(":")[1]);
    });
}

// 削除したレイヤの一覧
if(inparam["deleteLayers"] != null && inparam["deleteLayers"] != ""){
    deleteLayerList = decodeURI(inparam["deleteLayers"]).split(',');
}

// 初期レイヤーメニューの設定
function initLayerCheck(layer) {
    if (deleteLayerList.includes(layer)) {
        return true;
    } else  {
        return false;
    }
}

export function initLayer(config, globeView, appMenu) {
    async function jinryu_exist(path_get_date) {
        try{
            const response = await fetch(path_get_date);
            if (response.ok) {
            const res =  await response.json();
            jinryu_exist_date = ""
            Object.keys(res).forEach(function(date){
                jinryu_exist_date += date.substring(0,4) + "年" 
                    + date.substring(4,6) + "月" + date.substring(6,8) + "日 ：" 
                    + res[date] + "<BR>"
            });
            } else {
            console.log("HTTP-Error: " + response.status);
            }
        } catch(err) {
            console.log(err);
        }
    }

    if(jinryu_exist_date == ""){
        var path_get_date = "https://tb-gis-web.jgn-x.jp/api/t_people_exist_date";
        jinryu_exist(path_get_date);
    
    }

    // タイムラインの現在時刻を取得する
    setTimeout(() => {
        let currentDate = date;
        let objOptions = $("#timeline").k2goTimeline("getOptions");
        currentDate = objOptions.currentTime;

        switch (config.source.type) {
            // カラーレイヤ
            case "color":
                if(!initLayerCheck(config.id)) {
                    addColorLayer(config.id, config.source.protocol, config.source, globeView, appMenu, config.source.timeline, currentDate, config.coord, config.options);
                    let defaultview = config.source.view;
                    let defaultOpacity;
                    
                    if (config.source.opacity) {
                        defaultOpacity = config.source.opacity;
                    } else {
                        defaultOpacity = 1;
                    }
                    
                    for (let num = 0; num < layerIdsNames.length; num++) {    
                        if(config.id === layerIdsNames[num]) {
                            defaultview = true;
                            defaultOpacity = Math.floor(layerIdsOpacity[num] * 10) / 10;
                            break;
                        }
                    }
                    globeView.getLayerById(config.id).visible = defaultview;
                    globeView.getLayerById(config.id).opacity = defaultOpacity;

                    if(config.id === "面群データ") {
                        changeTimeTable(9, config.timeslider, config.rangebar);
                    } else if(config.id === "人流(GPS)") {
                        changeTimeTable(6, config.timeslider, config.rangebar);
                    }
                }
                break;
            
            // エレベーションレイヤ
            case "elevation":
                addElevationLayer(config.id, config.source, globeView, appMenu);
                break;

            //TODO: 3D棒グラフの表示
            case "demographics":
                if (Object.keys(config.coord).length) {
                    movePotision(globeView, config.coord.crs, config.coord.longitude, config.coord.latitude, config.coord.altitude, config.options.tilt, config.options.heading, config.options.range, config.options.time, config.options.stopPlaceOnGroundAtEnd, 2);
                }
                
                setup3DBargraphLayer(config, globeView, appMenu);

                if (Object.keys(config.timeslider).length) {
                    changeTimeTable(config.zoomRange, config.timeslider, config.rangebar);
                }

                break;

            // TODO: shpファイルを読み込む
            // shpファイル
            case "shp":
                console.log("shpファイル読み込み開始");

                itowns.Fetcher.multiple(
                    config.source.url,
                    {
                        // fetch all files whose name match the `url` parameter value, and whose format is either `shp`,
                        // `dbf`, `shx` or `prj`.
                        arrayBuffer: ['shp', 'dbf', 'shx'],
                        text: ['prj'],
                    },
                ).then((fetched) => {
                    // Once our Shapefile data is fetched, we can parse it by running itowns built-in Shapefile parser.
                    return itowns.ShapefileParser.parse(fetched, {
                        // Options indicating how the features should be built from data.
                        out: {
                            // Specitfy the crs to convert the input coordinates to.
                            crs: globeView.tileLayer.extent.crs,
                        },
                    });
                }).then((parsed) => {
                    // We can then instantiate a FileSource, passing the parsed data,
                    // and create a Layer bound to this source.
                    const shpSource = new itowns.FileSource({ features: parsed });

                    const colorLayer = new itowns.ColorLayer(config.id, {
                        source: shpSource,
                        style: new itowns.Style({
                            zoom: { min: 2, max: 18 },
                            stroke: {
                                color: "red",
                                width: 3
                            },
                            point: {
                                color: "white",
                                line: "black",
                                radius: 5
                            },
                            text: {
                                field: '{NAME}',
                                size: 14,
                                haloColor: 'white',
                                haloWidth: 1,
                                font: ['monospace'],
                                anchor: "bottom"
                            }
                        }),
                        addLabelLayer: true,
                    });

                    globeView.addLayer(colorLayer).then(appMenu.addLayerGUI.bind(appMenu));
                });
                break;

            default:
                console.log(config.id + "は追加できませんでした。");
                break;
        }
    }, 500);
}

// 初期レイヤの追加関数
export function addInitialLayers(globeView, appMenu, initialLayers, baseUrl) {
    for(let i = 0; i < initialLayers.length; i++) {
        itowns.Fetcher.json(initialLayers[i].path).then(function _(config) {
            //TODO: JSON内のパスが相対パスのものを絶対パスに変換する
            changePath(config, "url");
            changePath(config, "style");

            if(initialLayers[i].addToView === false) {
                addCandidateLayer(config, appMenu, globeView);
            } else {
                initLayer(config, globeView, appMenu);
            }
        });
    }
}

// カラーレイヤの追加関数
export function addColorLayer(layer_name, fileProtocol, fileSorce, globeView, appMenu, fileTimeline, currentTime=date, fileCoord, fileOptions) {
    let sSource;
    let colorLayer;
    let local_file;

    local_file = JSON.stringify(fileSorce); // JSON文字列化
    local_file = JSON.parse(local_file); // JSON文字列化したものを戻す

    // 時系列データの連動
    if (fileTimeline) {

        if(layer_name === "面群データ" || layer_name === "人流(GPS)") {
            local_file.url = local_file.url.replace("[YYYY]", formatDate(currentTime, 'YYYY'));
            local_file.url = local_file.url.replace("[MM]", formatDate(currentTime, 'MM'));
            local_file.url = local_file.url.replace("[DD]", formatDate(currentTime, 'DD'));
            local_file.url = local_file.url.replace("[hh]", formatDate(currentTime, 'hh'));
            local_file.url = local_file.url.replace("[mm]", formatDate(currentTime, 'mm').slice(0,-1)+'0');
        } else {
            local_file.url = local_file.url.replace("[YYYY]", formatDateUTC(currentTime, 'YYYY'));
            local_file.url = local_file.url.replace("[MM]", formatDateUTC(currentTime, 'MM'));
            local_file.url = local_file.url.replace("[DD]", formatDateUTC(currentTime, 'DD'));
            local_file.url = local_file.url.replace("[hh]", formatDateUTC(currentTime, 'hh'));
            local_file.url = local_file.url.replace("[mm]", formatDateUTC(currentTime, 'mm').slice(0,-1)+'0');
        }
    }

    switch (fileProtocol) {
        case "V":
            sSource = new itowns.VectorTilesSource(local_file);
            colorLayer = new itowns.ColorLayer(layer_name, {
                source: sSource,
                addLabelLayer: true,
                fx: 2.5,
                labelEnabled: true,
                // style: new itowns.Style({
                //     fill: {
                //         base_altitude: (p) => p.alti_sol || 0,
                //         extrusion_height: (p) => p.hauteur || 0,
                //     }
                // })
            });

            globeView.addLayer(colorLayer).then(appMenu.addLayerGUI.bind(appMenu));

            if(layer_name == 'test_geo') {
                itowns.ColorLayersOrdering.moveLayerToIndex(globeView, 'test_geo', 100);
            }
            
            break;
        case "TMS":
            sSource = new itowns.TMSSource(local_file);
            colorLayer = new itowns.ColorLayer(layer_name, {
                source: sSource,
            });

            globeView.addLayer(colorLayer).then(appMenu.addLayerGUI.bind(appMenu));

            break;
        case "Potree":

            if (Object.keys(fileCoord).length) {
                movePotision(globeView, fileCoord.crs, fileCoord.longitude, fileCoord.latitude, fileCoord.altitude, fileOptions.tilt, fileOptions.heading, fileOptions.range, fileOptions.time, fileOptions.stopPlaceOnGroundAtEnd );
            }

            sSource = new itowns.PotreeSource(local_file);
            colorLayer = new itowns.PotreeLayer(layer_name, {
                source: sSource,
            });

            itowns.View.prototype.addLayer.call(globeView, colorLayer).then(appMenu.addLayerGUI.bind(appMenu));

            break;
        case "three":
                
            sSource = new itowns.C3DTilesSource(local_file);
            colorLayer = new itowns.C3DTilesLayer(layer_name, {
                source: sSource,
            }, globeView);

            itowns.View.prototype.addLayer.call(globeView, colorLayer).then(appMenu.addLayerGUI.bind(appMenu));

            break;
        case "mengun":
            
            sSource = new itowns.FileSource(local_file);
            colorLayer = new itowns.ColorLayer(layer_name, {
                transparent: true,
                source: sSource,
                style: new itowns.Style({
                    point: { color: 'red', line: 'red', radius: '6' }
                })
            });

            globeView.addLayer(colorLayer).then(appMenu.addLayerGUI.bind(appMenu));
            break;
        default:
            sSource = new itowns.WMTSSource(local_file);
            colorLayer = new itowns.ColorLayer(layer_name, {
                source: sSource,
            });

            globeView.addLayer(colorLayer).then(appMenu.addLayerGUI.bind(appMenu));

            break;
    }
    // globeView.addLayer(colorLayer).then(appMenu.addLayerGUI.bind(appMenu));
}

// エレベーションレイヤの追加関数
function addElevationLayer(name, source, globeView, appMenu) {
    const elevationSource = new itowns.TMSSource(source);
    const elevationLayer = new itowns.ElevationLayer(name, {
        source: elevationSource,
    });
    globeView.addLayer(elevationLayer).then(appMenu.addLayerGUI.bind(appMenu));
}

// 3Dレイヤの追加関数
// function addC3DTLayer(fileName, fileSource, globeView, appMenu) {
//     const extensions = new itowns.C3DTExtensions();
//     extensions.registerExtension("3DTILES_batch_table_hierarchy",
//         { [itowns.C3DTilesTypes.batchtable]:
//             itowns.C3DTBatchTableHierarchyExtension });

//     const $3dSource = new itowns.C3DTilesSource(fileSource);
//     const $3dLayer = new itowns.C3DTilesLayer(
//         fileName, {
//         source: $3dSource,
//         registeredExtensions: extensions,
//     },
//     globeView);

//     itowns.View.prototype.addLayer.call(globeView, $3dLayer).then(appMenu.addLayerGUI.bind(appMenu));
// }


// 「レイヤー追加」レイヤの追加関数
let Folder;
let LayN = "";
function addCandidateLayer(config, appMenu, globeView) {

    if(!appMenu.subLayerGui.hasFolder(config.folder)) {
        Folder = appMenu.subLayerGui.addFolder(config.folder);
    }

    for (let num = 0; num < layerIdsNames.length; num++) {    
        if(config.id === layerIdsNames[num]) {
            config.source[config.id] = true;
            // Folder.add(config.source, config.id);
            initLayer(config, globeView, appMenu);
            layerGuide(config.id, config.source[config.id], jinryu_exist_date);
        }
    }

    Folder.add(config.source, config.id).onChange(function(){ 
        LayN = this.property;
        if(this.object[LayN]==true) {
            //TODO:レイヤを11個以上登録するとアラートを表示
            if(Object.keys(appMenu.colorGui.__folders).length < 10) {
                initLayer(config, globeView, appMenu);
            } else {
                alert("レイヤ表示の上限に達しました");
                this.object[LayN] = false;
            };
        } else {
            if(LayN=='アメダス【時系列】'){
                $3DBargraph_Env.amedas.amedas_graph = false;
                globeView.getLayerById('アメダス【時系列】').visible = false;
                globeView.removeLayer('アメダス【時系列】');//削除
                appMenu.removeLayersGUI('アメダス【時系列】');//削除

                hiddenRangeBar();
            } else if(LayN === "人口グラフ【時系列】") {
                $3DBargraph_Env.amedas.graph_config = false;
                globeView.getLayerById('人口').visible = false;
                globeView.removeLayer('人口');//削除
                appMenu.removeLayersGUI('人口');//削除
                globeView.getLayerById('世帯').visible = false;
                globeView.removeLayer('世帯');//削除
                appMenu.removeLayersGUI('世帯');//削除
                globeView.getLayerById('住宅数').visible = false;
                globeView.removeLayer('住宅数');//削除
                appMenu.removeLayersGUI('住宅数');//削除
                globeView.notifyChange();

                hiddenRangeBar();
            } else {
                globeView.removeLayer(LayN);
                appMenu.removeLayersGUI(LayN);
                globeView.notifyChange();
                hiddenRangeBar();
            }
        }

        layerGuide(LayN, this.object[LayN], jinryu_exist_date);
    });
    
}

export function formatDate(date, format) {
    const weekday = ["日", "月", "火", "水", "木", "金", "土"];
    if (!format) {
        format = 'YYYY/MM/DD(WW) hh:mm:ss'
    }
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/WW/g, weekday[date.getDay()]);
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    return format;
}

export function formatDateUTC (date, format) {
    var weekday = ["日", "月", "火", "水", "木", "金", "土"];
    if (!format) {
        format = 'YYYY/MM/DD(WW) hh:mm:ss'
    }
    format = format.replace(/YYYY/g, date.getUTCFullYear());
    format = format.replace(/MM/g, ('0' + (date.getUTCMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getUTCDate()).slice(-2));
    format = format.replace(/WW/g, weekday[date.getUTCDay()]);
    format = format.replace(/hh/g, ('0' + date.getUTCHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getUTCMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getUTCSeconds()).slice(-2));
    return format;
}

function setupParamLayer(config) {
    for (let num = 0; num < layerIdsNames.length; num++) {    
        if(config.id === layerIdsNames[num]) {
            defaultview = true;
            break;
        }
    }
}

function movePotision(globeView, coordCrs, coordLongitude, coordLatitude, coordAltitude, optionsTilt, optionsHeading, optionsRange, optionsTime, optionsStopPlaceOnGroundAtEnd, s=1) {
    let positionOnGlobe = new itowns.Coordinates(coordCrs, coordLongitude, coordLatitude, coordAltitude);

    //カメラ位置・角度設定
    let camera_v = globeView.camera.camera3D;
    let options = {
        coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
        tilt: optionsTilt, //地球表面とカメラのなす角 デフォルトは垂直で90
        heading: optionsHeading, //回転
        range: optionsRange, //カメラと地球の距離
        time: optionsTime, //アニメーションの長さ（ミリ秒）
        stopPlaceOnGroundAtEnd: optionsStopPlaceOnGroundAtEnd //アニメーション終了時にターゲットを地面に配置するのを停止
    };

    if (s === 1) {
        itowns.CameraUtils.animateCameraToLookAtTarget(globeView, camera_v, options);//アニメーション移動
    } else {
        itowns.CameraUtils.transformCameraToLookAtTarget(globeView, camera_v, options);//すぐ移動
    }
}

//TODO: JSON内のパスが相対パスのものを絶対パスに変換する
function changePath(config, path) {
    let url = config.source[path];
    if(url && !url.startsWith("http")) {
        config.source[path] = baseUrl + url;
    }
}

//TODO: 棒グラフの表示
export function updateBargraphLayer(view, currentYear, config, layername, num){
    if (view.getLayerById(config.id) != undefined){

        let selected_yyyy = currentYear;
        if (selected_yyyy >= 2022) {selected_yyyy = 2018;} 
        else if (selected_yyyy < 2022 && selected_yyyy >= 2018) {selected_yyyy = 2018;} 
        else if (selected_yyyy < 2018 && selected_yyyy >= 2013) {selected_yyyy = 2013;} 
        else if (selected_yyyy < 2013 && selected_yyyy >= 2008) {selected_yyyy = 2008;} 
        else if (selected_yyyy < 2008 && selected_yyyy >= 2003) {selected_yyyy = 2003;} 
        else if (selected_yyyy < 2003 ) {selected_yyyy = 1998;}
        else {selected_yyyy = currentYear;}

        let bargraphLayerConfig = config;
        // bargraphLayerConfig.url = "/storage/data/download/demographics/demographics_" + selected_yyyy + ".csv";
        bargraphLayerConfig.url = "./data/demographics/demographics_" + selected_yyyy + ".csv";
        layername.whenReady.then(() => {
            //なにもしない
        });
        if (view.getLayerById(config.id) != undefined){
            view.removeLayer(config.id);
        }
        //  view.removeLayer(config.id);

        layername = null;
        layername = CreateBargraphLayer(view, bargraphLayerConfig, num);
        view.addLayer(layername);

        layername.whenReady.then(() => {
            layername.updateBarGraph();
        });
    }
}

export function updateAmedasBargraphLayer(view, appMenu, currentTime, config){
    if (view.getLayerById(config.id) != undefined){

        let bargraphLayerConfig = config;
        bargraphLayerConfig.url = 'https://tb-gis-web.jgn-x.jp/api/t_amedas_data?point_1=' + point_1 + '&point_2=' + point_2 + '&point_3=' + point_3 + '&point_4=' + point_4 + '&currentDate=' + currentTime;

        view.removeLayer(config.id);

        let bargraphAmedasLayer = CreateBargraphLayer(view, bargraphLayerConfig, 5);
        view.addLayer(bargraphAmedasLayer).then(appMenu.addLayerGUI.bind(appMenu));

        bargraphAmedasLayer.whenReady.then(() => {
            bargraphAmedasLayer.updateBarGraph();
        });
    }
}

function setup3DBargraphLayer(config, globeView, appMenu) {

    if(config.id === "アメダス【時系列】") {
        $3DBargraph_Env.amedas.amedas_graph = true;
		let bargraphAmedasLayer = CreateBargraphLayer(globeView, $3DBargraph_Env.amedas.amedas_graph_config, 5);

        globeView.addLayer(bargraphAmedasLayer).then(appMenu.addLayerGUI.bind(appMenu));
        globeView.getLayerById('アメダス【時系列】').visible = true;

        bargraphAmedasLayer.whenReady.then(() => {
            bargraphAmedasLayer.updateBarGraph();
        });

        // 拡縮
        globeView.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
            bargraphAmedasLayer.whenReady.then(() => {
                bargraphAmedasLayer.updateBarGraph();
            });
        });
    } else {
        $3DBargraph_Env.amedas.graph_config = true;
        
        let bargraphLayer_b = CreateBargraphLayer(globeView, $3DBargraph_Env.population.graph_config_b, 2);
        let bargraphLayer_r = CreateBargraphLayer(globeView, $3DBargraph_Env.population.graph_config_r, 3);
        let bargraphLayer_y = CreateBargraphLayer(globeView, $3DBargraph_Env.population.graph_config_y, 4);
        
        globeView.addLayer(bargraphLayer_b).then(appMenu.addLayerGUI.bind(appMenu));
        globeView.getLayerById('人口').visible = true;
        globeView.addLayer(bargraphLayer_r).then(appMenu.addLayerGUI.bind(appMenu));
        globeView.getLayerById('世帯').visible = true;
        globeView.addLayer(bargraphLayer_y).then(appMenu.addLayerGUI.bind(appMenu));
        globeView.getLayerById('住宅数').visible = true;

        bargraphLayer_b.whenReady.then(() => {
            bargraphLayer_b.updateBarGraph();
        });
        bargraphLayer_r.whenReady.then(() => {
            bargraphLayer_r.updateBarGraph();
        });
        bargraphLayer_y.whenReady.then(() => {
            bargraphLayer_y.updateBarGraph();
        });
        // 拡縮
        globeView.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
            bargraphLayer_b.whenReady.then(() => {
                bargraphLayer_b.updateBarGraph();
            });
            bargraphLayer_r.whenReady.then(() => {
                bargraphLayer_r.updateBarGraph();
            });
            bargraphLayer_y.whenReady.then(() => {
                bargraphLayer_y.updateBarGraph();
            });
        });
    }
}

function showRangeBar(rangebar) {
    $("#button_range").addClass("active");

    if ($("#button_range").hasClass("active"))
    {
        $(".k2go-timeline-rail"    ).css     ({ pointerEvents : "none"   });
        $(".k2go-timeline-rail > *").css     ({ pointerEvents : "auto"   });
        $("#button_loop"           ).css     ({ visibility    : "visible"}); 
        $("#cal"                   ).addClass("disable1");
        $("#current_time"          ).addClass("disable1");

        let objOptions        = $("#timeline").k2goTimeline("getOptions");
        let objStartTime      = new Date(objOptions .minTime   .getTime() > objOptions.startTime.getTime() ? objOptions.minTime.getTime() : objOptions.startTime.getTime());
        let objEndTime        = new Date(objOptions .maxTime   .getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime.getTime() : objOptions.endTime  .getTime());
        let objRangeStartTime;
        let objRangeEndTime;

        objRangeStartTime = new Date(rangebar.start.year, rangebar.start.month, rangebar.start.day, rangebar.start.hour);
        objRangeEndTime   = new Date(rangebar.end.year  , rangebar.end.month  , rangebar.end.day, rangebar.end.hour);

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

export function hiddenRangeBar() {
    $("#button_range").removeClass("active");

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

function changeTimeTable(zr=7, timeslider, rangebar) {
    // タイムスライダーの時間範囲を変える
    $("#zoom-range").val(zr);
    let objOptions = $("#timeline").k2goTimeline("getOptions");
    let intZoomRange = parseInt($("#zoom-range").val(), 10);

    let intPixelSize;
    let objZoomInfo = $Env.zoomTable[intZoomRange];
    let objTimeInfo        = {};
    let objOffsetPixelInfo = {};

    $("#slider_label").html       ($Env.zoomTable[intZoomRange].name); 
    $("#button_minus").toggleClass("disable",  intZoomRange == 0);
    $("#button_plus" ).toggleClass("disable",  intZoomRange == $Env.zoomTable.length - 1);
    $("#date"        ).toggleClass("expansion",objOptions.scale <= 40);

    objOffsetPixelInfo.startTime   = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.minTime.getTime() > objOptions.startTime.getTime() ? objOptions.minTime : objOptions.startTime);
    objOffsetPixelInfo.endTime     = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.maxTime.getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime : objOptions.endTime  );
    objOffsetPixelInfo.currentTime = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.currentTime);

    intPixelSize = objZoomInfo.value / (objOffsetPixelInfo.endTime - objOffsetPixelInfo.startTime);
    
    objTimeInfo.minTime      = new Date(objOptions.minTime    .getTime());
    objTimeInfo.maxTime      = new Date(objOptions.maxTime    .getTime());
    objTimeInfo.currentTime  = new Date(timeslider.current.year, timeslider.current.month, timeslider.current.day, timeslider.current.hour);
    objTimeInfo.startTime    = new Date(timeslider.start.year  , timeslider.start.month  , timeslider.start.day  , timeslider.start.hour);
    objTimeInfo.endTime      = new Date(timeslider.end.year    , timeslider.end.month    , timeslider.end.day    , timeslider.end.hour);
    
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

    if (Object.keys(rangebar).length) {
        setTimeout(() => {
            showRangeBar(rangebar, objTimeInfo.startTime, objTimeInfo.endTime);
        }, "100");
    }
}