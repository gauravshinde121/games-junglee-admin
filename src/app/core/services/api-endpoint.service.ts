// Angular Modules
import { Injectable } from '@angular/core';
// Application Classes
import { UrlBuilder } from '@shared/models/url-builder';
import { QueryStringParameters } from '@shared/models/query-string-parameters';

// Application Constants
import { Constants } from '@config/constant';

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

  public getAllUserEndpoint():string{
    return this.createUrl(this._constants.API_URL_ALL_USERS);
  }

  public testFuncEndpoint():string{
    return this.createUrl(this._constants.API_URL_TEST_FUNC);
  }

  public getSingleUserEndpoint():string{
    return this.createUrl(this._constants.API_URL_SINGLE_USERS);
  }

  public getCreateNewUserEndpoint():string{
    return this.createUrl(this._constants.API_URL_CREATE_USER);
  }

  public getAdjustWinningsEndpoint():string{
    return this.createUrl(this._constants.API_URL_ADJUST_WINNINGS);
  }

  public getTransferStatementEndpoint(){
    return this.createUrl(this._constants.API_URL_TRANSFER_STATEMENT);
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

  public getSurveillanceDataEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_SURVEILLANCE_DATA)
  }

  public getBetDetailsForWorkStationEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_BET_DETAILS_FOR_WORK_STATION)
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


  public getMemberLoginHistoryEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MEMBER_LOGIN_HISTORY)
  }

  public getMemberBooksForBackendEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_MEMBER_BOOKS_FOR_BACKEND)
  }

  public getAllUserBetsEndpoint(){
    return this.createUrl(this._constants.API_URL_GET_ALL_USER_BETS)
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
  
  public deleteBetEndpoint(){
    return this.createUrl(this._constants.API_URL_DELETE_BET)
  } 
  


}
