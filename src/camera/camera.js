import * as itowns from "itowns";
import { $Env } from "../gui/timeline/env";
import * as fnc from "../gui/timeline/fnc";

// カメラの初期値
export let placement = {
  coord: new itowns.Coordinates("EPSG:4326", 138.06381, 35.66447, 5000000),
  range: 5000000,
};

/* ■Camera */
let ipCamera = null;
let itownsCamera = null;

/* earch radius */
let REARTH = 6378150.;
/* 距離のプログラム上の制限 */
let LengthLimit = 10000.;

/* iTowns カメラ */
let defaultCameraXPos = placement.coord.x;
let defaultCameraYPos = placement.coord.y;
let defaultCameraZPos = placement.coord.z;
let defaultCameraTilt;
let defaultCameraPan;
let defaultCameraRoll;

// STARS同期初期設定
let wgapp = {};
wgapp.center = {};
wgapp.center.lat = 36.4797055;
wgapp.center.lng = 138.1358457;

wgapp.north      = 0;
wgapp.east       = 0;
wgapp.south      = 0;
wgapp.west       = 0;

wgapp.zoom       = 0;
wgapp.direction  = 0;
wgapp.pitch      = 13;

/* Camera クラス */
let Camera = (function() {

    // constructor
    let Camera = function(xpos, ypos, zpos, type) {
      if(!(this instanceof Camera)) {
        return new Camera(xpos, ypos, zpos);
      }
  
      this.cameraXPos = xpos;
      this.cameraYPos = ypos;
      this.cameraZPos = zpos;
      this.cameraXLookAt = xpos;
      this.cameraYLookAt = ypos;
      this.cameraZLookAt = 0.0;
      this.cameraTilt = -90;
      this.cameraPan = 0.0;
      this.cameraRoll = 0.0;
      this.cameraVFov = 30.0;
      this.cameraHFov = 60.0;
      this.cameraLength = 0.0;
      this.cameraRange = 0.0;
      this.cameraType = type;   /* "ip" | "itowns" */
    }
  
    let p = Camera.prototype;
  
    // set method
    p.setCameraXPos = function(xpos) {
      this.cameraXPos = xpos;
    }
    p.setCameraYPos = function(ypos) {
      this.cameraYPos = ypos;
    }
    p.setCameraZPos = function(zpos) {
      this.cameraZPos = zpos;
    }
    p.setCameraXLookAt = function(xlookat) {
      this.cameraXLookAt = xlookat;
    }
    p.setCameraYLookAt = function(ylookat) {
      this.cameraYLookAt = ylookat;
    }
    p.setCameraZLookAt = function(zlookat) {
      this.cameraZLookAt = zlookat;
    }
    p.setCameraTilt = function(tilt) {
      this.cameraTilt = tilt;
    }
    p.setCameraPan = function(pan) {
      this.cameraPan = pan;
    }
    p.setCameraRoll = function(roll) {
      this.cameraRoll = roll;
    }
    p.setCameraVFov = function(vfov) {
      this.cameraVFov = vfov;
    }
    p.setCameraHFov = function(hfov) {
      this.cameraHFov = hfov;
    }
    p.setCameraLength = function(length) {
      this.cameraLength = length;
    }
    p.setCameraRange = function(range) {
      this.cameraRange = range;
    }
  
    // get method
    p.getCameraXPos = function() {
      return this.cameraXPos;
    }
    p.getCameraYPos = function() {
      return this.cameraYPos;
    }
    p.getCameraZPos = function() {
      return this.cameraZPos;
    }
    p.getCameraXLookAt = function() {
      return this.cameraXLookAt;
    }
    p.getCameraYLookAt = function() {
      return this.cameraYLookAt;
    }
    p.getCameraZLookAt = function() {
      return this.cameraZLookAt;
    }
    p.getCameraTilt = function() {
      return this.cameraTilt;
    }
    p.getCameraPan = function() {
      return this.cameraPan;
    }
    p.getCameraRoll = function() {
      return this.cameraRoll;
    }
    p.getCameraVFov = function() {
      return this.cameraVFov;
    }
    p.getCameraHFov = function() {
      return this.cameraHFov;
    }
    p.getCameraLength = function() {
      return this.cameraLength;
    }
    p.getCameraRange = function() {
      return this.cameraRange;
    }
  
    return Camera;
  })();

itownsCamera = new Camera(defaultCameraXPos, defaultCameraYPos, defaultCameraZPos, "itowns");
ipCamera = itownsCamera;

/* カメラ位置の計算 */
function calc_camera_position(camera) 
{
    console.log("---- calc_camera_position ----");

    let height;
    let tilt;
    let length;

    height = camera.getCameraZPos();
    tilt = 90 + camera.getCameraTilt(); /* パラメーターでは下向きをマイナスで表現 */
    console.log("height = " + height + ", tilt = " + tilt);

    /* 下向き */
    if (tilt < 90) {

        /* z = 0 の点 */
        camera.setCameraZLookAt(0.0);

        /* z = 0 になる点とカメラ位置との地上距離 */
        length = height * Math.tan(tilt * (Math.PI / 180));
        console.log("length = " + length);

        /* 距離の制限 */
        if (length > LengthLimit) {
            let dz = LengthLimit * Math.cos(tilt * (Math.PI / 180)); 
            camera.setCameraZLookAt(camera.getCameraZPos() - dz);
            length = LengthLimit * Math.sin(tilt * (Math.PI / 180));
        }

        /* LookAt 点との距離 */
        camera.setCameraLength(Math.sqrt(length*length + height*height));
    }
    /* 上向き */
    else if (tilt > 90) {

        /* 距離の制限 */
        let zval = LengthLimit * Math.sin((tilt - 90)* (Math.PI / 180)) + camera.getCameraZPos();
        camera.setCameraZLookAt(zval);

        /* 地上距離 */
        length = LengthLimit * Math.cos((tilt - 90)* (Math.PI / 180));
        console.log("length = " + length);

        /* LookAt 点との距離 */
        camera.setCameraLength(LengthLimit);

    }
    /* 平行カメラ */
    else {
        length = LengthLimit;
        camera.setCameraLength(LengthLimit);
        camera.setCameraZLookAt(camera.getCameraZPos());
    }

    /* 緯度経度から距離へのラフな換算 */
    let xPos;
    let yPos;
    let zPos;
    let cPan;
    let xLookAt;
    let yLookAt;
    let zLookAt;
    xPos = camera.getCameraXPos();
    yPos = camera.getCameraYPos();
    zPos = camera.getCameraZPos();
    cPan = camera.getCameraPan();

    let r = 2 * Math.PI * REARTH; /* 円周地球 */
    let rlat = r / 360; /* 1度あたりの長さ */
    let rlon = REARTH * Math.cos(yPos / 180 * Math.PI) * 2 * Math.PI / 360;  /* rcos(Theta) */
    console.log("rlon = " + rlon + " rlat = " + rlat);
    let rlon_length = length / rlon;
    let rlat_length = length / rlat;
    console.log("approximate rlon_length = " + rlon_length + " rlat_length = " + rlat_length);
    /* target 位置の計算 */
    xLookAt = xPos + rlon_length * Math.sin(cPan * (Math.PI / 180));
    yLookAt = yPos + rlat_length * Math.cos(cPan * (Math.PI / 180));

    camera.setCameraXLookAt(xLookAt);
    camera.setCameraYLookAt(yLookAt);
    camera.setCameraRange(camera.getCameraLength());

    // result
    console.log("-----");
    console.log("camera pos x = " + camera.getCameraXPos() + " y = " + camera.getCameraYPos() + " z = " + camera.getCameraZPos());
    console.log("camera lookat  x = " + camera.getCameraXLookAt() + " y = " + camera.getCameraYLookAt() + " z = " + camera.getCameraZLookAt());
    console.log("-----");
}

/* Move Camera */
function move_camera(view) 
{
   console.log("----------- move_camera ---------");

   /* curren Camera position */
   let p1 = new itowns.Coordinates('EPSG:4326', itownsCamera.getCameraXPos(), itownsCamera.getCameraYPos(), itownsCamera.getCameraZPos());
   let pv1 = p1.as(view.referenceCrs);
   view.camera.camera3D.position.x = pv1.x;
   view.camera.camera3D.position.y = pv1.y;
   view.camera.camera3D.position.z = pv1.z;

   /* get current settings */
   let p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);

   /* set new LookAt position */
   p.range = itownsCamera.getCameraRange();
   p.coord.x = itownsCamera.getCameraXLookAt();
   p.coord.y = itownsCamera.getCameraYLookAt();
   p.coord.z = itownsCamera.getCameraZLookAt();
   p.heading = -1 * itownsCamera.getCameraPan();   /* iTowns 内部的には右にマイナス（パラメーターは右にプラス）*/
   p.tilt = -1 * itownsCamera.getCameraTilt();     /* 実カメラ位置の地上を見る場合には下向き（倍）*/

   /* set new LookAt position */
   itowns.CameraUtils.transformCameraToLookAtTarget (view, view.camera.camera3D, p);

   /* debug */
   console.log("=====");
   console.log("view.camera.camera3D.x = " + view.camera.camera3D.position.x);
   console.log("view.camera.camera3D.y = " + view.camera.camera3D.position.y);
   console.log("view.camera.camera3D.z = " + view.camera.camera3D.position.z);
   let cv = view.controls.getCameraTargetPosition();
   console.log("=====");
   console.log("current view.controls.getCameraTargetPosition.x = " + cv.x);
   console.log("current view.controls.getCameraTargetPosition.y = " + cv.y);
   console.log("current view.controls.getCameraTargetPosition.z = " + cv.z);
   p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
   console.log("=====");
   console.log("p.range = " + p.range);
   console.log("p.coord.x = " + p.coord.x);
   console.log("p.coord.y = " + p.coord.y);
   console.log("p.coord.z = " + p.coord.z);
   console.log("p.heading = " + p.heading);
   console.log("p.tilt = " + p.tilt);

   /* LookAt 設定後、計算でずれてしまうので、再設定 */
   /* カメラの位置を優先する */
   view.camera.camera3D.position.x = pv1.x;
   view.camera.camera3D.position.y = pv1.y;
   view.camera.camera3D.position.z = pv1.z;

   console.log("===========");

   /* ビューを更新 */
   view.notifyChange();

}

function setupCameraSlider(view) {
    $('#camera_vfov_slider').slider();
    $('#camera_tilt_slider').slider(); /* Tilt スライダは反転させているので */
    $('#camera_pan_slider').slider();

    $('#camera_vfov_slider').slider("value", 30);
    $('#camera_tilt_slider').slider("value", -25); /* Tilt スライダは反転させているので */
    $('#camera_pan_slider').slider("value", 0);

    setupZoomSlider(view);
    setupTiltSlider(view);
    setupPanSlider(view);
    setupLatitudeSlider(view);
    setupLongitudeSlider(view);
    setupAltitudeSlider(view);

}

/* iTowns Camera VFov */
export function set_camera_vfov(val, view) 
{
  itownsCamera.setCameraVFov(parseFloat(val));
  console.log("iTowns Camera VFov = " + itownsCamera.getCameraVFov());

  /* iTowns カメラの垂直視野角を変更 */
  view.camera.camera3D.fov = itownsCamera.getCameraVFov();

  /* ビューを更新 */
  view.camera.camera3D.updateProjectionMatrix();

  /* ビューを更新 */
  view.notifyChange();
}

/* iTowns Camera Tilt */
export function set_camera_tilt(val, view, num=1) 
{
    //   let THREE = itowns.THREE;

    itownsCamera.setCameraTilt(parseFloat(val));
    console.log("iTowns Camera Tilt = " + itownsCamera.getCameraTilt());

    /* get current settings */
    let camera_px = view.camera.camera3D.position.x;
    let camera_py = view.camera.camera3D.position.y;
    let camera_pz = view.camera.camera3D.position.z;
    let pxyz = new itowns.Coordinates('EPSG:4978', parseFloat(camera_px), parseFloat(camera_py), parseFloat(camera_pz));
    let cxyz = pxyz.as('EPSG:4326');  // Geographic system
    itownsCamera.setCameraXPos(cxyz.longitude);
    itownsCamera.setCameraYPos(cxyz.latitude);
    itownsCamera.setCameraZPos(cxyz.altitude);

    /* get LookAt position */
    let p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
    itownsCamera.setCameraRange(p.range);
    itownsCamera.setCameraXLookAt(p.coord.x);
    itownsCamera.setCameraYLookAt(p.coord.y);
    itownsCamera.setCameraZLookAt(p.coord.z);
    itownsCamera.setCameraPan(-1 * p.heading);

    /* カメラ位置の計算 */
      calc_camera_position(ipCamera);

    /* カメラの移動 */
    if (num == 1) move_camera(view);

}

/* iTowns Camera Tilt mouse direction */
function set_camera_tilt_mouse_dir(prop) 
{
   mouseTiltDir = prop;
}

/* iTowns Camera Pan */
export function set_camera_pan(val, view, num=1) 
{
    //   let THREE = itowns.THREE;

    itownsCamera.setCameraPan(parseFloat(val));
    console.log("iTowns Camera Pan = " + itownsCamera.getCameraPan());

    /* get current settings */
    let camera_px = view.camera.camera3D.position.x;
    let camera_py = view.camera.camera3D.position.y;
    let camera_pz = view.camera.camera3D.position.z;
    let pxyz = new itowns.Coordinates('EPSG:4978', parseFloat(camera_px), parseFloat(camera_py), parseFloat(camera_pz));
    let cxyz = pxyz.as('EPSG:4326');  // Geographic system
    itownsCamera.setCameraXPos(cxyz.longitude);
    itownsCamera.setCameraYPos(cxyz.latitude);
    itownsCamera.setCameraZPos(cxyz.altitude);

    /* get LookAt position */
    let p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
    itownsCamera.setCameraRange(p.range);
    itownsCamera.setCameraXLookAt(p.coord.x);
    itownsCamera.setCameraYLookAt(p.coord.y);
    itownsCamera.setCameraZLookAt(p.coord.z);
    itownsCamera.setCameraTilt(-1 * p.tilt);

    /* カメラ位置の計算 */
      calc_camera_position(ipCamera);

    /* カメラの移動 */
    if (num == 1) move_camera(view);

}

/* iTowns Camera Vertical Fov (Zoom) */
function setupZoomSlider(view) {
  function setCameraVfov() {
      let sval = $('.param_camera_vfov').val();
      $('#camera_vfov_slider').slider("value", sval);
      set_camera_vfov(sval, view);
  }
  $('.param_camera_vfov').spinner({
      min: 1,
      step: 1,
      change: setCameraVfov,
      spin: setCameraVfov,
      stop: setCameraVfov
  });
  $('#camera_vfov_slider').slider({
      max:120,
      min:1,
      value:30,
      step:1,
      slide: function( event, ui ) {
          console.log("camera_vfov_slider = " + ui.value);
          $('.param_camera_vfov').val(ui.value);
          set_camera_vfov(ui.value, view);
      }
  });
}

/* iTowns Camera Tilt */
function setupTiltSlider(view) {
  function setCameraTilt() {
    let sval = $('.param_camera_tilt').val();
    // 数値以外は処理しない
    if (sval == "") {
    } else if (sval == "-") {
    } else if (!isFinite(sval)) {
    } else {
        if (sval <= -90 || 90<= sval) {
        } else {
            $('#camera_tilt_slider').slider("value", -1*sval);
            set_camera_tilt(sval, view);
        }
    }
  }
  $('.param_camera_tilt').spinner({
    max:90,
    min:-90,
    step: 0.01,
    change: setCameraTilt,
    spin: setCameraTilt,
    stop: setCameraTilt
  });
  $('#camera_tilt_slider').slider({
    max:90,
    min:-90,
    value:90,
    step:0.01,
    slide: function( event, ui ) {
      console.log("camera_tilt_slider = " + ui.value);
      $('.param_camera_tilt').val(-1 * ui.value);
      set_camera_tilt(-1 * ui.value, view);
    }
  });
  /* mouse direction */
  $('.param_camera_tilt_mouse_dir').on('change', function(){
    let prop = $('.param_camera_tilt_mouse_dir').prop('checked');
    console.log("Now change param_camera_tilt_mouse_dir = " + prop);
    set_camera_tilt_mouse_dir(prop);
  });
}

/* iTowns Camera Pan */
function setupPanSlider(view) {
  function setCameraPan() {
    let sval = $('.param_camera_pan').val();
    // 数値以外は処理しない
    if (sval == "") {
    } else if (sval == "-") {
    } else if (!isFinite(sval)) {
    } else {
      $('#camera_pan_slider').slider("value", sval);
      set_camera_pan(sval, view);
    }
  }
  $('.param_camera_pan').spinner({
    step: 0.01,
    change: setCameraPan,
    spin: setCameraPan,
    stop: setCameraPan
  });
  $('#camera_pan_slider').slider({
    max:180,
    min:-180,
    value:0,
    step:0.01,
    slide: function( event, ui ) {
      console.log("camera_pan_slider = " + ui.value);
      $('.param_camera_pan').val(-ui.value);
      set_camera_pan(-ui.value, view);
    }
  });
}

function setupLatitudeSlider(view) {
  $('.param_camera_lat').spinner({
    step: 0.01,
  });
}

function setupLongitudeSlider(view) {
  $('.param_camera_lon').spinner({
    step: 0.01,
  });
}

function setupAltitudeSlider(view) {
  $('.param_camera_alt').spinner({
    step: 10000,
  });
}

// パラメータ
export function getParam(cTime, sTime, eTime, view, appMenu) {

  /* ViewURLボタン */
  setupViewURL(cTime, sTime, eTime, view, appMenu);

}

/* ViewURLボタン */
function setupViewURL(cTime, sTime, eTime, view, appMenu) {
  $('.btn_view_url').on('click', function(){
    calc_camera_position(itownsCamera);
    const inurl = new URL(location).toString();
    let baseurl = inurl.substring(0, inurl.indexOf("?"));
    if(baseurl == '') baseurl = inurl;
    
    let layer_ids = getLayerIdsWithOpacity(appMenu);
    let inparam = $.nictSTARSViewURL.parseURL(inurl);

    let deleteLayers = sessionStorage.getItem("names");

    if(inparam["deleteLayers"]) {
      deleteLayers = deleteLayers + "," + inparam["deleteLayers"];
    } 

    inparam["st"]   = sTime;
    inparam["et"]   = eTime;
    inparam["ct"]   = cTime;
    // inparam["map_latitude"]   = ipCamera.getCameraYPos();
    // inparam["map_longitude"]  = ipCamera.getCameraXPos();
    // inparam["map_height"]  = ipCamera.getCameraZPos();
    inparam["map_latitude"]   = $('.param_camera_lat').val();
    inparam["map_longitude"]  = $('.param_camera_lon').val();
    inparam["map_height"]  = $('.param_camera_alt').val();
    inparam["zoom"] = $('.param_camera_vfov').val();
    inparam["tilt"] = $('.param_camera_tilt').val();
    inparam["heading"] = $('.param_camera_pan').val();
    inparam["layerIds"] = layer_ids;
    inparam["deleteLayers"] = deleteLayers;

    let strUurl = $.nictSTARSViewURL.createURL(baseurl, inparam);

    $("#view_url_input"    ).val    (strUurl);
    $("#view_url_input"    ).attr   ("aria-label" , strUurl );
    $("#view_url"          ).css    ("display" , "block");
    $(".input_group_button").trigger("click");

  });
}

/* Set Positionボタン */
function setupSetPosition(view) {
  $('.btn_set_position').on('click', function(){
    // latitudeの設定
    let latitude = parseFloat($('.param_camera_lat').val());

    // longitudeの設定
    let longitude = parseFloat($('.param_camera_lon').val());

    // altitudeの設定
    let altitude = parseFloat($('.param_camera_alt').val());

    // tiltの設定
    let tilt = Math.abs(parseFloat($('.param_camera_tilt').val()));

    // panの設定
    let heading = Math.abs(parseFloat($('.param_camera_pan').val()));

    let positionOnGlobe = new itowns.Coordinates('EPSG:4326', longitude, latitude, altitude);

    view.camera.setPosition(positionOnGlobe);

    set_camera_tilt(-tilt, view);
	  set_camera_pan(-heading, view);

    moveSlider();
  });
}

// 選択しているレイヤのidと透明度のリストを取得
function getLayerIdsWithOpacity(appMenu){
    const ret_ids = [];

    let source_id = "atmosphere";
    let source_op = 1;

    ret_ids.push(source_id.replace(' ', '%20') + ":" + String(source_op));

    for (let property in appMenu.colorGui.__folders) {
      if(appMenu.colorGui.__folders[property].__controllers[0]["object"]["visible"]) {
        source_id = property;
        source_op = appMenu.colorGui.__folders[property].__controllers[1].object.opacity;

        ret_ids.push(source_id.replace(' ', '%20') + ":" + String(source_op));
      };
    }

    // console.log(view);
    // console.log(view.tileLayer.attachedLayers);
    //  ret_ids = menuGlobe;
    // view.tileLayer.attachedLayers.forEach(function(l_info) {

    //     console.log(view.tileLayer.attachedLayers);

    //     let source_id = l_info.id;
    //     let source_op;
    //     let source_vi;
    //     if(source_id){
    //     source_op = l_info.opacity;
    //     source_vi = l_info.visible;

    //     // console.log(source_op);
    //     // console.log(source_vi);

    //     if(source_vi){
    //         // 半角スペースを%20に置換しておいてdecodeの際に＋に変換させない
    //         // ret_ids.push(source_id + ":" + String(source_op));
    //         ret_ids.push(source_id.replace(' ', '%20') + ":" + String(source_op));
    //     }
    //     }
    // });
    return ret_ids;
  }

  export function moveSlider() {
    $('#camera_tilt_slider').slider("value", -itownsCamera.getCameraTilt()); /* スライダは反転させているので */
    $('.param_camera_tilt').val(itownsCamera.getCameraTilt());
    $('#camera_pan_slider').slider("value", -itownsCamera.getCameraPan());
    $('.param_camera_pan').val(itownsCamera.getCameraPan());
  }

/* マウス操作 */
let vfovFactor = 1;  /* camera fov 移動量 (slider の刻みとあわせる必要あり）*/
let mouseDown = false;
let mouseLeftDown = false;
let mouseRightDown = false;
let mouseX;
let mouseY;

/* マウス操作と Pan/Tilt の向き */
let mousePanDir = true;     /* false : カメラ向き,  true : オブジェクト向き（同じ方向に動かす）*/
let mouseTiltDir = true;    /* false : カメラ向き,  true : オブジェクト向き（同じ方向に動かす）*/

/* mouse event の登録 */
function setupMouseEvent(view) 
{

  /* Mouse Wheel */
  viewerDiv.addEventListener('wheel', function _(e) { 
    console.log("----");
    console.log("Mouse Wheel");

    //オブジェクトのリサイズ処理
    resize_obj(view);

    if (event.shiftKey) {
    
      let delta = e.wheelDelta;
      let val;
      if (delta > 0) {
        val = itownsCamera.getCameraVFov() - vfovFactor;
      }
      else {
        val = itownsCamera.getCameraVFov() + vfovFactor;
      }
      if (val < 1) val = 1;
      set_camera_vfov(val, view);
      $('.param_camera_vfov').val(itownsCamera.getCameraVFov());
      $('#camera_vfov_slider').slider("value", itownsCamera.getCameraVFov());
      set_camera_tilt(itownsCamera.getCameraTilt(), view, 0); // マウスのときは計算だけして動かさない

    }
  }, false);

  /* Mouse Down */
  viewerDiv.addEventListener('mousedown', function _(e) { 
    console.log("Mouse Down");
    mouseDown = true;
    if (e.button == 0) {
      mouseLeftDown = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
    if (e.button == 2) {
      mouseRightDown = true;
    }
  }, false);

  /* Move Move */
  viewerDiv.addEventListener('mousemove', function _(e) { 

    //console.log("Move Move");

    if (mouseLeftDown) {
      let val1;
      let val2;
      let ex = e.clientX;
      let ey = e.clientY;
      let dx = mouseX - ex;
      let dy = mouseY - ey;

      let currentZoom = itownsCamera.getCameraVFov();
      let ratio = 0.025;
      if (currentZoom < 2) {
        ratio = 0.001;
      } else if (currentZoom < 10) {
        ratio = 0.005;
      } else if (currentZoom < 20) {
        ratio = 0.01;
      }

      val1 = itownsCamera.getCameraPan() - dx * ratio; 
      $('.param_camera_pan').val(itownsCamera.getCameraPan());
      $('#camera_pan_slider').slider("value", itownsCamera.getCameraPan());


      val2 = itownsCamera.getCameraTilt() - dy * ratio; 
      $('.param_camera_tilt').val(itownsCamera.getCameraTilt());
      $('#camera_tilt_slider').slider("value", -1*itownsCamera.getCameraTilt());

      // 上下、左右、大きい方だけの処理をやめ、どちらも常に計算する
      if (mousePanDir) {
          val1 = itownsCamera.getCameraPan() + dx * ratio; 
      } else {
          val1 = itownsCamera.getCameraPan() - dx * ratio; 
      }
      val1 = Math.round (val1 * 100) / 100;
      set_camera_pan(val1, view, 0); // マウスのときは計算だけして動かさない
      $('.param_camera_pan').val(itownsCamera.getCameraPan());
      $('#camera_pan_slider').slider("value", itownsCamera.getCameraPan());

      if (mouseTiltDir) {
          val2 = itownsCamera.getCameraTilt() - dy * ratio; 
      } else {
          val2 = itownsCamera.getCameraTilt() + dy * ratio; 
      }
      val2 = Math.round (val2 * 100) / 100;
      if (val2 < -90) val2 = -90;
      set_camera_tilt(val2, view, 0); // マウスのときは計算だけして動かさない
      $('.param_camera_tilt').val(itownsCamera.getCameraTilt());
      $('#camera_tilt_slider').slider("value", -1*itownsCamera.getCameraTilt());
    }
  }, false);
    
  /* Mouse Up */
  viewerDiv.addEventListener('mouseup', function _(e) { 
    mouseDown = false;
    mouseLeftDown = false;
    mouseRightDown = false;
    outupt_view_position(view);

    resize_obj(view);

  }, false);

  /* Mouse Out */
  viewerDiv.addEventListener('mouseout', function _(e) { 
    mouseDown = false;
    mouseLeftDown = false;
    mouseRightDown = false;
  }, false);

  /* カメラ初期値の角度を設定する */
  window.addEventListener('DOMContentLoaded', function _(e) { 
    set_camera_tilt_reset(view);
  }, false);
}

/* ■view位置の出力 */
function outupt_view_position(view) 
{
  console.log("---- outupt_view_position ----");
  console.log("-----");

  let x;
  let y;
  let z;
  let pxyz = new itowns.Coordinates('EPSG:4978', parseFloat(view.camera.camera3D.position.x), parseFloat(view.camera.camera3D.position.y), parseFloat(view.camera.camera3D.position.z));
  let cxyz = pxyz.as('EPSG:4326');  // Geographic system
  x = cxyz.longitude;
  y = cxyz.latitude;
  z = cxyz.altitude;
  console.log("view pos x = " + x + " y = " + y + " z = " + z);
  console.log("-----");

  // latitude
  $('.param_camera_lat').val(y);
  // longitude
  $('.param_camera_lon').val(x);
  // altitude
  $('.param_camera_alt').val(z);

}

function set_camera_tilt_reset(view)
{
  let inurl = new URL(location).toString();
  let inparam = $.nictSTARSViewURL.parseURL(inurl);

  let latitude = ipCamera.cameraYPos;
  let longitude = ipCamera.cameraXPos;
  let altitude = ipCamera.cameraZPos;
  let tilt = ipCamera.cameraTilt;
  let zoom = ipCamera.cameraVFov;
  let heading = ipCamera.cameraPan;

  $('.param_camera_lat').val(latitude);
  $('.param_camera_lon').val(longitude);
  $('.param_camera_alt').val(altitude);
  $('.param_camera_tilt').val(tilt);
  $('.param_camera_vfov').val(zoom);
  $('.param_camera_pan').val(heading);
  
  // パラメータがある時
  if(inparam["map_latitude"] != null && inparam["map_latitude"] != ""){
    latitude = parseFloat(inparam["map_latitude"]);
    $('.param_camera_lat').val(latitude);
  }
  if(inparam["map_longitude"] != null && inparam["map_longitude"] != ""){
    longitude = parseFloat(inparam["map_longitude"]);
    $('.param_camera_lon').val(longitude);
  }
  if(inparam["map_height"] != null && inparam["map_height"] != ""){
    altitude = parseFloat(inparam["map_height"]);
    $('.param_camera_alt').val(altitude);
  }
  if(inparam["zoom"] != null && inparam["zoom"] != ""){
    zoom = parseFloat(inparam["zoom"]);
    $('.param_camera_vfov').val(zoom);
  }
  if(inparam["tilt"] != null && inparam["tilt"] != ""){
    tilt = parseFloat(inparam["tilt"]);
    $('.param_camera_tilt').val(tilt);
  }
  if(inparam["heading"] != null && inparam["heading"] != ""){
    heading = parseFloat(inparam["heading"]);
    $('.param_camera_pan').val(heading);
  }

  let positionOnGlobe = new itowns.Coordinates('EPSG:4326', longitude, latitude, altitude);
  view.camera.setPosition(positionOnGlobe);

  set_camera_vfov(zoom, view);
  set_camera_pan(heading, view);
  set_camera_tilt(tilt, view);

  moveSlider();
}

// ボタンの欄にも開閉機能を追加しました
export function setupCameraPanels(view) {
  $("#open_camera").click(function(){
    console.log("Now click open_camear");
    $("#camera_div").slideToggle(1, function() {
      let status = ($("#camera_div").is(':hidden'));
      console.log("Current camera_div = " + status);
      if (status) {
        $('#camera_param').css('height', '25px');
        $('#camera_param').css('width', '95px');
      } else {
        $('#camera_param').css('height', '410px');
        $('#camera_param').css('width', '200px');
      }
      if($("#open_camera").children('i').is('.fa-minus')){
        $("#open_camera").children('i').removeClass();
        $("#open_camera").children('i').addClass('fa fa-plus fa-lg');
      } else {
        $("#open_camera").children('i').removeClass();
        $("#open_camera").children('i').addClass('fa fa-minus fa-lg');
      }
    });
  });

  setupMouseEvent(view);

  setupCameraSlider(view);

  setupSetPosition(view);
}

// STARS同期
export function setupStarsSynchro(viewerDiv, view) {

  // STARScontroller_updateDate
  function STARScontroller_updateDate(pDate){
    updateDate(pDate);
  }

  // controller.js isReady()
  window.STARScontroller_isReady = function() {
    if(!viewerDiv || viewerDiv == undefined) {
      return false;
    } else {
      return true;
    }
  };

  // controller.js getPosition()
  window.STARScontroller_getPosition = function() {
    let p = itowns.CameraUtils.getTransformCameraLookingAtTarget(view, view.camera.camera3D);
    let objResult = {center:{lat:0, lng:0}};

    if (p) {

      objResult.center.lat = p.coord.y;
      objResult.center.lng = p.coord.x;

      objResult.north      = wgapp.north;
      objResult.east       = wgapp.east;
      objResult.south      = wgapp.south;
      objResult.west       = wgapp.west;
      objResult.zoom       = p.range;
      objResult.direction  = p.heading;
      objResult.pitch      = p.tilt; // Math.min(90 - p.tilt, 60);
      return objResult;
    } else {
      return null;
    }
  };

  // controller.js setPosition()
  window.STARScontroller_setPosition = function(pPosition) {
    console.log("STARScontroller_getPosition::pPosition=" + pPosition);
    wgapp = JSON.parse(JSON.stringify(pPosition));

    var positionOnGlobe = new itowns.Coordinates('EPSG:4326', pPosition.center.lng, pPosition.center.lat);

    //カメラ位置・角度設定
    var options = {
      coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
      //tilt: pPosition.pitch, //地球表面とカメラのなす角 デフォルトは垂直で90
      tilt: pPosition.pitch, // 90 - pPosition.pitch, //地球表面とカメラのなす角 デフォルトは垂直で90
      heading: pPosition.direction, //回転
      range: pPosition.zoom,
      time: 0, //アニメーションの長さ（ミリ秒）
      stopPlaceOnGroundAtEnd:0 //アニメーション終了時にターゲットを地面に配置するのを停止
    };

    itowns.CameraUtils.transformCameraToLookAtTarget(view, view.camera.camera3D, options);//すぐ移動
  };

  // STARScontroller.js STARScontroller_getDate()
  window.STARScontroller_getDate = function() {
    var objOptions = $("#timeline").k2goTimeline("getOptions");
    var objTimeInfo = {};
    
    objTimeInfo.currentDate = objOptions.currentTime;
    objTimeInfo.startDate   = objOptions.startTime;
    objTimeInfo.endDate     = objOptions.endTime;
    
    return objTimeInfo;
  };

  // STARScontroller.js STARScontroller_setDate()
  window.STARScontroller_setDate = function(pDate) {
    if ($Env.starting == true)
    {
      if ($("#current_time").hasClass("timeNowPlay")) {$("#current_time").trigger("click")}
      else                                            {$("#button_stop" ).trigger("click")} 
    }
    else
    {  
      var objTimeInfo = {};
      
      objTimeInfo.minTime     = new Date($Env.minTime     .getTime());
      objTimeInfo.maxTime     = new Date($Env.maxTime     .getTime());
      objTimeInfo.startTime   = new Date($Env.minTime     .getTime() > pDate.startDate.getTime() ? $Env.minTime.getTime() : pDate.startDate.getTime());
      objTimeInfo.endTime     = new Date($Env.maxTime     .getTime() < pDate.endDate  .getTime() ? $pEnv.maxTime.getTime() : pDate.endDate  .getTime());
      objTimeInfo.currentTime = new Date(pDate.currentDate.getTime());
      
      if (objTimeInfo.currentTime.getTime() < objTimeInfo.startTime.getTime()) objTimeInfo.currentTime.setTime(objTimeInfo.startTime.getTime());
      if (objTimeInfo.currentTime.getTime() > objTimeInfo.endTime  .getTime()) objTimeInfo.currentTime.setTime(objTimeInfo.endTime  .getTime());
      
      $Env.creating = true;
      $("#lockWindow").addClass("show");
      
      $("#timeline").k2goTimeline("create", {
        timeInfo :
        {
          minTime     : objTimeInfo.minTime,
          maxTime     : objTimeInfo.maxTime,
          startTime   : objTimeInfo.startTime,
          endTime     : objTimeInfo.endTime,
          currentTime : objTimeInfo.currentTime
        },
        callback : function(pTimeInfo)
        {
          fnc.adjustRangeBar();
          $Env.creating = false;
          $("#lockWindow").removeClass("show");
        }
      });
    }
  };

};

export function resize_obj(view) {

  //オブジェクトのリサイズ処理
  if(view.mesh) {
    let camerainfo = itowns.CameraUtils.getTransformCameraLookingAtTarget(
      view,
      view.camera.camera3D,
    );   
    if(camerainfo.range >= 1000) {
      let objs = view.mesh;
      objs.traverse((m) => {
        if(m.type == "Mesh") {
          let obj = m;
          if(m.geometry.type == "TextGeometry") {
            obj.scale.setScalar(camerainfo.range / 2500);
            obj.quaternion.copy(view.camera.camera3D.quaternion);
          } else {
            obj.scale.setScalar(camerainfo.range / 10000);
          }
          obj.updateMatrixWorld();
        }
      });
    } else {
      let objs = view.mesh;
      objs.traverse((m) => {
        if(m.type == "Mesh") {
          let obj = m;
          if(m.geometry.type == "TextGeometry") {
            obj.scale.setScalar(camerainfo.range / 2500);
            obj.quaternion.copy(view.camera.camera3D.quaternion);
          } else {
            obj.scale.setScalar(1000 / 10000);
          }
          obj.updateMatrixWorld();
        }
      });
    }
  }
}