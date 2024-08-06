// Angular Modules
import { Injectable } from '@angular/core';
// Application Classes
import { UrlBuilder } from '@shared/models/url-builder';
import { QueryStringParameters } from '@shared/models/query-string-parameters';

// Application Constants
import { Constants } from '@config/constant';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class ApiEndpointsService {
  constructor(
    // Application Constants
    private _constants: Constants
  ) { }
  /* #region URL CREATOR */
  // URL
  private createUrl(
    action: string,
    isMockAPI: boolean = false
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      isMockAPI ? this._constants.API_MOCK_ENDPOINT :
        this._constants.API_ENDPOINT,
      action
    );
    return urlBuilder.toString();
  }
  // URL WITH QUERY PARAMS
  private createUrlWithQueryParameters(
    action: string,
    queryStringHandler?:
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }

  // URL WITH QUERY PARAMS
  private createUrlWithQueryParametersExclude(
    action: string,
    queryStringHandler?:
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }

  // URL WITH PATH VARIABLES
  private createUrlWithPathVariables(
    action: string,
    pathVariables: any[] = []
  ): string {
    let encodedPathVariablesUrl: string = '';
    // Push extra path variables
    for (const pathVariable of pathVariables) {
      if (pathVariable !== null) {
        encodedPathVariablesUrl +=
          `/${encodeURIComponent(pathVariable.toString())}`;
      }
    }
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      `${action}${encodedPathVariablesUrl}`
    );
    return urlBuilder.toString();
  }
  /* #endregion */


  //Example

  //   public getNewsEndpoint(): string {
  //     return this.createUrl('news');
  //   }

  //   This method will return:
  //    https://domain.com/api/news


  //   public getNewsEndpoint(): string {
  //     return this.createUrl('news', true);
  //   }

  //   This method will return:
  //   https://mock-domain.com/api/news


  //   public getProductListByCountryAndPostalCodeEndpoint(
  //     countryCode: string,
  //     postalCode: string
  //   ): string {
  //     return this.createUrlWithQueryParameters(
  //       'productlist',
  //       (qs: QueryStringParameters) => {
  //         qs.push('countryCode', countryCode);
  //         qs.push('postalCode', postalCode);
  //       }
  //     );
  //   }

  //   This method will return:
  //   https://domain.com/api/productlist?countrycode=en&postalcode=12345


  //   public getDataByIdAndCodeEndpoint(
  //     id: string,
  //     code: number
  //   ): string {
  //     return this.createUrlWithPathVariables('data', [id, code]);
  //   }

  //   This method will return:
  //   https://domain.com/api/data/12/67


  // Now, let’s go to a component and use them all together.

  // constructor(
  //   // Application Services
  //   private apiHttpService: ApiHttpService,
  //   private apiEndpointsService: ApiEndpointsService
  // ) {
  //     ngOnInit() {
  //     this.apiHttpService
  //       .get(this.apiEndpointsService.getNewsEndpoint())
  //       .subscribe(() => {
  //         console.log('News loaded'))
  //       });
  // }

  public getLoginEndpoint(): string {
    return this.createUrl(this._constants.API_URL_LOGIN);
  }

  public addBalanceDataEndpoint(): string {
    return this.createUrl(this._constants.API_URL_ADD_BALANCE);
  }

  public getAdminDetailEndpoint(): string {
    return this.createUrl(this._constants.API_URL_ADMIN_INFO);
  }

  public getExposureDetailEndpoint(): string {
    return this.createUrl(this._constants.API_URL_GET_EXPOSURE_DETAILS);
  }


  public getAllUserEndpoint():string{
    return this.createUrl(this._constants.API_URL_ALL_USERS);
  }

  public getAllUserAccountEndpoint():string{
    return this.createUrl(this._constants.API_URL_GET_USERACCOUNTLIST);
  }


  public getBooksForMarket():string{
    return this.createUrl(this._constants.API_URL_BOOKS_MARKET)
  }

  public getBankUserEndpoint():string{
    return this.createUrl(this._constants.API_GET_BANK_USERS);
  }

  public getInPlayUpcomingEndPoint(): string {
    return this.createUrl(this._constants.API_URL_GET_IN_PLAY_UPCOMING);
  }

  public testFuncEndpoint():string{
    return this.createUrl(this._constants.API_URL_TEST_FUNC);
  }

  public getCustomMarketEndpoint():string{
    return this.createUrl(this._constants.API_URL_GET_CUSTOM_MARKET);
  }


  public getNoticeForUserEndpoint():string{
    return this.createUrl(this._constants.API_URL_GET_NOTICE);
  }

  public postBookMakerMarketEndpoint():string{
    return this.createUrl(this._constants.API_URL_POST_BOOKMAKER_MARKET);
  }

  public postFancyEndpoint():string{
    return this.createUrl(this._constants.API_URL_POST_FANCY_MARKET);
  }

  public getUplineSummaryEndpoint():string{
    return this.createUrl(this._constants.API_URL_GET_UPLINE_MEMBERS);
  }

  public getSingleUserEndpoint():string{
    return this.createUrl(this._constants.API_URL_SINGLE_USERS);
  }

  public getCreateNewUserEndpoint():string{
    return this.createUrl(this._constants.API_URL_CREATE_USER);
  }

  public getAdjustWinningsEndpoint():string{
      return this.createUrl(this._constants.API_BANK_BULK_TRANSFER);

  }

  public getTransferStatementEndpoint(){
    return this.createUrl(this._constants.API_URL_TRANSFER_STATEMENT);
  }

  public getPlayerAccountStatementEndpoint(){
    return this.createUrl(this._constants.API_URL_PLAYERWISE_ACCOUNT_STATEMENT);
  }

  public getCasinoReportDetailForAdminEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_CASINO_REPORT_DETAIL);
  }

  public getCasinoReportForAdminEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_CASINO_REPORT);
  }

  public getPlayerListEndpoint(){
    return this.createUrl(this._constants.API_URL_PLAYER_LIST);
  }

  public getCasinoProvidersEndpoint(){
    return this.createUrl(this._constants.API_URL_CASINO_PROVIDERS_LIST);
  }


  public updateGameControlEndpoint(){
    return this.createUrl(this._constants.API_URL_UPDATE_GAME_CONTROL);
  }

  public updateSportsControlEndpoint(){
    return this.createUrl(this._constants.API_URL_UPDATE_SPORTS_CONTROL);
  }

  public getMemberActivityEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MEMBER_ACTIVITY);
  }

  public getMemberBalanceEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MEMBER_BALANCE);
  }

  public getMemberBetsEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MEMBER_BETS);
  }

  public searchMembersEndpoint(){
    return this.createUrl(this._constants.API_URL_SEARCH_MEMBERS);
  }

  public getChangePasswordEndpoint(){
    return this.createUrl(this._constants.API_CHANGE_PASSWORD);
  }


  public getBookForBackendEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_BOOK_FOR_BACKEND);
  }

  public getDownlineAccountsDataEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_DOWNLINE_ACCOUNTS_DATA);
  }

  public getDownlineAccountsDataForMembersEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_DOWNLINE_ACCOUNTS_DATA_FOR_MEMBERS);
  }

  public getPlBySubgame(){
    return this.createUrl(this._constants.API_URL_GET_PL_BY_SUBGAME)
  }

  public getCategoryForTO(){
    return this.createUrl(this._constants.API_URL_GET_CATEGORY_FOR_TO)
  }

  public getTOForMatch(){
    return this.createUrl(this._constants.API_URL_GET_TO_FOR_MATCH)
  }

  public getBetsForMatch(){
    return this.createUrl(this._constants.API_URL_GET_BETS_FOR_TO)
  }

  public getUserBetsForAdminMyPLEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_USER_BETS_FOR_ADMIN_MYPL)
  }

  public getGames(){
    return this.createUrl(this._constants.API_GET_GAMES)
  }

  public getEvents(){
    return this.createUrl(this._constants.API_GET_EVENTS)
  }

  public getSports(){
    return this.createUrl(this._constants.API_GET_SPORTS)
  }

  public getEditUserEndpoint(){
    return this.createUrl(this._constants.API_URL_EDIT_USER)
  }

  public getRolesEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_ROLES)
  }

  public getAllMembersEndpoint(){
    return this.createUrl(this._constants.API_URL_ALL_MEMBERS)
  }

  public getInvalidBetsEndpoint(){
    return this.createUrl(this._constants.API_URL_INVALID_BETS)
  }

  public getUpdateSuperAdminBalanceEndpoint(){
    return this.createUrl(this._constants.API_URL_ADD_BALANCE)
  }

  public getClTransferEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_CL_TRANSFERS)
  }

  public getMatchBySportIdEndpoint(){
    return this.createUrl(this._constants.API_GET_MATCHES_BY_SPORT_ID)
  }

  public getTournamentBySportIdEndpoint(){
    return this.createUrl(this._constants.API_GET_TOURNAMENT_BY_SPORT_ID)
  }

  public getMatchByTournamentIdEndpoint(){
    return this.createUrl(this._constants.API_GET_MATCH_BY_TOURNAMENT_ID)
  }

  public getSurveillanceDataEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_SURVEILLANCE_DATA)
  }

  public getBetDetailsForWorkStationEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_BET_DETAILS_FOR_WORK_STATION)
  }

  public getBooksForAdminBookMgmEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_AMDMIN_BOOK_MGM)
  }

  public getTotalBookEndpoint(){
    return this.createUrl(this._constants.API_URL_TOTAL_BOOK)
  }

  public getOneAccountEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_ONE_ACCOUNT)
  }

  public getMarketsByMatchIdEndpoint(){
    return this.createUrl(this._constants.API_GET_MARKETS_BY_MATCH_ID)
  }

  public getAllMarketTypeEndpoint(){
    return this.createUrl(this._constants.API_GET_MARKET_ALL_TYPE)
  }

  public getTransferStatementForUserEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_TRANSFER_STATEMENT_FOR_USER)
  }

  public getLiveStreamMatch():string{
    return this.createUrl(this._constants.API_URL_LIVE_STREAM_MATCH)
  }

  public getMemberLoginHistoryEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MEMBER_LOGIN_HISTORY)
  }

  public getMemberBooksForBackendEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MEMBER_BOOKS_FOR_BACKEND)
  }

  public getAllUserBetsEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_ALL_USER_BETS)
  }

  public getMatchSettingsListEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MATCH_SETTINGS_LIST)
  }

  public getMarketForAdminMarketSettingsListEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MARKET_SETTINGS_LIST)
  }

  public setBetLimitForMatchEndpoint(){
    return this.createUrl(this._constants.API_URL_SET_BET_LIMIT_FOR_MATCH)
  }

  public suspendMarketEndpoint(){
    return this.createUrl(this._constants.API_URL_SUSPEND_MARKET)
  }

  public setBetLimitForMarketEndpoint(){
    return this.createUrl(this._constants.API_URL_SET_BET_LIMIT_FOR_MARKET)
  }

  public setBetLimitForMultipleMarketEndpoint(){
    return this.createUrl(this._constants.API_URL_SET_BET_LIMIT_FOR_MULTIPLE_MARKET)
  }

  public setMatchActiveStatusEndpoint(){
    return this.createUrl(this._constants.API_URL_SET_MATCH_ACTIVE_STATUS)
  }

  public setMarketStatusForMarketSettingsEndpoint(){
    return this.createUrl(this._constants.API_URL_SET_MARKET_ACTIVE_STATUS)
  }

  public getBetsForBetSettingsEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_BETS_FOR_BET_SETTINGS)
  }

  public getVoidBetsForBetSettingsEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_VOID_BETS_FOR_BET_SETTINGS)
  }

  public getDeletedBetAfterResultListEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_DELETED_BETS_AFTER_RESULT)
  }

  public getMarketBySportIdEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MARKET_BY_SPORT_ID)
  }

  public changeMemberStatusEndpoint(){
    return this.createUrl(this._constants.API_URL_CHANGE_MEMBER_STATUS)
  }

  public changePasswordEndpoint(){
    return this.createUrl(this._constants.API_URL_CHANGE_MEMBER_PASSWORD)
  }

  public adjustWinningsForSingleUserEndpoint(){
      return this.createUrl(this._constants.API_BANK_SETTLEMENT)
  }

  public deleteBetEndpoint(){
    return this.createUrl(this._constants.API_URL_DELETE_BET)
  }
  public ifSuspectBetEndpoint(){
    return this.createUrl(this._constants.API_URL_IF_SUSPECT_BET)
  }

  public getWebSocketURLByDevice():string{
    return this.createUrl(this._constants.API_URL_GET_WEBSOCKET_URL_BY_DEVICE)
  }

  public getUniqueDeviceKey():string{
    return this.createUrl(this._constants.API_URL_UNIQUE_DEVICE_KEY)
  }


  public getUserAdminPubSubEndPoint(){
    return this.createUrl(this._constants.API_URL_GET_USER_ADMIN_PUB_SUB)
  }

  public getWebSocketURLEndpoint(): string {
    return this.createUrl(this._constants.API_URL_GET_WEBSOCKET_URL);
  }


  public getUserByUplineId(): string {
    return this.createUrl(this._constants.API_URL_GET_USER_BY_UPLINE_ID);
  }

  public getWebSettingsEndpoint(): string {
    return this.createUrl(this._constants.API_GET_WEB_SETTING);
  }

  public saveWebSettingsEndpoint(): string {
    return this.createUrl(this._constants.API_SAVE_WEB_SETTING);
  }


  public getLadderForAdminEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_LADDER_FOR_ADMIN)
  }

  public getLadderForAdminMemberListExposureEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_LADDER_FOR_ADMIN_MEMBER_LIST)
  }

  public getCasinoProvideEndpoint(){
    return this.createUrl(this._constants.API_GET_CASINO_PROVIDER)
  }

  public getAdminAccountStatementEndpoint(){
    return this.createUrl(this._constants.API_GET_ADMIN_ACCOUNT_STATEMENT)
  }


  public getToggleBetEndpoint(){
    return this.createUrl(this._constants.API_URL_TOGGLEBET)
  }

  public getBetStatusEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_BET_STATUS)
  }


  public getAdjustCasinoEndpoint(){
      return this.createUrl(this._constants.API_BANK_BANK_CASINO_SETTLEMENT)
  }


  public getCasinoSummaryEndpoint(){
    return this.createUrl(this._constants.API_GET_CASINO_SUMMARY)
  }

  public getPubSubStatusEndpoint(){
    return this.createUrl(this._constants.API_GET_PUBSUB_STATUS)
  }

  public getStartWebJobEndpoint(){
    return this.createUrl(this._constants.API_START_WEBJOB)
  }

  public getCommissionReportEndpoint(){
    return this.createUrl(this._constants.API_GET_COMMISSION_REPORT)
  }

  public getResetCommissionReportEndpoint(){
    return this.createUrl(this._constants.API_RESET_COMMISSION_REPORT)
  }

  public geCreditSettlementEndpoint(){
    return this.createUrl(this._constants.API_CREDIT_SETTLEMENT)
  }

  public geWinningSettlementEndpoint(){
    return this.createUrl(this._constants.API_WINNING_SETTLEMENT)
  }

  public getCasinoSettlementEndpoint(){
    return this.createUrl(this._constants.API_CASINO_SETTLEMENT)
  }


  public geAdminAccountStatementNewEndpoint(){
    return this.createUrl(this._constants.API_GET_ADMIN_ACCOUNT_STATEMENT_NEW)
  }


  public geBetsForMarketWatchEndpoint(){
    return this.createUrl(this._constants.API_GET_BET_FOR_MARKETWATCH)
  }


  public getMarketForMarketWatchEndpoint(){
    return this.createUrl(this._constants.API_GET_MARKET_FOR_MARKETWATCH)
  }

  public sendOtpMessageEndpoint(){
    return this.createUrl(this._constants.API_SEND_OTP_FOR_ADMIN)
  }


  public verifyOtpEndpoint(){
    return this.createUrl(this._constants.API_VERIFY_OTP_FOR_ADMIN)
  }

  public getUserWiseBooksForMarketWatchEndpoint(){
    return this.createUrl(this._constants.API_GET_USER_BOOK_FOR_MARKETWATCH)
  }


}
