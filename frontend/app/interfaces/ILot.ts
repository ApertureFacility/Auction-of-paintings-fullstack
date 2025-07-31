

export interface LotSmallCard {
  id: number;
  image_url: string;
  title: string;
  author: string;
  current_price: number | string;
  start_price?: number | string;
  [key: string]: any;
}

export interface LotResponse {
    items: LotSmallCard[];
    total: number;
  }

export  type AuctionLotCardProps = {
    lot: LotSmallCard;
  };

export interface LotSingleDetailedCard  {
  id: number;
  title: string;
  description?: string;
  start_price: number;
  current_price?: number;
  start_time?: string;
  owner_id?: number;
  lot_materials?: string;
  auction_name?: string;
  author?: string;
  image_url?: string;
};  