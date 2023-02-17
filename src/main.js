/**
 * This file is the entrypoint for webpack
 * See webpack.config.js
 */
import * as itowns from "itowns";
import * as THREE from "three";

import { setupLoadingScreen } from "./gui/LoadingScreen";
import { GuiTools, setupLeyaerPanelColor } from "./gui/GuiTools";

// タイムラインモジュールの追加
import { setupTimeline, toDate } from "./gui/timeline/timeline";

// widgetモジュールの追加
import { addWidget } from "./widget/widget";

// 初期レイヤ追加関数モジュールの追加
import { addInitialLayers, hiddenRangeBar } from "./layer/layer";

// geojsonの追加
import { createObject, setupJson, setupMFJson, setupCSV, setupAmedasJson, addMF_JSON } from "./layer/geojson";

// ボタンの開閉機能の追加
import { setupButtonsPanels } from "./buttons/buttons";

// カメラスライダーの追加・マウスイベントの追加
import { setupCameraPanels, placement } from "./camera/camera";

import { camera_traveling } from "./camera/camera_traveling";

//TODO: 3D棒グラフの表示
import { CreateBargraphLayer } from "./3dBarGraph/3dBarGraph";
import { $3DBargraph_Env } from "./3dBarGraph/3dBargraph_env";

// TODO: ログイン機能の追加
import { setupLogin } from "./login/login";

// TODO: データ取得用UIの追加
import { setupPreprocess } from "./gui/preprocess";

import { setupSyataiLagend } from "./legend/legend"

// ラベル表示用モジュール
import { TextGeometry } from "./gui/text/TextGeometry.js";
import { FontLoader } from "./gui/text/FontLoader.js";

import * as fnc from "./gui/timeline/fnc";

import "./css/example.css";
import "./css/LoadingScreen.css";
import "./css/widgets.css";

import "./css/legend.css";

import "./css/ipcamera_param.css";

// ---------- プラグインを利用するための準備 : ---------- 
/*
iTowns本体のpackage.json(node_modules\itowns にある)の記述を

  "exports": {
      ".": "./lib/Main.js",
      "./widgets": "./lib/Utils/gui/Main.js",
      "./examples/*": "./examples/js/*.js"
  },

とする必要がある。
*/
import * as DragNDrop from "./gui/DragNDrop";
import * as FeatureToolTip from "./gui/FeatureToolTip";

// プラグイン(例：DragNDrop)がグローバル変数として使う。
window.itowns = itowns;
window.THREE = THREE;
window.FeatureToolTip = FeatureToolTip;
window.timeline = fnc;
window.toDate = toDate;
window.hiddenRangeBar = hiddenRangeBar;
window.createObject = createObject;
window.setupJson = setupJson;
window.setupMFJson = setupMFJson;
window.setupCSV = setupCSV;
window.setupAmedasJson = setupAmedasJson;
window.addMF_JSON = addMF_JSON;
window.setupSyataiLagend = setupSyataiLagend;
window.TextGeometry = TextGeometry;
window.FontLoader = FontLoader;
// フォント読み込み
const fontLoader = new FontLoader();
// グローバル変数化
fontLoader.load('./font/j_font.json', (fontdata) => {
    window.fontdata = fontdata;
});

const viewerDiv = document.getElementById("viewerDiv");
const globeView = new itowns.GlobeView(viewerDiv, placement);
// Setup loading screen and debug menu
setupLoadingScreen(viewerDiv, globeView, itowns);
const appMenu = new GuiTools("menuDiv", globeView);

//TODO: 3D棒グラフの表示
let bargraphLayer_b = CreateBargraphLayer(globeView, $3DBargraph_Env.population.graph_config_b, 2);
let bargraphLayer_r = CreateBargraphLayer(globeView, $3DBargraph_Env.population.graph_config_r, 3);
let bargraphLayer_y = CreateBargraphLayer(globeView, $3DBargraph_Env.population.graph_config_y, 4);
setupTimeline(globeView, appMenu, $3DBargraph_Env.amedas.amedas_graph_config, $3DBargraph_Env.population.graph_config, $3DBargraph_Env.population.graph_config_b, bargraphLayer_b, $3DBargraph_Env.population.graph_config_r, bargraphLayer_r, $3DBargraph_Env.population.graph_config_y, bargraphLayer_y);

// ボタンパネルの初期設定
setupButtonsPanels(globeView);

// カメラパネルの初期設定
setupCameraPanels(globeView);

// 初期レイヤの追加
addInitialLayers(globeView, appMenu, initialLayers, baseUrl);

const antisun1 = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 2.0);
globeView.tileLayer.object3d.children[0] = antisun1;

// ---------- ADD WIDGET : ----------
addWidget(globeView, placement);

// ---------- ADD PLUGIN : ----------
DragNDrop.setView(globeView,appMenu);
DragNDrop.register('fg.geojson', DragNDrop.GEOJSON, itowns.GeoJsonParser.parse, DragNDrop.GEOMETRY);
DragNDrop.register('geojson', DragNDrop.GEOJSON, itowns.GeoJsonParser.parse, DragNDrop.COLOR);
DragNDrop.register('gpx', DragNDrop.XML, itowns.GpxParser.parse, DragNDrop.COLOR);
DragNDrop.register('json', DragNDrop.JSON, itowns.GeoJsonParser.parse, DragNDrop.COLOR);
DragNDrop.register('csv', DragNDrop.CSV, itowns.GeoJsonParser.parse, DragNDrop.COLOR);

// ---------- DEBUG TOOLS : ----------
// debug.createTileDebugUI(appMenu.gui, globeView);

//TODO: レイヤパネルに色をつける
setupLeyaerPanelColor(globeView, appMenu);

// ---------- misc_camera_traveling : ----------
camera_traveling(THREE, itowns, globeView, GuiTools);

// TODO: ログイン機能の追加
setupLogin(appMenu);

// TODO: データ取得用UIの追加
setupPreprocess(globeView);