export function camera_traveling(THREE, itowns, globeView, GuiTools) {

    // THREE.Group which stores picked camera positions markers.
    let cameraHelpers = new THREE.Group();
    cameraHelpers.visible = false;
    globeView.scene.add(cameraHelpers);

    // Array which stores successive camera transform options (headings, tilts, ranges...
    // see CameraTransformOptions doc at http://www.itowns-project.org/itowns/docs/#api/Controls/CameraUtils)
    let travelData = {};
    travelData.source_id = "json";
    travelData.source = {};
    travelData.source.protocol = "travel";
    travelData.geometry = [];
    // let travelSteps = [];
    // Boolean which states if the camera is performing a travel animation or not
    let travelOn = false;

    function saveCurrentCameraTransformOptions() {
        // Retrieve current camera transform options
        const cameraTransformOptions = itowns.CameraUtils.getTransformCameraLookingAtTarget(
            globeView,
            globeView.camera.camera3D,
        );
        // Change default easing parameter for animation speed
        // (see https://sole.github.io/tween.js/examples/03_graphs.html)
        cameraTransformOptions.easing = itowns.CameraUtils.Easing.Quadratic.InOut;
        // easingtime
        cameraTransformOptions.time = 7500;

        // Add the camera transform options to the travel step array
        travelData.geometry.push(cameraTransformOptions);

        // Create a CameraHelper (https://threejs.org/docs/index.html?q=Camera#api/en/helpers/CameraHelper) at
        // the current position of the camera. The camera is copied, and the copy's `far` is lowered. This
        // renders shorter axes on the displayed CameraHelper.
        const copyCamera = globeView.camera.camera3D.clone();
        copyCamera.far = 50;
        const helper = new THREE.CameraHelper(copyCamera);
        helper.updateWorldMatrix(true, false);
        cameraHelpers.add(helper);
        globeView.notifyChange();
    }

    function animateCamera() {
        if (!travelOn) {  // If travel is off, begin travel
            travelOn = true;
            console.log(travelData.geometry[0]);
            return itowns.CameraUtils.sequenceAnimationsToLookAtTarget(
                globeView,
                globeView.camera.camera3D,
                travelData.geometry,
            ).then(() => { travelOn = false; });
        }

        itowns.CameraUtils.stop(globeView, globeView.camera.camera3D);  // If travel is on, interrupt it
    }

    // json単出力
    function download_txt() {
    
        //データ用意
        travelData = [];
        cameraHelpers.clear();
        globeView.notifyChange();
        saveCurrentCameraTransformOptions();
        let data = travelData;

        //jsonファイル出力
        let file_name = "output.json";
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = file_name;
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    
    }

    // json出力
    function download_txts() {
    
        //データ用意
        cameraHelpers.clear();
        globeView.notifyChange();
        let data = travelData;

        //jsonファイル出力
        let file_name = "output.json";
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = file_name;
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    
    }

    // Listens for user input :
    window.addEventListener('keypress', async function (event) {
        // If user presses `p` (for 'pick:'), saves the current camera position, heading, tilt...
        if (event.key === 'p') { saveCurrentCameraTransformOptions(); }
        // If user presses `t` (for 'travel'), switches travelling mode on or off.
        else if (event.key === 't') { animateCamera(); }
        // Pで保存した地点をjsonで出力（全地点）
        else if (event.key === 's') { download_txts(); }
        // 今の地点をjsonで出力
        else if (event.key === 'd') { download_txt(); }
        // ひとつ前の地点の情報を削除
        else if (event.key === 'x') {
            travelData.geometry.pop();
            cameraHelpers.clear();
            globeView.notifyChange();
        }
        // If user presses `c` (for 'clear'), removes all the picked position from lists.
        else if (event.key ==='c') {
            travelData.geometry = [];
            cameraHelpers.clear();
            globeView.notifyChange();
        }
    })

    // Add a menu with an option to display CameraHelpers or not :
    // let menuGlobe = new GuiTools('menuDiv', globeView);
    // menuGlobe.addGUI('Picked positions', false, function (v) {
    //     cameraHelpers.visible = !!v;
    //     globeView.notifyChange();
    // })

}
