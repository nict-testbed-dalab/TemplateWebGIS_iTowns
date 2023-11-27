// 絶対パスに変換用
const baseUrl = "";

//初期レイヤ
const initialLayers = [
    //地理院地図
    { addToView: true, path: "./JSONLayers/layers/GISMpasStd.json" },
    { addToView: true, path: "./JSONLayers/layers/GISMpasPale.json" },
    { addToView: true, path: "./JSONLayers/layers/GISMpasSphoto.json" },
    //OSM
    { addToView: true, path: "./JSONLayers/layers/Osm.json" },
    //地理院Vタイル
    { addToView: true, path: "./JSONLayers/layers/Std_n.json" },
    //時系列データ
    { addToView: false, path: "./JSONLayers/layers/Rainfall.json" },
    { addToView: false, path: "./JSONLayers/layers/Sun.json" },
    { addToView: false, path: "./JSONLayers/layers/Wind.json" },
    { addToView: false, path: "./JSONLayers/layers/Ondo.json" },
    { addToView: false, path: "./JSONLayers/layers/Situdo.json" },
    { addToView: false, path: "./JSONLayers/layers/Himawari.json" },
    // 点群データ
    { addToView: false, path: "./JSONLayers/layers/Himawari_tengun.json" },
    // 3Dデータ
    { addToView: false, path: "./JSONLayers/layers/13103_minato-ku.json" },
    { addToView: false, path: "./JSONLayers/layers/13103_minato-ku_notexture.json" },
    { addToView: false, path: "./JSONLayers/layers/tokyo23ku_bridge.json" },
    // TODO: 3D棒グラフの表示
    {addToView: false, path: "./JSONLayers/layers/Jinko.json"},
    {addToView: false, path: "./JSONLayers/layers/Amedas.json"},
    // エレベーション
    { addToView: true, path: "./JSONLayers/layers/Elevation.json" },
    // 施設
    { addToView: false, path: "./JSONLayers/layers/1_a_5_1_kunikikan.json" },
    { addToView: false, path: "./JSONLayers/layers/Syuukaisisetu.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_5_3_yakuba.json" },
    { addToView: false, path: "./JSONLayers/layers/Koukyousisetu.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_5_5_keisatusyo.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_5_6_syoubousyo.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_5_8_iryoukikan.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_5_11_gakkou.json" },
    // 水域
    { addToView: false, path: "./JSONLayers/layers/1_a_1_1_kaigansen.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_1_2_kaigan_hoan.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_1_3_kosyou.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_1_5_dam.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_1_6_kasen.json" },
    // 土地利用
    { addToView: false, path: "./JSONLayers/layers/1_a_3_1_totiriyou3zi.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_3_2_totiriyousaibun.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_3_3_tositiikitotiriyou.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_3_4_totiriyousyousai.json" },
    // 災害防災
    { addToView: false, path: "./JSONLayers/layers/1_a_4_1_hinansisetu.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_4_2_dosyakiken.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_4_3_kouzui.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_4_4_heinenti.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_4_5_dosyanadare.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_4_6_dosyakuiki.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_4_7_tunami.json" },
    // 交通
    { addToView: false, path: "./JSONLayers/layers/1_a_6_2_kinkyuuyusou.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_6_3_mitudoentyou.json" },
    { addToView: false, path: "./JSONLayers/layers/1_a_6_6_tetsudo.json" },
    // 行政境界
    { addToView: false, path: "./JSONLayers/layers/Layer_city_boundary.json" },
    { addToView: false, path: "./JSONLayers/layers/Layer_town.json" },
    { addToView: false, path: "./JSONLayers/layers/Layer_town_color.json" },
    // センサーデータ
    { addToView: false, path: "./JSONLayers/layers/Mengun.json" },
    { addToView: false, path: "./JSONLayers/layers/Hamamatsu.json" },
    { addToView: false, path: "./JSONLayers/layers/Jinryu.json" }
];