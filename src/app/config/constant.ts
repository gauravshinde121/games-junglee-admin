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
    public readonly API_URL_LOGIN: string = '/api/junglee-admin/login';
    public readonly API_URL_SIGNUP: string = 'api/userRegistration';


    public readonly API_URL_USER_DETAIL: string = 'api/getUserDetails';

    //header
    public readonly API_URL_ADMIN_INFO: string = 'api/getAdminInfo';


    //member
    public readonly API_URL_ALL_USERS: string = 'api/junglee-admin/allUsers';
    public readonly API_URL_SINGLE_USERS: string = 'api/junglee-admin/getUserById';
    public readonly API_URL_CREATE_USER: string = 'api/junglee-admin/createNewUser';
    public readonly API_URL_EDIT_USER: string = 'api/junglee-admin/edit-user';
    public readonly API_URL_ADJUST_WINNINGS: string = 'api/junglee-admin/adjustWinnings';
    public readonly API_URL_UPDATE_GAME_CONTROL: string = 'api/junglee-admin/updateGameControl';
    public readonly API_URL_UPDATE_SPORTS_CONTROL: string = 'api/junglee-admin/updateSportsControl';
    public readonly API_URL_GET_MEMBER_ACTIVITY: string = 'api/junglee-admin/getMemberActivity';
    public readonly API_URL_GET_MEMBER_BALANCE: string = 'api/junglee-admin/getBalanceForMember';
    public readonly API_URL_GET_MEMBER_BETS: string = 'api/junglee-admin/getMemberBets';
    public readonly API_URL_GET_DOWNLINE_ACCOUNTS_DATA: string = 'api/junglee-admin/getDownlineAccountsData';
    public readonly API_URL_GET_DOWNLINE_ACCOUNTS_DATA_FOR_MEMBERS: string = 'api/junglee-admin/getDownLineAccountsForMember';
    public readonly API_URL_GET_ROLES: string = 'api/junglee-admin/getRoles';


    //book management
    public readonly API_URL_GET_BOOK_FOR_BACKEND: string = 'api/junglee-admin/getBooksForBackend';


    //account statement
    public readonly API_URL_TRANSFER_STATEMENT: string = 'api/junglee-admin/getAdminTransferStatement';
    public readonly API_URL_GET_PL_BY_SUBGAME: string = 'api/junglee-admin/getAdminPlBySubGame';
    public readonly API_URL_GET_CATEGORY_FOR_TO: string = 'api/junglee-admin/getCategoryForTO';
    public readonly API_URL_GET_TO_FOR_MATCH: string = 'api/junglee-admin/getTurnOverForMatch';


    //change password
    public readonly API_CHANGE_PASSWORD: string = 'api/junglee-admin/changePassword';


    //misc
    public readonly API_GET_EVENTS: string = 'api/junglee-admin/getEvents';
    public readonly API_GET_MATCHES_BY_SPORT_ID: string = 'api/getMatchBySportId';
    public readonly API_GET_GAMES: string = 'api/junglee-admin/getGames';

    //settings
    public readonly API_URL_ADD_BALANCE: string = 'api/junglee-admin/addSuperAdminBalance';
    public readonly API_URL_GET_CL_TRANSFERS: string = 'api/junglee-admin/getClTransferStatement';

}
