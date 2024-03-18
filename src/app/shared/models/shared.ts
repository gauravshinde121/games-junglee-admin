export interface Isports {
    sportId: string,
    sportName: string,
    marketCount: number,
    createDate: string
}

export interface Cricket {
    name: string;
    back: number;
    back2: number;
    back3: number;
    lay: number;
    lay2: number;
    lay3: number;
}

export enum EMarketType {
  MATCH_TYPE = 1,
  BOOKMAKER_TYPE = 2,
  FANCY_TYPE = 3,
  LINE_TYPE = 4,
}

export enum EMarketName{
  MATCH_ODDS_SPACE ='MATCH ODDS',
  MATCH_ODDS_UNDERSCORE ='MATCH_ODDS',
  FANCY ='FANCY',
  BOOKMAKER ='BOOKMAKER',
  LINE = 'LINE MARKET'
}
