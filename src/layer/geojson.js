import { resize_obj } from "../camera/camera";

export function addgeo_obj(itowns, globeView, time1, time2) {
    if("mesh" in globeView) {

        let data = JSON.parse(sessionStorage.getItem('json'));
        let env_data = JSON.parse(sessionStorage.getItem('env_json'));
        let starttime = time1;
        let endtime = time2;

        createObject(itowns, globeView, endtime, starttime, data, env_data);
    }
}

// オブジェクトの作成関数
export function createObject(itowns, globeView, endtime, starttime, searchdata, env_data) {

    let camerainfo = itowns.CameraUtils.getTransformCameraLookingAtTarget(
        globeView,
        globeView.camera.camera3D,
    );

    let coordinates;
    let alt;
    let type;
    let shape;
    let course;
    let speed;
    let objColor;
    let labelFlag;

    if (searchdata) {

        //オブジェクトの作成
        const points = new THREE.Group();

        // for(let s=0; s<searchdata.length; s++) {
        for(let s=searchdata.length-1; s>=0; s--) {

            if(searchdata[s][1] <= endtime && searchdata[s][1] >= starttime) {

                if(type && searchdata[s][4] === type) {
                    labelFlag = false;
                } else {
                    labelFlag = true;
                }

                coordinates = searchdata[s][0]; // 経度・緯度
                alt = searchdata[s][5]; // 高さ
                type = searchdata[s][4]; // 車種
                shape = searchdata[s][7]; // 形状
                course = searchdata[s][2]; // 方向
                speed = searchdata[s][3]; // スピード
                objColor = searchdata[s][6]; //色

                let bargraph_height = searchdata[s][3] * 500 + 10;

                let newTime = toDate(String(endtime));
                let oldTime = toDate(String(searchdata[s][1]));
                newTime = newTime.getTime();
                oldTime = oldTime.getTime();

                let objOpacity = 1-(newTime-oldTime)/(newTime - toDate(String(starttime)).getTime());
                if(objOpacity < 0) {
                    objOpacity = 0;
                }                 

                let geometry;
                switch(shape) {
                    case 'square':
                        geometry = new THREE.BoxGeometry(100, 30, 40);
                        break;
                    case 'point':
                        geometry = new THREE.SphereGeometry(30, 32, 16);
                        break;
                    // アメダスに対応
                    case '3dbargraph':
                        geometry = new THREE.CylinderGeometry(30, 30, bargraph_height, 30)
                            break;
                    default:
                        geometry = new THREE.SphereGeometry(30, 32, 16);
                        break;
                }
                let material;
                if(objColor) {
                    material = new THREE.MeshBasicMaterial({ color: objColor, transparent: true, opacity: objOpacity });
                } else {
                    if(shape !== "3dbargraph") {
                        switch(type) {
                            case 1:
                                material = new THREE.MeshBasicMaterial({ color: 0x32cd32, transparent: true, opacity: objOpacity });
                                break;
                            case 2:
                                material = new THREE.MeshBasicMaterial({ color: 0x191970, transparent: true, opacity: objOpacity });
                                break;
                            case 3:
                                material = new THREE.MeshBasicMaterial({ color: 0xffa07a, transparent: true, opacity: objOpacity });
                                break;
                            case 4:
                                material = new THREE.MeshBasicMaterial({ color: 0x8b4513, transparent: true, opacity: objOpacity });
                                break;
                            case 5:
                                material = new THREE.MeshBasicMaterial({ color: 0x2f4f4f, transparent: true, opacity: objOpacity });
                                break;
                            case 6:
                                material = new THREE.MeshBasicMaterial({ color: 0xc71585, transparent: true, opacity: objOpacity });
                                break;
                            case 7:
                                material = new THREE.MeshBasicMaterial({ color: 0xd2691e, transparent: true, opacity: objOpacity });
                                break;
                            default:
                                material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: objOpacity });
                                break;
                        }
                    } else {
                        if(env_data.target_data === "precipitation24h") {
                            if(speed < 50) {
                                material = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: objOpacity });
                            } else if(50 <= speed && speed < 100) {
                                material = new THREE.MeshBasicMaterial({ color: 0xA0D2FF, transparent: true, opacity: objOpacity });
                            } else if(100 <= speed && speed < 150) {
                                material = new THREE.MeshBasicMaterial({ color: 0x2190FF, transparent: true, opacity: objOpacity });
                            } else if(150 <= speed && speed < 200) {
                                material = new THREE.MeshBasicMaterial({ color: 0x0041FF, transparent: true, opacity: objOpacity });
                            } else if(200 <= speed && speed < 250) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFFF500, transparent: true, opacity: objOpacity });
                            } else if(250 <= speed && speed < 300) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFF9900, transparent: true, opacity: objOpacity });
                            } else if(300 < speed) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFF2800, transparent: true, opacity: objOpacity });
                            } else {
                                material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: objOpacity });
                            }

                        } else if(env_data.target_data === "temp") {
                            if(speed < -5) {
                                material = new THREE.MeshBasicMaterial({ color: 0x002080, transparent: true, opacity: objOpacity });
                            } else if(-5 <= speed && speed < 0) {
                                material = new THREE.MeshBasicMaterial({ color: 0x0041FF, transparent: true, opacity: objOpacity });
                            } else if(0 <= speed && speed < 5) {
                                material = new THREE.MeshBasicMaterial({ color: 0x0096FF, transparent: true, opacity: objOpacity });
                            } else if(5 <= speed && speed < 10) {
                                material = new THREE.MeshBasicMaterial({ color: 0xB9EBFF, transparent: true, opacity: objOpacity });
                            } else if(10 <= speed && speed < 15) {
                                material = new THREE.MeshBasicMaterial({ color: 0x797B7D, transparent: true, opacity: objOpacity });
                            } else if(15 <= speed && speed < 20) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFFFF96, transparent: true, opacity: objOpacity });
                            } else if(20 <= speed && speed < 25) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFFF500, transparent: true, opacity: objOpacity });
                            } else if(25 <= speed && speed < 30) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFF9900, transparent: true, opacity: objOpacity });
                            } else if(30 <= speed && speed < 35) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFF2800, transparent: true, opacity: objOpacity });
                            } else if(35 <= speed) {
                                material = new THREE.MeshBasicMaterial({ color: 0x6C0068, transparent: true, opacity: objOpacity });
                            } else {
                                material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: objOpacity });
                            }
                        } else if(env_data.target_data === "snow") {
                            if(speed < 1) {
                                material = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: objOpacity });
                            } else if(1 <= speed && speed < 5) {
                                material = new THREE.MeshBasicMaterial({ color: 0xA0D2FF, transparent: true, opacity: objOpacity });
                            } else if(5 <= speed && speed < 20) {
                                material = new THREE.MeshBasicMaterial({ color: 0x2190FF, transparent: true, opacity: objOpacity });
                            } else if(20 <= speed && speed < 50) {
                                material = new THREE.MeshBasicMaterial({ color: 0x0041FF, transparent: true, opacity: objOpacity });
                            } else if(50 <= speed && speed < 100) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFFF500, transparent: true, opacity: objOpacity });
                            } else if(100 <= speed && speed < 150) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFF9900, transparent: true, opacity: objOpacity });
                            } else if(150 <= speed && speed < 200) {
                                material = new THREE.MeshBasicMaterial({ color: 0xFF2800, transparent: true, opacity: objOpacity });
                            } else if(200 <= speed) {
                                material = new THREE.MeshBasicMaterial({ color: 0xB40068, transparent: true, opacity: objOpacity });
                            } else {
                                material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: objOpacity });
                            }
                        } else {
                            // 何もしない
                        }
                    }
                }
                let mesh = new THREE.Mesh(geometry, material);

                if(!coordinates) {
                    continue;
                }

                if(!alt) {
                    let b_coord = new itowns.Coordinates("EPSG:4326", coordinates[0], coordinates[1]);
                    let alt_result = getaltitude(itowns, globeView, b_coord);
                    alt = alt_result ? alt_result : 120;
                }
                
                let coord = new itowns.Coordinates("EPSG:4326", coordinates[0], coordinates[1], alt);

                mesh.position.copy(coord.as(globeView.referenceCrs));
                mesh.lookAt(new THREE.Vector3(0, 0, 0));
                mesh.rotateX(Math.PI / 2);

                if(camerainfo.range >= 1000) {
                    mesh.scale.setScalar(camerainfo.range / 10000);
                } else {
                    mesh.scale.setScalar(1000 / 10000);
                }

                // 方角の設定
                mesh.rotateY(course);

                // update coordinate of the mesh
                mesh.updateMatrixWorld();
                points.add(mesh);

                if(shape !== "3dbargraph") {

                    // 棒グラフ表示
                    let Cylinder_height = speed * 100;
                    let Cylinder_geometry = new THREE.CylinderGeometry(10, 10, Cylinder_height, 30);
                    let Cylinder_material;

                    // 棒グラフの色分け
                    if(speed === null) {
                        Cylinder_material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: objOpacity });
                    } else {
                        if(speed <= 5) {
                            Cylinder_material = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: objOpacity });
                        } else if(5 < speed && speed <= 10) {
                            Cylinder_material = new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: objOpacity });
                        } else if(10 < speed && speed <= 20) {
                            Cylinder_material = new THREE.MeshBasicMaterial({ color: 0x008080, transparent: true, opacity: objOpacity });
                        } else if(20 < speed && speed <= 30) {
                            Cylinder_material = new THREE.MeshBasicMaterial({ color: 0x669900, transparent: true, opacity: objOpacity });
                        } else if(30 < speed && speed <= 40) {
                            Cylinder_material = new THREE.MeshBasicMaterial({ color: 0xFF9900, transparent: true, opacity: objOpacity });
                        } else if(40 < speed && speed <= 50) {
                            Cylinder_material = new THREE.MeshBasicMaterial({ color: 0xFF3366, transparent: true, opacity: objOpacity });
                        } else if(50 < speed) {
                            Cylinder_material = new THREE.MeshBasicMaterial({ color: 0xf60807, transparent: true, opacity: objOpacity });
                        }
                    }

                    let Cylinder_mesh = new THREE.Mesh(Cylinder_geometry, Cylinder_material);

                    Cylinder_mesh.position.copy(coord.as(globeView.referenceCrs));
                    Cylinder_mesh.lookAt(new THREE.Vector3(0, 0, 0));
                    Cylinder_mesh.rotateX(Math.PI / 2);

                    if(camerainfo.range >= 1000) {
                        Cylinder_mesh.scale.setScalar(camerainfo.range / 10000);
                    } else {
                        Cylinder_mesh.scale.setScalar(1000 / 10000);
                    }

                    Cylinder_mesh.updateMatrixWorld();

                    points.add(Cylinder_mesh);
                }

                // ラベルの表示
                if(labelFlag && type) {
                    const textMesh = new TextGeometry(String(type), {
                        font: window.fontdata,
                        size: 20,
                        height: 5
                    });

                    const textMaterial = new THREE.MeshBasicMaterial({ color: 0X000000, transparent: true, opacity: objOpacity });
                    const text = new THREE.Mesh(textMesh, textMaterial);

                    // const text = new THREE.Mesh(textMesh, Cylinder_material);

                    let coordy = new itowns.Coordinates("EPSG:4326", coordinates[0], coordinates[1], alt + 2);

                    text.position.copy(coordy.as(globeView.referenceCrs));   // Meshの位置を設定
                    text.lookAt(new THREE.Vector3(0, 0, 0));
                    text.rotateX(Math.PI / 2);
                    text.rotateY(180*Math.PI / 180);
                    text.rotateZ(180*Math.PI / 180); 
                    text.quaternion.copy(globeView.camera.camera3D.quaternion);// Meshの拡大縮小設定

                    if(camerainfo.range >= 1000) {
                        text.scale.setScalar(camerainfo.range / 2500);
                    } else {
                        text.scale.setScalar(camerainfo.range / 2500);
                    }
                    
                    text.updateMatrixWorld();
                    points.add(text);
                }

            }

        }

        // add the mesh to the scene
        globeView.scene.remove(globeView.mesh);
        if(globeView.mesh) {  
            for(let i = 0; i < globeView.mesh.children.length; i++) {
                globeView.mesh.children[i].material.dispose();
                globeView.mesh.children[i].geometry.dispose();
            };
        }
        
        globeView.scene.add(points);

        // make the object usable from outside of the function
        globeView.mesh = points;
        globeView.notifyChange();

        return 'success';

    } else {
        return 'false';
    }
}

// 標高データ(取得はまだできていない)
function getaltitude(itowns, _view, b_coord) {
    let e_layer = _view.getLayers(l => l.isTiledGeometryLayer && l.visible)[0];
    let elevation = itowns.DEMUtils.getElevationValueAt(e_layer, b_coord);
    return elevation;
}

// 読み込んだjsonを表示しやすい形に作り変える
export function setupJson(data) {
    let searchdata = [];
    for(let i = 0; i < data["data_array"].length; i++) {
        for(let j = 0;  j < Object.keys(data["data_array"][i]["features"][0]["properties"]["datetime"]).length; j++) {
            let objData = [];

            objData.push(data["data_array"][i]["features"][0]["geometry"]["coordinates"][j]); // 0:緯度・経度
            objData.push(data["data_array"][i]["features"][0]["properties"]["datetime"][j]); // 1:時間
            objData.push(data["data_array"][i]["features"][0]["properties"]["direction"][j]); // 2:方向
            objData.push(data["data_array"][i]["features"][0]["properties"]["speed"][j]); // 3:スピード
            objData.push(data["data_array"][i]["features"][0]["properties"]["identifier"]); // 4:車種
            
            // 5:高さ情報があれば配列にいれる、無ければ固定値を入れる
            if(data["data_array"][i]["features"][0]["geometry"]["height"]) {
                objData.push(data["data_array"][i]["features"][0]["geometry"]["height"]);
            } else {
                objData.push(null);
            }

            // 6:色情報があれば配列にいれる、無ければ固定値を入れる
            if(data["data_array"][i]["features"][0]["properties"]["color"]) {
                objData.push(data["data_array"][i]["features"][0]["properties"]["color"]);
            } else {
                objData.push(null);
            }

            // 7:形情報があれば配列にいれる、無ければ固定値を入れる
            if(data["data_array"][i]["features"][0]["properties"]["shape"]) {
                objData.push(data["data_array"][i]["features"][0]["properties"]["shape"]);
            } else {
                if(data["data_array"][i]["features"][0]["properties"]["direction"][j] != null) {
                    objData.push("square");
                } else {
                    objData.push(null);
                }
            }

            searchdata.push(objData);
        }
    }
    sessionStorage.setItem('json', JSON.stringify(searchdata));

    // その他設定情報
    let objEnv = {};
    objEnv.end_date    = data.end_date;
    objEnv.map_bearing = data.map_bearing;
    objEnv.map_center  = data.map_center;
    objEnv.map_pitch   = data.map_pitch;
    objEnv.map_zoom    = data.map_zoom;
    objEnv.start_date  = data.start_date;
    objEnv.source_id   = data.source_id;
    sessionStorage.setItem('env_json', JSON.stringify(objEnv));
}

export function setupMFJson(data) {
    let searchdata = [];
    // let maxTime;
    // let minTime;

    // 「2022_point_mv.json」に対応
    if(data.temporalGeometry) {

        for(let i = 0; i < Object.keys(data.temporalGeometry.datetimes).length; i++) {
            let objData = [];

            // 「2022_polygon_mv.json」に対応
            if(Array.isArray(data.temporalGeometry.coordinates[i])) {
                if(Array.isArray(data.temporalGeometry.coordinates[i][0])) {
                    objData.push(data.temporalGeometry.coordinates[i][0][0]); // 0:緯度・経度
                } else {
                    objData.push(data.temporalGeometry.coordinates[i]); // 0:緯度・経度
                }
            
                objData.push(data.temporalGeometry.datetimes[i].replace(/[^0-9]/g, '')); // 1:時間
                objData.push(null); // 2:方向
                objData.push(null); // 3:スピード
                objData.push(null); // 4:車種
                objData.push(null); // 5:高さ
                objData.push(null); // 6:色
                objData.push(null); // 7:形              

                searchdata.push(objData);
            } else {
                console.log("座標が配列として入っていないので、オブジェクトを登録できません。");
            }
        }

    // 「2022_trajectory.json」に対応
    } else if(data.geometry) {
        for(let i = 0; i < data.properties.datetimes.length; i++) {
            let objData = [];

            objData.push(data.geometry.coordinates[i]); // 0:緯度・経度
            objData.push(data.properties.datetimes[i].replace(/[^0-9]/g, '')); // 1:時間
            objData.push(null); // 2:方向
            objData.push(null); // 3:スピード
            objData.push(null); // 4:車種
            objData.push(null); // 5:高さ
            objData.push(null); // 6:色
            objData.push(null); // 7:形              

            searchdata.push(objData);
        }
    // 「2021_台風_ALL.json」に対応    
    } else {
        for(let i = 0; i < Object.keys(data).length-1; i++) {
            for(let j = 0; j < data[i].temporalGeometry.datetimes.length; j++) {

                let objData = [];
                let coods = [];

                if
                (-90 <= data[i].temporalGeometry.coordinates[j][0] && data[i].temporalGeometry.coordinates[j][0] <= 90 
                    || -180 <= data[i].temporalGeometry.coordinates[j][1] && data[i].temporalGeometry.coordinates[j][1] <= 180
                ) 
                {
                    coods.push(data[i].temporalGeometry.coordinates[j][1]);
                    coods.push(data[i].temporalGeometry.coordinates[j][0]);
                }

                objData.push(coods); // 0:緯度・経度
                objData.push(data[i].temporalGeometry.datetimes[j].replace(/[^0-9]/g, '')); // 1:時間
                objData.push(null); // 2:方向
                objData.push(null); // 3:スピード
                objData.push(data[i].properties.name); // 4:車種
                objData.push(null); // 5:高さ
                objData.push(null); // 6:色
                objData.push(null); // 7:形              

                searchdata.push(objData);
            }
        }
    }
    sessionStorage.setItem('json', JSON.stringify(searchdata));

    // その他設定情報
    let objEnv = {};
    objEnv.end_date    = String(searchdata[searchdata.length - 1][1]);
    objEnv.map_bearing = 0;
    objEnv.map_center  = String(searchdata[0][0]);
    objEnv.map_pitch   = 30;
    objEnv.map_zoom    = 25;
    objEnv.start_date  = String(searchdata[0][1]);
    sessionStorage.setItem('env_json', JSON.stringify(objEnv));
}

// CSVファイルへの対応
export function setupCSV(data) {
    let searchdata = [];

    for(let i = 1; i < data[0].length; i++) {
        let objData = [];

        objData.push([Number(data[i].split(",")[6]), Number(data[i].split(",")[5])]); // 0:緯度・経度
        objData.push(data[i].split(",")[8].replace(/[^0-9]/g, '')); // 1:時間
        objData.push(data[i].split(",")[2]); // 2:方向
        objData.push(5); // 3:スピード
        objData.push(data[i].split(",")[16]); // 4:車種
        objData.push(Number(data[i].split(",")[0])); // 5:高さ
        objData.push(null); // 6:色

        if(data[i].split(",")[2] != null) {
            objData.push("square"); // 7:形
        } else {
            objData.push(null); // 7:形
        }
        
        searchdata.push(objData);
    }
    sessionStorage.setItem('json', JSON.stringify(searchdata));

    // その他設定情報
    let objEnv = {};
    objEnv.end_date    = String(searchdata[searchdata.length - 1][1]);
    objEnv.map_bearing = 0;
    objEnv.map_center  = String(searchdata[0][0]);
    objEnv.map_pitch   = 30;
    objEnv.map_zoom    = 25;
    objEnv.start_date  = String(searchdata[0][1]);
    sessionStorage.setItem('env_json', JSON.stringify(objEnv));
    
}

// アメダスへの対応
export function setupAmedasJson(data) {
    let searchdata = [];

    for(let i = 0; i < data["data_array"].length; i++) {
        for(let j = 0;  j < Object.keys(data["data_array"][i]["features"][0]["properties"]["datetime"]).length; j++) {
            let objData = [];

            objData.push(data["data_array"][i]["features"][0]["geometry"]["coordinates"][j]); // 0:緯度・経度
            objData.push(data["data_array"][i]["features"][0]["properties"]["datetime"][j]); // 1:時間
            objData.push(null); // 2:方向

            // 3:棒グラフの高さにする値
            if(data["data_array"][i]["features"][0]["properties"]["precipitation24h"]) {
                objData.push(data["data_array"][i]["features"][0]["properties"]["precipitation24h"][j]);
            } else if(data["data_array"][i]["features"][0]["properties"]["temp"]) {
                objData.push(data["data_array"][i]["features"][0]["properties"]["temp"][j]);
            } else if(data["data_array"][i]["features"][0]["properties"]["snow"]) {
                objData.push(data["data_array"][i]["features"][0]["properties"]["snow"][j]);
            }
            
            objData.push(data["data_array"][i]["features"][0]["properties"]["kjname"]); // 4:種別
            
            // 5:高さ情報があれば配列にいれる、無ければ固定値を入れる
            if(data["data_array"][i]["features"][0]["geometry"]["height"]) {
                objData.push(data["data_array"][i]["features"][0]["geometry"]["height"]);
            } else {
                objData.push(null);
            }

            // 6:色情報があれば配列にいれる、無ければ固定値を入れる
            if(data["data_array"][i]["features"][0]["properties"]["color"]) {
                objData.push(data["data_array"][i]["features"][0]["properties"]["color"]);
            } else {
                objData.push(null);
            }

            // 7:形情報があれば配列にいれる、無ければ固定値を入れる
            if(data["data_array"][i]["features"][0]["properties"]["shape"]) {
                objData.push(data["data_array"][i]["features"][0]["properties"]["shape"]);
            } else {
                objData.push("3dbargraph");
            }

            searchdata.push(objData);
        }
    }
    sessionStorage.setItem('json', JSON.stringify(searchdata));

    // その他設定情報
    let objEnv = {};
    objEnv.end_date    = data.end_date;
    objEnv.map_bearing = data.map_bearing;
    objEnv.map_center  = data.map_center;
    if(data.map_pitch === "0") {
        objEnv.map_pitch   = 25;
    } else {
        objEnv.map_pitch   = data.map_pitch;
    }
    objEnv.map_zoom    = data.map_zoom;
    objEnv.start_date  = data.start_date;
    objEnv.source_id   = data.source_id;
    objEnv.target_data   = data.target_data;
    sessionStorage.setItem('env_json', JSON.stringify(objEnv));
}

// 日進市のデータを表示する関数
export function addMF_JSON(_view, sourceId, syataiLagend, targetData, amedasRainVis, amedasTempVis, amedasSnowVis) {
    let objData = JSON.parse(sessionStorage.getItem('json'));
    let objEnvData = JSON.parse(sessionStorage.getItem('env_json'));

    //時間で絞り込み
    let timelineStartTime = objEnvData.start_date; // タイムラインの左端時間
    let timelineEndTTime = objEnvData.end_date; // タイムラインの右端時間

    let objDateTime = objData.map(function( value ) {
        if(value[1]) {
            return Number(value[1]);
        }
    });
    
    let rangeStartTime = String(Math.min.apply(null, objDateTime)); // レンジバーの開始時間

    if(Number(rangeStartTime) < Number(timelineStartTime + "00")) {
        rangeStartTime = timelineStartTime;
    }

    let rangeEndTime = String(Math.max.apply(null, objDateTime)); // レンジバーの終了時間

    let result = createObject(itowns, _view, rangeStartTime, timelineStartTime, objData, objEnvData);

    if(result === "success") {
        // TODO: データの場所に移動する関数
        mf_movePotision(_view, "EPSG:4326", objEnvData.map_center, Number(objEnvData.map_pitch), Number(objEnvData.map_bearing));

        // TODO: タイムスライダーを作り変える関数
        mf_changeTimeTable(rangeStartTime, timelineStartTime, timelineEndTTime, rangeStartTime, rangeEndTime);
        
        _Menu.gui.removeFolder("移動体データ");
        hiddenRangeBar();

        mfjson_menu(_Menu, _view, sourceId, targetData);

        setupSyataiLagend(sourceId, syataiLagend, targetData, amedasRainVis, amedasTempVis, amedasSnowVis);
    }
}

// TODO: データの場所に移動する関数
export function mf_movePotision(globeView, coordCrs, mapCenter, optionsTilt, optionsHeading, s=1) {

    let mapPosition = mapCenter.split(",");
    let positionOnGlobe = new itowns.Coordinates(coordCrs, Number(mapPosition[0]), Number(mapPosition[1]));

    //カメラ位置・角度設定
    let camera_v = globeView.camera.camera3D;
    let options = {
        coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
        tilt: optionsTilt, //地球表面とカメラのなす角 デフォルトは垂直で90
        heading: optionsHeading, //回転
        range: 10000, //カメラと地球の距離
        // time: 3000, //アニメーションの長さ（ミリ秒）
        // stopPlaceOnGroundAtEnd: optionsStopPlaceOnGroundAtEnd //アニメーション終了時にターゲットを地面に配置するのを停止
    };

    if (s === 1) {
        itowns.CameraUtils.animateCameraToLookAtTarget(globeView, camera_v, options).then(()=> {
            resize_obj(globeView);
        });//アニメーション移動
    } else {
        itowns.CameraUtils.transformCameraToLookAtTarget(globeView, camera_v, options).then(()=> {
            resize_obj(globeView);
        });//すぐ移動
    }

}

function mf_changeTimeTable(timelineCurrent, timelineStart, timelineEnd, rangeStart, rangeEnd) {
    // タイムスライダーの時間範囲を変える
    let objOptions = $("#timeline").k2goTimeline("getOptions");
    let objTimeInfo        = {};
    let objOffsetPixelInfo = {};

    objOffsetPixelInfo.startTime   = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.minTime.getTime() > objOptions.startTime.getTime() ? objOptions.minTime : objOptions.startTime);
    objOffsetPixelInfo.endTime     = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.maxTime.getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime : objOptions.endTime  );
    objOffsetPixelInfo.currentTime = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.currentTime);
    
    objTimeInfo.minTime      = new Date(objOptions.minTime    .getTime());
    objTimeInfo.maxTime      = new Date(objOptions.maxTime    .getTime());
    objTimeInfo.currentTime  = toDate (timelineCurrent);
    objTimeInfo.startTime    = toDate (timelineStart);
    objTimeInfo.endTime      = toDate (timelineEnd);
    
    if( objTimeInfo.startTime.getTime() < objTimeInfo.minTime.getTime() ) objTimeInfo.startTime.setTime(objTimeInfo.minTime.getTime()) ;
    if( objTimeInfo.endTime  .getTime() > objTimeInfo.maxTime.getTime() ) objTimeInfo.endTime  .setTime(objTimeInfo.maxTime.getTime()) ;

    $("#timeline").k2goTimeline("create",
    {
        timeInfo : objTimeInfo,
        callback : function(pTimeInfo)
        {
            // $Env.creating = false;
            $("#zoom-range").trigger("input");
        }
    });

    timeline.adjustRangeBar();

    setTimeout(() => {
        mf_showRangeBar(rangeStart, rangeEnd);
    }, "100");

    
}

function mf_showRangeBar(rangeStart, rangeEnd) {
    $("#button_range").toggleClass("active");

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

        objRangeStartTime = toDate (rangeStart);
        objRangeEndTime   = toDate (rangeEnd);

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

function mfjson_menu(_Menu, _view, sourceId, targetData) {
    _Menu.mfjsonGui = _Menu.gui.addFolder("移動体データ");

    _Menu.mfjsonGui.add({ visible: _view.mesh.visible }, "visible").onChange(
        function updateVisibility(value) {
            _view.mesh.visible = value;
            _view.notifyChange();
        }.bind(this)
    );

    _Menu.mfjsonGui.add({
        delete: function objDelete() {
            let result = window.confirm('レイヤを削除してもよろしいですか？');
            if( result ) {
                //「true」の処理
                let syataiLagend = false;
                let amedas_rain = false;
                let amedas_temp = false;
                let amedas_snow = false;

                _view.scene.remove(_view.mesh);
                for(let i = 0; i < _view.mesh.children.length; i++) {
                    _view.mesh.children[i].material.dispose();
                    _view.mesh.children[i].geometry.dispose();
                };
                _Menu.gui.removeFolder("移動体データ");
                hiddenRangeBar();
                setupSyataiLagend(sourceId, syataiLagend, targetData, amedas_rain, amedas_temp, amedas_snow);
                return true;
            } else {
                return false;
            }
        }.bind(this),
    }, "delete");
}