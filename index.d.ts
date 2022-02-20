declare namespace FaceitStats {
  interface MatchStats {
    date: number;
    match_id: string;
    headshots: number;
    kills: number;
    deaths: number;
    assists: number;
    triple: number;
    quadro: number;
    penta: number;
    win: number;
    map: string;
    rounds: number;
  }
  interface Match {}
}
