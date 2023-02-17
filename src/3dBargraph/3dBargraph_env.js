//初期一周辺
export let point_1 = "140.4567,36.6443";
export let point_2 = "140.4567,34.360";
export let point_3 = "137.4291,34.360";
export let point_4 = "137.4291,36.6443";

export const $3DBargraph_Env =
{
    // アメダス
    amedas: {
        amedas_graph : false,
        amedas_graph_config : {
            "id":"アメダス【時系列】",
            "crs": "EPSG:3857",
            "opacity": 1.0,
            "bool_geojson": true,
        //  "jsonurl": "./demographics/test2.json",
            "url": 'https://tb-gis-web.jgn-x.jp/api/t_amedas_data?point_1=' + point_1 + '&point_2=' + point_2 + '&point_3=' + point_3 + '&point_4=' + point_4 + '&currentDate=202203161240',
            "format": 'application/json',
            "zoom":{"min":1, "max":20}
        },
        // point_1 : "140.4567,36.6443",
        // point_2 : "140.4567,34.360",
        // point_3 : "137.4291,34.360",
        // point_4 : "137.4291,36.6443",
    },
    // 人口
    population : {
        graph_config : true,
        graph_config_b : {
            "id":"人口",
            "crs": "EPSG:3857",
            "isUserData": true,
            "opacity": 1.0,
            "jsonurl": "./data/layers/demographics/population.json",
            "url": "./data/demographics/demographics_2018.csv",
            "zoom":{"min":1, "max":20}
        },
        graph_config_r : {
            "id":"世帯",
            "crs": "EPSG:3857",
            "isUserData": true,
            "opacity": 1.0,
            "jsonurl": "./data/layers/demographics/households.json",
            "url": "./data/demographics/demographics_2018.csv",
            "zoom":{"min":1, "max":20}
        },
        graph_config_y : {
            "id":"住宅数",
            "crs": "EPSG:3857",
            "isUserData": true,
            "opacity": 1.0,
            "jsonurl": "./data/layers/demographics/housing.json",
            "url": "./data/demographics/demographics_2018.csv",
            "zoom":{"min":1, "max":20}
        }
    }
}