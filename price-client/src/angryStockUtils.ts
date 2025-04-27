import moment from 'moment';
import { PriceUpdateEvent } from './AngryStockApi';
import { AngryStock } from './App';

export const applyPriceUpdateOrCreateNewStock = (
    priceUpdate: PriceUpdateEvent,
    existing?: AngryStock
): AngryStock => {
    return {
        id: priceUpdate.Id,
        name: priceUpdate.Name,
        price: priceUpdate.Price,
        previosPrice: existing ? existing.price : undefined,
        priceChange: existing ? priceUpdate.Price - existing.price : undefined,
        updatedAt: moment(priceUpdate.LastUpdated).toDate(),
    };
};
