import * as itowns from "itowns";
import * as itowns_widgets from "itowns/widgets";

export function addWidget(globeView, placement) {
    // ---------- NAVIGATION WIDGET : ----------
    const widgets = new itowns_widgets.Navigation(globeView);
    // Example on how to add a new button to the widgets menu
    widgets.addButton(
    "rotate-up",
    '<p style="font-size: 20px">&#8595</p>',
    "rotate camera up",
    () => {
        globeView.controls.lookAtCoordinate({
        tilt: globeView.controls.getTilt() - 10,
        time: 500,
        });
    },
    "button-bar-rotation"
    );
    widgets.addButton(
    "rotate-down",
    '<p style="font-size: 20px">&#8593</p>',
    "rotate camera down",
    () => {
        globeView.controls.lookAtCoordinate({
        tilt: globeView.controls.getTilt() + 10,
        time: 500,
        });
    },
    "button-bar-rotation"
    );
    widgets.addButton("reset-position", "&#8634", "reset position", () => {
    globeView.controls.lookAtCoordinate(placement);
    });

    //---------- SCALE WIDGET : ----------
    const scale = new itowns_widgets.Scale(globeView, {
        position: "bottom-right",
        translate: { x: -70 },
    });

    // ---------- MINIMAP WIDGET : ----------

    // Create a ColorLayer that shall be displayed on the minimap.
    // const minimapColorLayer = new itowns.ColorLayer("minimap", {
    //     // source: new itowns.VectorTilesSource({
    //     // style:
    //     //     "https://wxs.ign.fr/essentiels/static/vectorTiles/styles/PLAN.IGN/standard.json",
    //     // }),
    //     source: new itowns.TMSSource({
    //         url: "https://cyberjapandata.gsi.go.jp/xyz/std/${z}/${x}/${y}.png",
    //         crs: "EPSG:3857"
    //     }),
    //     addLabelLayer: false,
    // });

    // // Create a minimap.
    // const minimap = new itowns_widgets.Minimap(globeView, minimapColorLayer, {
    //     cursor: "+",
    //     size: 200,
    //     minScale: 1/30000,
    //     maxScale: 1/60000000,
    //     zoomRatio: 1 / 5
    // });

    // // ---------- INTERACTION WITH MINIMAP : ----------

    // // When double-clicking the minimap, travel to the cursor location.
    // const cursorCoordinates = new itowns.Coordinates(minimap.view.referenceCrs);
    // minimap.domElement.addEventListener("dblclick", (event) => {
    //   minimap.view.pickCoordinates(event, cursorCoordinates);
    //   globeView.controls.lookAtCoordinate({ coord: cursorCoordinates });
    // });

    // ミニマップの大きさを変更する
    // setupMinimapSize(minimap, "lerge", 400, globeView, minimapColorLayer);
    // setupMinimapSize(minimap, "middle", 200, globeView, minimapColorLayer);
    // setupMinimapSize(minimap, "small", 100, globeView, minimapColorLayer);
};

// ミニマップの大きさを変更する
function setupMinimapSize(minimap, btnClass, num, globeView, minimapColorLayer, cursorCoordinates, widthValue = "100%" , positionLeft=100, positionbottom=150) {
    document.getElementById(btnClass).addEventListener("click", function() {
        let viewerDiv = document.getElementById("viewerDiv");
        let widgetsMinimap = document.getElementById("widgets-minimap");
        let NewCursorCoordinates = new itowns.Coordinates(minimap.view.referenceCrs);

        $("#widgets-minimap").remove();

        // Create a ColorLayer that shall be displayed on the minimap.
        // Create a minimap.
        minimap = new itowns_widgets.Minimap(globeView, minimapColorLayer, {
            cursor: "+",
            size: num,
            minScale: 1/30000,
            maxScale: 1/60000000,
            zoomRatio: 1 / 5
        });

        globeView.controls.lookAtCoordinate({ coord: cursorCoordinates });

        minimap.domElement.addEventListener("dblclick", (event) => {
            minimap.view.pickCoordinates(event, NewCursorCoordinates);
            globeView.controls.lookAtCoordinate({ coord: NewCursorCoordinates });
        });

        viewerDiv.style.width = widthValue;
        viewerDiv.style.float = "right";

        widgetsMinimap = document.getElementById("widgets-minimap");
        widgetsMinimap.style.left = positionLeft + "px";
        widgetsMinimap.style.bottom = positionbottom + "px";
    });
}

