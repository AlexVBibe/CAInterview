import { useEffect, useState } from 'react';
import AngryStockBlotter from './AngryStockBlotter';
import Toolbar from './Toolbar';
import { AngryStock } from './AngryStock';
import { AngryStockApi, PriceUpdateEvent } from './AngryStockApi';
import { applyPriceUpdateOrCreateNewStock } from './angryStockUtils';

export interface AngryStock {
    id: number;
    name: string;
    price: number;
    updatedAt: Date;
    previosPrice?: number;
    priceChange?: number;
}

function App() {
    const [angryStocks, setAngryStocks] = useState<AngryStock[]>([]);
    const [isSubscribed, setIsSubscribed] = useState(
        AngryStockApi.isSubscribed()
    );

    const subscribeHandler = () => setIsSubscribed(true);
    const unsubscribeHandler = () => setIsSubscribed(false);
    useEffect(() => {
        if (!isSubscribed) {
            AngryStockApi.unsubscribeFromStockUpdates();
            return;
        }
        AngryStockApi.subscribeToStockUpdates(
            (priceUpdate: PriceUpdateEvent) => {
                setAngryStocks((prevStocks) => {
                    const existing = prevStocks.find(
                        (i) => i.id === priceUpdate.Id
                    );
                    if (!existing) {
                        return [
                            ...prevStocks,
                            applyPriceUpdateOrCreateNewStock(priceUpdate),
                        ];
                    }
                    const newStockItems = prevStocks.map((angryStock) =>
                        angryStock.id === priceUpdate.Id
                            ? applyPriceUpdateOrCreateNewStock(
                                  priceUpdate,
                                  existing
                              )
                            : angryStock
                    );
                    return newStockItems;
                });
            }
        );
    }, [isSubscribed]);

    return (
        <AngryStock>
            <div>
                <Toolbar
                    isSubscribed={isSubscribed}
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                />
                <AngryStockBlotter angryStocks={angryStocks} />
            </div>
        </AngryStock>
    );
}

export default App;
