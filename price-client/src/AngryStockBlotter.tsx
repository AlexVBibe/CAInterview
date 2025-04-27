import React from 'react';
import styled from 'styled-components';
import { AngryStock } from './App';

const TableWrapper = styled.div`
    padding: 0px 16px 0 16px;
`;

const TableTitle = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 16px;
`;

const StyledTable = styled.table`
    width: 50%;
    background-color: white;
    border-collapse: collapse; /* Make sure borders are merged */
    border: 1px solidrgb(208, 222, 243); /* Outer border */
`;

const TableHeader = styled.th`
    padding: 8px 12px;
    border-bottom: 2px solid #d1d5db; /* Border between rows */
    text-align: left;
    font-weight: bold;
    background-color: rgb(205, 209, 214);
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
    padding: 8px 12px;
    border-bottom: 1px solid #d1d5db; /* Border between rows */
    text-align: left;
`;

interface AngryStockBlotterProps {
    angryStocks: AngryStock[];
}

const AngryStockBlotter: React.FC<AngryStockBlotterProps> = (
    props: AngryStockBlotterProps
) => {
    const { angryStocks } = props;

    return (
        <TableWrapper>
            <TableTitle>Angry Stock Blotter</TableTitle>
            <StyledTable>
                <thead>
                    <tr>
                        <TableHeader>Angry Stock</TableHeader>
                        <TableHeader>New Price ($)</TableHeader>
                        <TableHeader>Last Update</TableHeader>
                    </tr>
                </thead>
                <tbody>{angryStocks.map((item) => buildRow(item))}</tbody>
            </StyledTable>
        </TableWrapper>
    );

    function buildRow(item: AngryStock) {
        return (
            <tr key={item.id}>
                {buildStockNameColumn('py-2 px-4', item)}
                {buildPriceColumn('py-2 px-4', item)}
                {buildUpdatedAtColumn('py-2 px-4', item)}
            </tr>
        );

        function buildUpdatedAtColumn(className: string, item: AngryStock) {
            return <TableCell>{item.updatedAt.toLocaleTimeString()}</TableCell>;
        }

        function buildPriceColumn(className: string, item: AngryStock) {
            return <TableCell>{buildPriceChange(item)}</TableCell>;
        }

        function buildStockNameColumn(className: string, item: AngryStock) {
            return <TableCell>{item.name}</TableCell>;
        }

        function buildPriceChange(item: AngryStock) {
            const priceValue = item.price.toFixed(2);
            const isPositive = item.priceChange && item.priceChange > 0;
            const isNegative = item.priceChange && item.priceChange < 0;
            const isEqual = item.priceChange && item.priceChange === 0;
            if (isPositive)
                return (
                    <span style={{ color: 'green' }}>&uarr; {priceValue}</span>
                );
            else if (isNegative)
                return (
                    <span style={{ color: 'red' }}>&darr; {priceValue}</span>
                );
            else if (isEqual) return <span>{priceValue}</span>;
            else return <span>{priceValue}</span>;
        }
    }
};

export default AngryStockBlotter;
