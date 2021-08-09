import Logger from "./logger";
import bot from "./managers/bot";

const logger = new Logger("Constants");

export namespace Constants {
    export const BRANDING_URL = "";
    export const GUILDS = ['874170118366699550', '874179075466481664', '874174044390445126', '874170425217806357', '874171129013616640', '874170119625011271', '874174534960431124', '874294787262533642'];

    //EAFUN, GSEC, LLAN, USS, SJCC, SSLCW, HSC, testing server

    export const POI_CATEGORIES = ['874170118857449472', '874179076020117584', '874174044612747335', '874170425448497172', '874171129357537290', '874170120010891294', '874174536680112190', '874357348989296671'];
    export const LOBBY_CATEGORIES = ['874173377806487554', '874179328106172427', '874177115912830976', '874172394003107840', '874172429289799730', '874172774443266138', '874347171699363911', '874357406849724546'];
    export const VERIFICATION_CHANNELS = ['874170118723235840', '874179075793621032', '874174044503703552', '874170425331036170', '874171129139441714', '874170119897632788', '874174536420053003', '874294787262533645'];
    export const ARCHIVE_CHANNELS = ['874377551139729430', '874377852198477894', '874377895672414230', '874377940928974889', '874377990761500692', '874378044842864651', '874377522933010433', '874378175734489130'];

    export const RED = "#FF0000";
    export const AQUA = "#00FFFF";
}