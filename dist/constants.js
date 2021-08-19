"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
const logger_1 = __importDefault(require("./logger"));
require("./managers/bot");
const logger = new logger_1.default("Constants");
var Constants;
(function (Constants) {
    Constants.BRANDING_URL = "";
    Constants.GUILDS = ['874170118366699550', '874179075466481664', '874174044390445126', '874170425217806357', '874171129013616640', '874170119625011271', '874174534960431124', '874294787262533642'];
    Constants.POI_CATEGORIES = ['874170118857449472', '874179076020117584', '874174044612747335', '874170425448497172', '874171129357537290', '874170120010891294', '874174536680112190', '874357348989296671'];
    Constants.LOBBY_CATEGORIES = ['874173377806487554', '874179328106172427', '874177115912830976', '874172394003107840', '874172429289799730', '874172774443266138', '874347171699363911', '874357406849724546'];
    Constants.VERIFICATION_CHANNELS = ['874170118723235840', '874179075793621032', '874174044503703552', '874170425331036170', '874171129139441714', '874170119897632788', '874174536420053003', '874294787262533645'];
    Constants.ARCHIVE_CHANNELS = ['874377551139729430', '874377852198477894', '874377895672414230', '874377940928974889', '874377990761500692', '874378044842864651', '874377522933010433', '874378175734489130'];
    Constants.EB_COMMAND_CHANNELS = ['874170118857449477', '874179076020117589', '874174044612747340', '874170425448497177', '874171129357537295', '874170120010891299', '874174536680112195', '874388720978108486'];
    Constants.VOTING_CHANNELS = ['874170118723235848', '874179075793621040', '874174044503703560', '874170425331036178', '874171129139441722', '874170119897632796', '874174536420053011', '874513790291570758'];
    Constants.VOTING_LOGS = ['874170118857449475', '874179076020117587', '874174044612747338', '874170425448497175', '874171129357537293', '874170120010891297', '874174536680112193', '874580965048078377'];
    Constants.CHANNEL_LOG = '877536371705786388';
    Constants.RED = "#FF0000";
    Constants.AQUA = "#00FFFF";
    Constants.CODES = [
        "27006250", "33289971", "29939020", "67268429", "38842383", "95288250", "76318161", "62421848", "13661396", "56977806", "06797852",
        "06797852", "45534178", "06102003", "59960373", "39001769", "38257751", "90090923", "03722400", "41991393", "95211667", "63335232",
        "63335232", "09684282", "91097783", "00141490", "06763966", "08493551", "95157937", "39153500", "83104274", "05791178", "48503301",
        "48503301", "49478088", "50663988", "90349121", "52186847", "14061636", "27922126", "46506052", "88637046", "37868042", "27927110",
        "27927110", "48751389", "32407363", "11407568", "71575724", "32521852", "06959197", "72803661", "49703862", "62309093", "21840603",
        "21840603", "14084471", "86011080", "94881112", "26565521", "98948951", "74781327", "34649441", "33182928", "08548373", "54148008",
        "54148008", "42324144", "28151381", "98532985", "42288330", "46457449", "33448309", "74732657", "16445053", "95520259", "76367393",
        "76367393", "93832785", "81757561", "90916212", "96927002", "94469417", "16048811", "55729113", "14692105", "67315673", "45452657",
        "45452657", "31462753", "11310758", "12141720", "90621065", "81444378", "49009239", "65683685", "98478741", "03778158", "71874445",
        "71874445", "37344429", "39325882", "23664238", "06834119", "27427026", "84144928", "79329073", "16716141", "40134804", "81689369",
        "81689369", "60408037", "05317632", "09851081", "81989261", "96015861", "62452220", "61049222", "83223849", "32363151", "45701966",
        "45701966", "24416638", "98271068", "50126189", "25663242", "38272772", "50074959", "25819090", "84609795", "35703117", "33105899",
        "33105899", "44173782", "04887958", "57318882", "68900487", "19436981", "73804320", "13572884", "56956721", "26977335", "06416234",
        "06416234", "27937986", "67034995", "29514447", "96221139", "34587489", "82055388", "21240931", "35476553", "70249550", "32827648",
        "32827648", "91281929", "71619372", "05460152", "59947373", "93108507", "90976636", "10252848", "91222674", "39595722", "72730375",
        "72730375", "01768902", "53285938", "98119883", "86159321", "50258821", "92271913", "69995158", "02147913", "21469609", "19232088",
        "19232088", "33164275", "28285200", "99143439", "90915040", "79373776", "52943441", "14507985", "38198230", "38211734", "50419076",
        "50419076", "86963403", "83601518", "35449338", "54034511", "98238918", "68841079", "61580421", "28340547", "78191318", "39162506",
        "39162506", "53914595", "05829972", "44358609", "14013952", "33336456", "52970936", "38154311", "20430947", "23804293", "23841325",
        "23841325", "05984909", "91535970", "46958030", "86186154", "90665986", "84159380", "69404681", "73444326", "57580055", "95007118",
        "95007118", "82334179", "61912409", "25010662", "45336302", "19924455", "36645029", "84442238", "63187346", "03244081", "04397233",
        "04397233", "19809429", "97873780", "61581999", "74218766", "18462307", "10040014", "65346861", "65145694", "60053726", "51912401",
        "51912401", "00455207", "88327360", "99826728", "12810550", "30449584", "33804241", "91533776", "22017928", "24338482", "40627645",
        "40627645", "69368619", "56763243", "84369150", "90633741", "02732262", "08981322", "17926913", "27206179", "41988808", "65080715",
        "65080715", "70677704", "81274253", "12442254", "49687407", "55267859", "30441464", "63736759", "95728742", "45724040", "19981761",
        "19981761", "96912847", "84165878", "00856447", "87712309", "09937486", "91765735", "11941058", "63326581", "97918347", "09372454",
        "09372454", "80832841", "14607013", "37857954", "35409722", "57857442", "51159456", "13094677", "49374249", "63659704", "27714219",
        "27714219", "48614084", "61902372", "03702746", "31621879", "43177083", "69519546", "93531797", "43205179", "11194966", "21833401",
        "21833401", "27339468", "15728770", "57192870", "78559214", "11328428", "21674071", "36244162", "15102889", "43681260", "07683331",
        "07683331", "08074074", "78033994", "54694092", "26624071", "17026716", "15165720", "83604044", "15463427", "41172959", "17629179",
        "17629179", "00250365", "47890348", "14583357", "48286559", "90060227", "97941566", "40187894", "99048292", "19381565", "32283633",
        "32283633", "71812308", "83065534", "49882787", "46741022", "82999581", "69751815", "10223712", "79384740", "53644191", "43146405",
        "43146405", "79710255", "77911337", "26000396", "80799854", "11616421", "03821469", "73847477", "58280146", "43628522", "76201132",
        "76201132", "42560416", "68882714", "41190803", "35776038", "74570986", "76448378", "50620146", "60920217", "58885672", "92537338",
        "92537338", "60425469", "28207722", "44687900", "41145030", "08370180", "64316155", "69411929", "96387642", "36810746", "19528159",
        "19528159", "24400366", "42836701", "55800734", "06378951", "33438212", "69514263", "45714276", "56583564", "40505606", "16949159",
        "16949159", "89722801", "64601408", "57491101", "92312095", "58841569", "40519091", "38085406", "80269076", "52260939", "53297583",
        "53297583", "83580448", "50480003", "48994293", "07097224", "80993245", "38800537", "29541422", "10134162", "96398765", "65270824",
        "65270824", "14798718", "72724217", "00639826", "58154294", "82340788", "65055641", "69501278", "17436450", "01846956", "62219099",
        "62219099", "24220408", "22750685", "61961481", "30425518", "10313348", "32313509", "32892262", "22380903", "61939772", "07292497",
        "07292497", "53396398", "55786211", "32743381", "94328973", "51844267", "70701948", "67874051", "85399968", "67767819", "34628616",
        "34628616", "31986972", "92164226", "82561350", "84623760", "12487577", "78474197", "84759823", "33455693", "74958206", "43445271",
        "43445271", "12264415", "11313376", "26233558", "96033615", "89312290", "05959311", "25879815", "67191320", "35782490", "97391300",
        "97391300", "50858441", "63163983", "91324683", "27273765", "88039048", "96871094", "77153061", "74135365", "13770756", "03414663",
        "03414663", "97903842", "27447526", "32963245", "43036972", "25756571", "54161622", "61478672", "37914858", "33960931", "81098681",
        "81098681", "88279664", "09834146", "13953175", "59339830", "32880084", "29412700", "63149433", "79392985", "71461748", "51375741",
        "51375741", "97244774", "44040674", "40920392", "34863102", "13294411", "09727988", "97935510", "14615074", "65124859", "65465291",
        "65465291", "68953083", "73241581", "74367529", "99439266", "35819332", "84867782", "39112839", "79945472", "59707752", "90006376",
        "90006376", "90321572", "39214603", "80060289", "76820765", "86141823", "23027787", "03569375", "91644134", "91576072", "31864085",
        "31864085", "43889930", "50208648", "39035596", "59696473", "77708878", "04154220", "06589965", "40351067", "11363557", "11508862",
        "11508862", "73251133", "62814048", "19907263", "65009885", "21351445", "19288870", "47558889", "59553682", "69524267", "26147129",
        "26147129", "54042994", "44196135", "27012444", "37688148", "78128255", "82764265", "33231077", "51978619", "83762364", "82121283",
        "82121283", "43942017", "41702831", "99953441", "18656359", "71037313", "18671004", "56706800", "39273000", "74266757", "40971858",
        "40971858", "66837886", "25553892", "27583152", "00523556", "63321064", "48141209", "52121644", "46812458", "64610561", "94451296",
        "94451296", "60878026", "60793077", "27916823", "12840955", "44715982", "62877039", "12315502", "69908549", "16677328", "28960434",
        "28960434", "12196652", "11946064", "56678332", "77484792", "62417959", "30019855", "82050329", "49793949", "00553636", "63930430",
        "63930430", "85145983", "17947464", "63404162", "56375036", "25680152", "75851924", "76658510", "41621141", "60324345", "28120946",
        "28120946", "70254818", "01601475", "86864154", "39629076", "16843340", "57650024", "82459926", "33702767", "68593257", "23921557",
        "23921557", "88748037", "41829827", "94397018", "38816138", "79168072", "47682804", "61340467", "39398005", "51104006", "06431498",
        "06431498", "84782802", "29598008", "03340090", "29510554", "95046244", "01111714", "73919108", "34188934", "06611413", "82109067",
        "82109067", "27332594", "83266549", "42245428", "85578958", "10734857", "56297406", "31691004", "74322499", "41151645", "07897260",
        "07897260", "54722054", "34222805", "78215709", "74790543", "38128858", "40892146", "28073616", "79610747", "16621467", "89320987",
        "89320987", "26326661", "85409758", "72356788", "11213927", "63916078", "34077274", "55647402", "50034830", "46188538", "70908689",
        "70908689", "87101691", "71016179", "05861605", "39206036", "22580554", "19350410", "66637865", "38783042", "09114711", "86692150",
        "86692150", "90176674", "24371764", "18012935", "80623679", "18603699", "72436979", "95254853", "45827682", "00032302", "60398163",
        "60398163", "06346966", "72954574", "36991582", "01661153", "25955815", "20294468", "08014216", "08937089", "84305789", "70109347",
        "70109347", "91807230", "19948757", "45988652", "84949928", "56417268", "63221536", "36471900", "35656492", "06631508", "58302007",
        "58302007", "18215932", "45313968", "08491296", "48023000", "25588549", "38773290", "88540237", "69217984", "55793232", "10000293",
        "10000293", "92671543", "08366656", "90642290", "21062385", "27985690", "36869994", "67680498", "31035588", "03827501", "59702849",
        "59702849", "33369288", "08643246", "61812579", "94548292", "85077677", "09465470", "80843702", "50634614", "97062654", "15812783",
        "15812783", "03939423", "00658060", "36703317", "32348958", "23304960", "76038318", "91375930", "05420646", "77068691", "81135770",
        "81135770", "49347793", "24528395", "70837291", "58599892", "46869342", "98820690", "77797304", "47094920", "99366970", "94081553",
        "94081553", "71761346", "92939332", "23975787", "71059503", "71861155", "19652597", "82307767", "73317270", "19003801", "49751422",
        "49751422", "09609421", "51775540", "98148761", "29994247", "19819104", "01685783", "84229872", "36383373", "62946402", "28468263",
        "28468263", "64640227", "18534239", "04360588", "91708521", "78483883", "65667379", "93172480", "94467733", "73751562", "64133665",
        "64133665", "34042372", "50772344", "74046469", "34295122", "64300404", "95781942", "45945338", "78867802", "28019007", "31381199",
        "31381199", "33875436", "02931459", "22575104", "74805786", "23488994", "66978153", "03509376", "81456285", "97682417", "81329120",
        "81329120", "03675984", "02884972", "89576025", "46634399", "20882008", "69894920", "52422296", "67880596", "67158411", "19916695",
        "19916695", "00403587", "42415871", "62088251", "22891161", "65315949", "28474821", "55034900", "66107445", "47948652", "42273323",
        "42273323", "39287624", "99473525", "11261487", "27839560", "41361424", "75907272", "99322158", "45271837", "24130813", "83665169",
        "83665169", "41843584", "17199349", "38768982", "14616914", "79757425", "45097924", "15812510", "42348379", "16863752", "66082878",
        "66082878", "55007409", "46822825", "14302029", "93983699", "23569351", "18924688", "75054640", "52261118", "57582327", "60889658",
        "60889658", "60999380", "95693033", "75281516", "63417222", "22385629", "37941269", "85397106", "04986943", "95535758", "58598788",
        "58598788", "78814473", "99798352", "21675861", "68242006", "71036171", "39899915", "43126263", "69016097", "57927350", "26643600",
        "26643600", "54627169", "78403915", "54564292", "53463039", "21941317", "98992802", "88785163", "29789029", "37832672", "47604319",
        "47604319", "38490260", "41432468", "66119861", "47174153", "41342833", "28537613", "95275786", "18966326", "78292786", "31775885",
        "31775885", "03517735", "96665881", "40946171", "06899164", "94673902", "79986696", "16934970", "10898339", "87112892", "48272186",
        "48272186", "83254588", "85406316", "59178664", "67212756", "20275960", "70123790", "75127945", "39822646", "67185305", "05290963",
        "05290963", "40463593", "29546016", "25208475", "64773225", "57782392", "31886460", "49083189", "48602468", "59112536", "31537278",
        "31537278", "49620083", "16236530", "81262527", "20414446", "03963489", "65369453", "95568390", "63807191", "56128878", "93693635",
        "93693635", "98826841", "74415277", "49335342", "74336453", "96564961", "06696907", "28802966", "56515617", "49579044", "77096610",
        "77096610", "69294394", "15222468", "96572339", "11032660", "48882652", "32553040", "85976146", "67883219", "68643736", "66103702",
        "66103702", "01460517", "42580799", "68478476", "46637994", "78424979", "01829553", "12337546", "35818555", "40181782", "23431828",
        "23431828", "34578299", "80887082", "13613418", "77160984", "83633730", "35987347", "05306050", "29061431", "83137582", "90280878",
        "90280878", "29149224", "42909782", "01381890", "96735018", "33109672", "95272477", "04938680", "70727108", "41171215", "25491291",
        "25491291", "52914014", "27246328", "38447523", "91995931", "16228699", "40059434", "93854124", "60957238", "91712637", "33785142",
        "33785142", "73480386", "42539674", "11809635", "96707034", "17919427", "18296986", "89917112", "94215939", "30709738", "77839857",
        "77839857", "21089106", "99978235", "87784541", "94200766", "34347814", "68930773", "32147252", "44366892", "89476784", "60273322",
        "60273322", "26923174", "95130365", "80379299", "33248178", "28674914", "93644781", "61191736", "97733152", "54624150", "26819303",
        "26819303", "72727706", "77734554", "58343862", "82753971", "21927155", "93890694", "97246899", "65774601", "44798080"
    ];
})(Constants = exports.Constants || (exports.Constants = {}));
