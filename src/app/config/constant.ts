import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class Constants {

    public readonly API_ENDPOINT: string = environment.apiUrl;
    public readonly API_MOCK_ENDPOINT: string = environment.apiMockUrl;
    public readonly API_IS_DEVELOPMENT_ENV: boolean = environment.production;
    public readonly API_OCP_APIM_SUBSCRIPTION_KEY: string = environment.OcpApimSubscriptionKey;
    public readonly API_JUNGLEE_TOKEN: string = environment.JungleeToken;

    //example
    public readonly API_URL_LOGIN: string = 'api/junglee-admin/login';
    public readonly API_URL_SIGNUP: string = 'api/userRegistration';


    public readonly API_URL_USER_DETAIL: string = 'api/getUserDetails';

    //header
    public readonly API_URL_ADMIN_INFO: string = 'api/getAdminInfo';


    //member
    public readonly API_URL_ALL_USERS: string = 'api/junglee-admin/allUsers';
    public readonly API_URL_SINGLE_USERS: string = 'api/junglee-admin/getUserById';
    public readonly API_URL_CREATE_USER: string = 'api/junglee-admin/createNewUser';
    public readonly API_URL_EDIT_USER: string = 'api/junglee-admin/edit-user';
    public readonly API_URL_SEARCH_MEMBERS: string = 'api/junglee-admin/getMemberForGlobalSearch';
    public readonly API_URL_ADJUST_WINNINGS: string = 'api/junglee-admin/adjustWinnings';
    public readonly API_URL_UPDATE_GAME_CONTROL: string = 'api/junglee-admin/updateGameControl';
    public readonly API_URL_UPDATE_SPORTS_CONTROL: string = 'api/junglee-admin/updateSportsControl';
    public readonly API_URL_GET_MEMBER_ACTIVITY: string = 'api/junglee-admin/getMemberActivity';
    public readonly API_URL_GET_MEMBER_BALANCE: string = 'api/junglee-admin/getBalanceForMember';
    public readonly API_URL_GET_MEMBER_BETS: string = 'api/junglee-admin/getMemberBets';
    public readonly API_URL_GET_DOWNLINE_ACCOUNTS_DATA: string = 'api/junglee-admin/getDownlineAccountsData';
    public readonly API_URL_GET_DOWNLINE_ACCOUNTS_DATA_FOR_MEMBERS: string = 'api/junglee-admin/getDownLineAccountsForMember';
    public readonly API_URL_GET_ROLES: string = 'api/junglee-admin/getRoles';
    public readonly API_URL_GET_TRANSFER_STATEMENT_FOR_USER: string = 'api/junglee-admin/getTransferStatementForUser';
    public readonly API_URL_GET_MEMBER_LOGIN_HISTORY: string = 'api/junglee-admin/getMemberLoginHistory';
    public readonly API_URL_GET_MEMBER_BOOKS_FOR_BACKEND: string = 'api/junglee-admin/getMemberBooksForBackend';
    public readonly API_URL_ALL_MEMBERS:string = 'api/junglee-admin/getAllMembers';
    public readonly API_URL_GET_MARKET_BY_SPORT_ID:string = 'api/junglee-admin/getMarketBySportId';
    public readonly API_URL_CHANGE_MEMBER_STATUS:string = 'api/junglee-admin/setMemberStatus';
    public readonly API_URL_CHANGE_MEMBER_PASSWORD:string = 'api/junglee-admin/changeMemberPassword'
    public readonly API_URL_GET_UPLINE_MEMBERS: string = 'api/junglee-admin/getUplineSummary';
    public readonly API_URL_GET_USER_BY_UPLINE_ID: string = 'api/junglee-admin/getUserByAdminId';
    public readonly API_URL_GET_EXPOSURE_DETAILS: string = 'api/junglee-admin/getExposureDetails';

    public readonly API_URL_GET_USERACCOUNTLIST: string = 'api/getAccountListUsers';
    public readonly API_URL_BOOKS_MARKET:string = 'api/getBooksForMarket';


    //book management
    public readonly API_URL_GET_BOOK_FOR_BACKEND: string = 'api/junglee-admin/getBooksForBackend';
    public readonly API_URL_GET_ALL_USER_BETS: string = 'api/junglee-admin/getBetTicker';


    //account statement
    public readonly API_URL_TRANSFER_STATEMENT: string = 'api/junglee-admin/getAdminTransferStatement';
    public readonly API_URL_GET_PL_BY_SUBGAME: string = 'api/junglee-admin/getAdminPlBySubGame';
    public readonly API_URL_GET_CATEGORY_FOR_TO: string = 'api/junglee-admin/getCategoryForTO';
    public readonly API_URL_GET_TO_FOR_MATCH: string = 'api/junglee-admin/getTurnOverForMatch';
    public readonly API_URL_GET_ONE_ACCOUNT: string = 'api/junglee-admin/getOneAccount';
    public readonly API_URL_GET_BETS_FOR_TO: string = 'api/junglee-admin/getBetsForTO';
    public readonly API_URL_GET_USER_BETS_FOR_ADMIN_MYPL: string = 'api/junglee-admin/getUserBetsForAdminMyPL';
    public readonly API_URL_PLAYERWISE_ACCOUNT_STATEMENT: string = 'api/junglee-admin/getUserAccountStatementForAdmin';
    public readonly API_URL_PLAYER_LIST: string = 'api/junglee-admin/getAllUserMembers';
    public readonly API_URL_CASINO_PROVIDERS_LIST: string = 'api/getCasinoProvider';
    public readonly API_URL_GET_CASINO_REPORT: string = 'api/junglee-admin/getCasinoReportForAdmin';
    public readonly API_URL_GET_CASINO_REPORT_DETAIL: string = '/api/junglee-admin/getCasinoReportForAdminDetail';
    //change password
    public readonly API_CHANGE_PASSWORD: string = 'api/junglee-admin/changePassword';
    public readonly API_CREDIT_SETTLEMENT: string = 'api/credit-settlement';
    public readonly API_WINNING_SETTLEMENT: string = 'api/winning-settlement';

    public readonly API_CASINO_SETTLEMENT: string = 'api/casinoSettlement';
    public readonly API_BANK_SETTLEMENT: string = 'api/bankSettlement';
    public readonly API_BANK_BULK_TRANSFER: string = 'api/bankBulkTransfer';
    public readonly API_BANK_BANK_CASINO_SETTLEMENT: string = 'api/bankCasinoSettlement';


    //misc
    public readonly API_GET_EVENTS: string = 'api/junglee-admin/getEvents';
    public readonly API_GET_MATCHES_BY_SPORT_ID: string = 'api/getMatchBySportId';
    public readonly API_GET_MARKETS_BY_MATCH_ID: string = 'api/getMarketByMatchId';
    public readonly API_GET_TOURNAMENT_BY_SPORT_ID: string = 'api/getTournamentBySportId';
    public readonly API_GET_MATCH_BY_TOURNAMENT_ID: string = 'api/getMatchByTournamentId';
    public readonly API_GET_GAMES: string = 'api/junglee-admin/getGames/'+environment.clientId;
    public readonly API_GET_MARKET_ALL_TYPE: string = 'api/getMarketTypes';
    public readonly API_GET_SPORTS: string = 'api/betfairSports';

    //settings
    public readonly API_URL_ADD_BALANCE: string = 'api/junglee-admin/addSuperAdminBalance';
    public readonly API_URL_GET_CL_TRANSFERS: string = 'api/junglee-admin/getClTransferStatement';
    public readonly API_URL_DELETE_BET: string = 'api/junglee-admin/deleteBetByAdmin';
    public readonly API_URL_GET_BETS_FOR_BET_SETTINGS: string = 'api/junglee-admin/getBetsForBetSettings';
    public readonly API_URL_GET_MATCH_SETTINGS_LIST: string = 'api/junglee-admin/getMatchesForAdminSetting';
    public readonly API_URL_GET_MARKET_SETTINGS_LIST: string = 'api/junglee-admin/getMarketForAdminMarketSettings';
    public readonly API_URL_SET_BET_LIMIT_FOR_MATCH:string = 'api/junglee-admin/setBetLimitForMatch';
    public readonly API_URL_SUSPEND_MARKET:string = 'api/junglee-admin/suspendMarket';
    public readonly API_URL_SET_MATCH_ACTIVE_STATUS:string = 'api/junglee-admin/setMatchActiveStatus';
    public readonly API_URL_SET_MARKET_ACTIVE_STATUS:string = 'api/junglee-admin/setMarketStatusForMarketSettings';
    public readonly API_URL_SET_BET_LIMIT_FOR_MARKET:string = 'api/junglee-admin/setBetLimitForMarket';
    public readonly API_URL_SET_BET_LIMIT_FOR_MULTIPLE_MARKET:string = '/api/junglee-admin/setBetLimitForMultipleMarket';
    public readonly API_URL_TOGGLEBET:string = 'api/toggleBet';
    public readonly API_URL_GET_BET_STATUS:string = 'api/getBetStatus';


    //all logs
    // public readonly API_URL_INVALID_BETS:string = 'api/getVARBets';
    public readonly API_URL_INVALID_BETS:string = 'api/junglee-admin/getInvalidBets';

    //surveillance
    public readonly API_URL_GET_SURVEILLANCE_DATA:string = 'api/getBetsForSurveilliance';

    //BOOK MANAGEMENT
    public readonly API_URL_GET_BET_DETAILS_FOR_WORK_STATION:string = 'api/junglee-admin/getBetDetailsForWorkStation';

    public readonly API_URL_GET_AMDMIN_BOOK_MGM :string = 'api/junglee-admin/getBooksForAdminBookManagement';

    public readonly API_URL_GET_LADDER_FOR_ADMIN:string = 'api/junglee-admin/getLadderForAdmin';
    public readonly API_URL_GET_LADDER_FOR_ADMIN_MEMBER_LIST:string = 'api/junglee-admin/getLadderForAdminMemberList';

    //TEST
    public readonly API_URL_TEST_FUNC:string = 'api/getBetsForSurveilliance';

    public readonly API_URL_GET_WEBSOCKET_URL_BY_DEVICE:string = 'api/registerDeviceToGetOddsData';
    public readonly API_URL_UNIQUE_DEVICE_KEY:string = 'api/getUniquDeviceId';
    public readonly API_URL_TOTAL_BOOK:string = 'api/junglee-admin/getUserwiseTotalBooks';
    public readonly API_URL_ADJUST_WINNING_FOR_SINGLE_USER:string = 'api/junglee-admin/adjustWinningsForSingleUser';

    //pubsub
    public readonly API_URL_GET_USER_ADMIN_PUB_SUB:string = 'api/getUserAdminPubSub';
    public readonly API_URL_GET_WEBSOCKET_URL: string = 'api/pubsuburl';
    public readonly API_URL_LIVE_STREAM_MATCH:string = 'api/getStreamingUrl';


    public readonly API_GET_WEB_SETTING:string = 'api/getWebAppSettings/'+environment.clientId;
    public readonly API_SAVE_WEB_SETTING:string = 'api/junglee-admin/saveWebSettings';

    public readonly API_GET_CASINO_PROVIDER:string = 'api/junglee-admin/getMemberWiseCasinoProviderList';

    public readonly API_GET_BANK_USERS: string = 'api/junglee-admin/getBankUsers';
    public readonly API_URL_GET_IN_PLAY_UPCOMING: string = '/api/getMarketWatchInplay';
    public readonly API_GET_ADMIN_ACCOUNT_STATEMENT: string = 'api/junglee-admin/getAdminAccountStatement';
    public readonly API_GET_ADMIN_ACCOUNT_STATEMENT_NEW: string = 'api/getAdminAccountStatementNew';
    public readonly API_GET_PUBSUB_STATUS: string = 'api/getPubsubStatus';
    public readonly API_START_WEBJOB: string = 'api/startAzureSocketAndWebJob';
    public readonly API_GET_COMMISSION_REPORT: string = 'api/getAdminCommissionReport';
    public readonly API_RESET_COMMISSION_REPORT: string = 'api/resetCommission';


    public readonly API_URL_POST_BOOKMAKER_MARKET: string = 'api/getMarketWatchOtherMarket';
    public readonly API_URL_POST_FANCY_MARKET: string = 'api/getFancyMarketForAdmin';
    public readonly API_URL_GET_NOTICE: string = 'api/getNoticeForAdmin';
    public readonly API_URL_GET_CUSTOM_MARKET: string = 'api/getMarketWatchCustomMarket';
    //BANK
    public readonly API_GET_ADJUST_CASINO_AMOUNT: string = 'api/junglee-admin/settleCasinoAmount';
    public readonly API_GET_CASINO_SUMMARY: string = 'api/junglee-admin/getCasinoWinSummary';



}
