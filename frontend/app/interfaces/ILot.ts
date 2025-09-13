

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

  export interface AuctionLotCardProps {
    lot: LotSmallCard;
    onRemoveFavorite?: (id: number) => void;
    isFavorite?: boolean;
  }
  
  
  
  

export interface LotSingleDetailedCard  {
  end_time: string | number | Date;
  is_forced_started: boolean;
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