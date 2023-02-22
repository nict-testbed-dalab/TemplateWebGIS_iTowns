// import { initLayer } from "../layer/layer";

/* global itowns */
/**
 * This module can be added to a web page or in a web application. It provides a
 * simple behavior where single files can be drag and dropped onto a viewer. No
 * relationship between a type of file and the way it is read, parsed and
 * displayed are stored in the plugin. Use the method `register` to declare the
 * way a file is read, parsed and displayed.
 *
 * Note: only files with the crs projection `EPSG:4326` can be projected correctly
 * using this plugin.
 *
 * @module DragNDrop
 *
 * @example
 * &lt;script src="js/DragNDrop.js">&lt;/script>
 * &lt;script type="text/javascript">
 *      let view = new itowns.GlobeView(document.getElementById('viewerDiv'));
 *
 *      DragNDrop.setView(view);
 *      DragNDrop.register('geojson', DragNDrop.JSON, itowns.GeoJsonParser.parse, DragNDrop.COLOR);
 *      DragNDrop.register('gpx', DragNDrop.XML, itowns.GpxParser.parse, DragNDrop.GEOMETRY);
 * &lt;/script>
 *
 * @example
 * require('./js/itowns.js');
 * require('./plugins/DragNDrop.js');
 *
 * const view = new itowns.GlobeView(document.getElementById('viewerDiv'));
 *
 * DragNDrop.setView(view);
 * DragNDrop.register('geojson', DragNDrop.JSON, itowns.GeoJsonParser.parse, DragNDrop.COLOR);
 * DragNDrop.register('gpx', DragNDrop.XML, itowns.GpxParser.parse, DragNDrop.GEOMETRY);
 */

// 3DのGeoJSONの高さを取得
 function extrudeBuildings(properties) {
    return properties.height + 126;
}

let DragNDrop = (function _() {
    // TYPE
    let _TEXT = 1;
    let _JSON = 2;
    let _BINARY = 3;
    let _IMAGE = 4;
    let _XML = 5;
    let _CSV = 8;
    let _GEOJSON = 9;

    // MODE
    let _COLOR = 6;
    let _GEOMETRY = 7;

    let extensionsMap = {};
    let fileReader = new FileReader();

    let _view;

    let syataiLagend = true;
    let amedas_rain = true;
    let amedas_temp = true;
    let amedas_snow = true;

    function addFiles(event, files) {
        event.preventDefault();

        //TODO:レイヤを11個以上登録するとアラートを表示
        if(Object.keys(_Menu.colorGui.__folders).length < 10) {

            // Read each file
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let fileExtension = file.name.split(/(?<=^[^.]+)\./).pop().toLowerCase();
                let extension = extensionsMap[fileExtension];

                if(!extension) {
                    if(fileExtension.indexOf(".") !== -1) {
                        fileExtension = file.name.split(".").pop().toLowerCase();
                        extension = extensionsMap[fileExtension];
                    } else {
                        console.log("その拡張子は登録されていません");
                    };
                };

                // eslint-disable-next-line no-loop-func
                fileReader.onload = function onload(e) {
                    let data = e.target.result;

                    if (extension.type == _JSON) {
                        data = JSON.parse(data);
                        
                        if(data.source_id === "layer_garbagetruck_trajectory" || data.source_id === "layer_garbagetruck") {
                            data.source = {};
                            data.source.protocol = "3do";
                            setupJson(data);
                            chageValue(file, data.source_id);
                        } else if(data.source_id === "json") {
                            // 何もしない
                        } else if(data.source_id === "layer_amedas") {
                            data.source = {};
                            data.source.protocol = "3do";
                            setupAmedasJson(data);
                            chageValue(file, data.source_id);
                        } else {
                            data.source = {};
                            data.source.protocol = "3do";
                            setupMFJson(data);
                        }
                        
                    } else if (extension.type == _XML) {
                        data = new window.DOMParser().parseFromString(data, 'text/xml');
                    } else if (extension.type == _CSV){
                        data = data.split(/\n/);
                        data.source = {};
                        data.source.protocol = "3do";
                        setupCSV(data);
                    } else if(extension.type == _GEOJSON) {
                        // 何もしない
                    } else {
                        // 何もしない
                    }

                    let crs = extension.mode == _GEOMETRY ? _view.referenceCrs : _view.tileLayer.extent.crs;

                    if(file.type === "application/json" || file.type === "text/csv") {
                        // jsonレイヤの追加
                        let layer;
                        // if(data.source.protocol === "3do" || data[0] === undefined) {
                                switch (data.source.protocol) {
                                    case "V":
                                        sSource = new itowns.VectorTilesSource(data.source);
                                        colorLayer = new itowns.ColorLayer(data.id, {
                                            source: sSource,
                                            addLabelLayer: true,
                                            fx: 2.5,
                                            labelEnabled: true,
                                        });

                                        _view.addLayer(colorLayer).then(_Menu.addLayerGUI.bind(_Menu));
                                        break;
                                    case "TMS":
                                        layer = new itowns.TMSSource(data.source);
                                        colorLayer = new itowns.ColorLayer(data.id, {
                                            source: layer,
                                        });

                                        _view.addLayer(colorLayer).then(_Menu.addLayerGUI.bind(_Menu));
                                        break;
                                    case "three":
                                        sSource = new itowns.C3DTilesSource(data.source);
                                        colorLayer = new itowns.C3DTilesLayer(data.id, {
                                            source: sSource,
                                        }, _view);

                                        itowns.View.prototype.addLayer.call(_view, colorLayer).then(_Menu.addLayerGUI.bind(_Menu));
                                        break;
                                    case "G":
                                        FeatureToolTip.init(viewerDiv, _view);
                                        sSource = new itowns.FileSource(data.source);

                                        let style = new itowns.Style({
                                            zoom: { min: 10, max: 20 },
                                            icon: {
                                                source: "./src/layer/marker_icon.png",
                                                size: 0.1,
                                            },
                                        });
                                        colorLayer = new itowns.ColorLayer('test', {
                                            isColorLayer: true,
                                            transparent: true,
                                            source: sSource,
                                            style: style,
                                            addLabelLayer: true,
                                        });

                                        _view.addLayer(colorLayer).then(_Menu.addLayerGUI.bind(_Menu));
                                        (function () {
                                            //ツールチップ
                                            FeatureToolTip.addLayer(colorLayer, { filterAllProperties: true });
                                        }());

                                        break;

                                    case "travel":
                                        addTravelJson(_view, data);
                                        break;

                                    // 新形式のmf-jsonに対応するため修正
                                    case "3do":
                                        addMF_JSON(_view, data.source_id, syataiLagend, data.target_data, amedas_rain, amedas_temp, amedas_snow);
                                        break;

                                    default:
                                        sSource = new itowns.WMTSSource(data.source);
                                        colorLayer = new itowns.ColorLayer(data.id, {
                                            source: sSource,
                                        });

                                        _view.addLayer(colorLayer).then(_Menu.addLayerGUI.bind(_Menu));
                                        break;
                                }
                        // } else {

                        // }
                    } else {
                    
                        extension.parser(data, {
                            in: {
                                crs: 'EPSG:4326',
                            },
                            out: {
                                crs: crs,
                                buildExtent: true,
                                mergeFeatures: true,
                                structure: (extension.mode == _GEOMETRY ? '3d' : '2d'),
                                forcedExtentCrs: crs != 'EPSG:4978' ? crs : 'EPSG:4326',
                            },
                        }).then(function _(features) {
                            FeatureToolTip.init(viewerDiv, _view);
                            let source = new itowns.FileSource({
                                features: features,
                                crs: 'EPSG:4326',
                            });

                            setupPointData(features);

                            let randomColor = Math.round(Math.random() * 0xffffff);

                            let layer;
                            if (extension.mode == _COLOR) {
                                layer = new itowns.ColorLayer(file.name, {
                                    transparent: true,
                                    style: new itowns.Style({
                                        fill: {
                                            color: '#' + randomColor.toString(16),
                                            opacity: 0.7,
                                        },
                                        stroke: {
                                            color: 'red',
                                            width: 5
                                        },
                                        point: {
                                            color: '#' + randomColor.toString(16),
                                            radius: 5,
                                            line: "black"
                                        },
                                    }),
                                    source: source,
                                    addLabelLayer: true,
                                });
                            } else if (extension.mode == _GEOMETRY) {
                                layer = new itowns.FeatureGeometryLayer(
                                    file.name,
                                    {
                                        style: new itowns.Style({
                                            fill: {
                                                color: '#' + randomColor.toString(16),
                                                extrusion_height: extrudeBuildings,
                                            },
                                        }),
                                        source: source,
                                        opacity: 0.7,
                                    });
                            } else {
                                throw new Error('Mode of file not supported, please add it using DragNDrop.register');
                            }

                            _view.addLayer(layer).then(_Menu.addLayerGUI.bind(_Menu));
                            (function () {
                                //ツールチップ
                                FeatureToolTip.addLayer(layer, { filterAllProperties: false });
                            }());

                            let extent = features.extent.clone();
                            // Transform local extent to data.crs projection.
                            if (extent.crs == features.crs) {
                                extent.applyMatrix4(features.matrixWorld);
                            }

                            // Move the camera
                            itowns.CameraUtils.transformCameraToLookAtTarget(_view, _view.camera.camera3D, extent);
                        });
                    }
                };

                switch (extension.type) {
                    case _TEXT:
                    case _JSON:
                    case _XML:
                    case _CSV:
                    case _GEOJSON:
                        fileReader.readAsText(file);
                        break;
                    case _BINARY:
                        fileReader.readAsArrayBuffer(file);
                        break;
                    case _IMAGE:
                        fileReader.readAsBinaryString(file);
                        break;
                    default:
                        throw new Error('Type of file not supported, please add it using DragNDrop.register');
                }
            }
        } else {
            alert("レイヤ表示の上限に達しました");
        };
    }

    // Listen to drag and drop actions
    document.addEventListener('dragenter', function _(e) { e.preventDefault(); }, false);
    document.addEventListener('dragover', function _(e) { e.preventDefault(); }, false);
    document.addEventListener('dragleave', function _(e) { e.preventDefault(); }, false);
    document.addEventListener('drop', function _(e) { addFiles(e, e.dataTransfer.files); }, false);
    document.addEventListener('paste', function _(e) { addFiles(e, e.clipboardData.files); }, false);

    return {
        TEXT: _TEXT,
        JSON: _JSON,
        BINARY: _BINARY,
        IMAGE: _IMAGE,
        XML: _XML,
        CSV: _CSV,
        GEOJSON: _GEOJSON,

        COLOR: _COLOR,
        GEOMETRY: _GEOMETRY,

        /**
         * Register a type of file to read after a drag and drop on the viewer.
         * The file will be processed following its extension and instructions
         * given here.
         *
         * @param {string} extension - The extension to register. Each file
         * dropped ending with this extension will follow the instructions given
         * by the others parameters of this function.
         * @param {number} type - The type of file to register. Can be
         * `DragNDrop.TEXT` (equivalent to `Fetcher.text`), `DragNDrop.JSON`
         * (equivalent to `Fetcher.json`), `DragNDrop.BINARY` (equivalent to
         * `Fetcher.arrayBuffer`), `DragNDrop.IMAGE` (equivalent to
         * `Fetcher.texture`) or  `DragNDrop.XML` (equivalent to `Fetcher.xml`).
         * @param {Function} parser - The method to parse the content of the
         * added file.
         * @param {number} mode - Choose the mode the file is displayed: either
         * `DragNDrop.COLOR` (equivalent to a `ColorLayer`) or
         * `DragNDrop.GEOMETRY` (equivalent to a `GeometryLayer`).
         *
         * @memberof module:DragNDrop
         */
        register: function _(extension, type, parser, mode) {
            extensionsMap[extension.toLowerCase()] = {
                type: type,
                parser: parser,
                mode: mode,
            };
        },

        /**
         * The DragNDrop plugin needs to be binded to a view. Specified it using
         * this method.
         *
         * @param {View} view - The view to bind to the DragNDrop interface.
         *
         * @memberof module:DragNDrop
         */
        setView: function _(view, menu) {
            _view = view;
            _Menu = menu;
        },
    };
}());

if (typeof module != 'undefined' && module.exports) {
    module.exports = DragNDrop;
}

function setupPointData(pointFeatures) {
    let num = pointFeatures.features[0].geometries.length;
    let colorValue = pointFeatures.features[0].geometries;

    for(let i=0; i < num; i++) {
        let featuresColor = colorValue[i].properties.col4;
        if(!featuresColor) {
            featuresColor = colorValue[i].properties["RxPower[dBm]"];
        }

        if(isNaN(Number(featuresColor))) {
            colorValue[i].properties.style.point.color = "white";
        } else {
            if(-30 <= Number(featuresColor) && Number(featuresColor) <= -1) {
                colorValue[i].properties.style.point.color = "red";
            } else if(-70 <= Number(featuresColor) && Number(featuresColor) <= -31) {
                colorValue[i].properties.style.point.color = "orange";
            } else if(-100 <= Number(featuresColor) && Number(featuresColor) <= -71) {
                colorValue[i].properties.style.point.color = "yellow";
            } else if(-110 <= Number(featuresColor) && Number(featuresColor) <= -101) {
                colorValue[i].properties.style.point.color = "green";
            } else if(-120 <= Number(featuresColor) && Number(featuresColor) <= -111) {
                colorValue[i].properties.style.point.color = "aqua";
            } else if(-130 <= Number(featuresColor) && Number(featuresColor) <= -121) {
                colorValue[i].properties.style.point.color = "blue";
            } else if(-999 <= Number(featuresColor) && Number(featuresColor) <= -131) {
                colorValue[i].properties.style.point.color = "purple";
            }
        }
    }
}

function addTravelJson(_view, data) {
    
    // THREE.Group which stores picked camera positions markers.
    let cameraHelpers = new THREE.Group();
    cameraHelpers.visible = false;
    _view.scene.add(cameraHelpers);

    function animateCamera(travelSteps) {
        if (!travelOn) {  // If travel is off, begin travel
            travelOn = true;
            return itowns.CameraUtils.sequenceAnimationsToLookAtTarget(
                _view,
                _view.camera.camera3D,
                travelSteps,
            ).then(() => { travelOn = false; });
        }
        itowns.CameraUtils.stop(_view, _view.camera.camera3D); // If travel is on, interrupt it
    }

    // jsonカメラの追加
    let travelOn = false;
    let travelSteps = [];

    let edit_data;
    let cameraTransformOptions;

    for(let i=0; i<data.geometry.length; i++) {
        
        cameraTransformOptions = itowns.CameraUtils.getTransformCameraLookingAtTarget(
            _view,
            _view.camera.camera3D,
        );

        edit_data = data.geometry[i];
        /* set new LookAt position */
        cameraTransformOptions.range = edit_data.range;
        cameraTransformOptions.coord.x = edit_data.coord.x;
        cameraTransformOptions.coord.y = edit_data.coord.y;
        cameraTransformOptions.coord.z = edit_data.coord.z;
        cameraTransformOptions.heading = edit_data.heading; 
        cameraTransformOptions.tilt = edit_data.tilt; 
        // easingtime
        cameraTransformOptions.time = 7500;

        travelSteps[i] = cameraTransformOptions;

    }

    // Create a CameraHelper (https://threejs.org/docs/index.html?q=Camera#api/en/helpers/CameraHelper) at
    // the current position of the camera. The camera is copied, and the copy's `far` is lowered. This
    // renders shorter axes on the displayed CameraHelper.
    const copyCamera = _view.camera.camera3D.clone();
    copyCamera.far = 50;
    const helper = new THREE.CameraHelper(copyCamera);
    helper.updateWorldMatrix(true, false);
    cameraHelpers.add(helper);
    _view.notifyChange();
    animateCamera(travelSteps);
}

function chageValue(file, dataSourceID) {
    if(dataSourceID === "layer_amedas") {
        $("#prepro_db_data_type").val("");
        $("#prepro_db_data_type").val("layer_amedas");

        $('select#col_name option').remove();
        let options = '<option value="precipitation24h">24時間降雨量</option><option value="temp">気温</option><option value="snow">積雪深</option>';
        $("#col_name").append(options);
    } else if(dataSourceID === "layer_garbagetruck_trajectory" || dataSourceID === "layer_garbagetruck") {
        $("#prepro_db_data_type").val("");
        $("#prepro_db_data_type").val("layer_garbagetruck");

        $('select#col_name option').remove();
        let options = '<option value="speed">速度</option><option value="pm25">PM2.5</option>';
        $("#col_name").append(options);
    } else {

    }

    let col_name = document.getElementById('col_name'); // 取得項目
    let start_date = document.getElementById('start_date'); // 開始
    let end_date = document.getElementById('end_date'); // 終了
    let proc_type = document.getElementById('proc_type'); // リサンプル
    let granularity_val = document.getElementById('granularity_val'); // 時間粒度(数字)
    let granularity = document.getElementById('granularity'); // 時間粒度(単位)
    let prepro_file_name = document.getElementById('prepro_file_name'); // ファイル名

    let env_data = JSON.parse(sessionStorage.getItem('env_json'));

    getOptionsValue(col_name, env_data.target_data); // 取得項目
    start_date.value = getTimeValue(env_data.start_date); // 開始
    end_date.value = getTimeValue(env_data.end_date); // 終了
    getOptionsValue(proc_type, env_data.proc_type); // リサンプル

    // 時間粒度(数字)
    let result = env_data.granularity.match(/[0-9]/g);
    if(result) {
        granularity_val.value = env_data.granularity.replace(/[^0-9]/g, "");
    } else {
        granularity_val.value = 1;
    }

    getOptionsValue(granularity, env_data.granularity.replace(/[^a-z]/g, "")); // 時間粒度(単位)
    prepro_file_name.innerHTML = file.name; // ファイル名
}

function getOptionsValue(optionValue, data) {
    //HTMLCollectionを配列に変換してループ
    Array.from(optionValue.options).forEach(function(option) {
        if(data === "spline" || data === "linear" || data === "avg" || data === "max" || data === "min" ) {
            checkProcType(data);
        } else {
            // 何もしない
        }

        if(option.value === data) {
            option.selected = true;
        } else {
            // 何もしない
        }
    });
}

function getTimeValue(time) {
    let time_yyyy = time.slice(0, 4);
    let time_MM = time.slice(4, 6);
    let time_DD = time.slice(6, 8);
    let time_hh = time.slice(8, 10);
    let time_m = time.slice(10, 12);

    let getTime = time_yyyy + "-" + time_MM + "-" + time_DD + "T" + time_hh + ":" + time_m;

    return getTime;
}

function checkProcType(type) {
    let options;
    $('select#granularity option').remove();

    // アメダスの時
    if($("#prepro_db_data_type").val() === "layer_amedas") {
        if(type === "spline" || type === "linear") {
            options = '<option value="sec">秒</option><option value="minute">分</option>';
            $("#granularity").append(options);
        } else {
            options = '<option value="minute">分</option><option value="hour" selected="">時間</option><option value="day">日</option><option value="month">月</option><option value="year">年</option>';
            $("#granularity").append(options);
        }

    // 日進市の時
    } else if($("#prepro_db_data_type").val() === "layer_garbagetruck") {
        if(type === "spline" || type === "linear") {
            options = '<option value="sec">秒</option>';
            $("#granularity").append(options);

        } else {
            options = '<option value="minute">分</option><option value="hour" selected="">時間</option><option value="day">日</option><option value="month">月</option><option value="year">年</option>';
            $("#granularity").append(options);
        }
    } else {
        // 何もしない
    }
}