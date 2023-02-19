import { h } from "preact";
import { useMemo } from "preact/hooks";
import { useQuery } from "@apollo/client";
import { GET_PEACEKEEPER_ITEMS } from "../../services/tarkov-api";
import {
  createColumnHelper,
  TableOptions,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

type ItemPriceProfit = {
  itemName: string;
  sellPriceUsd: number;
  fleaPriceRub: number;
  fleaPriceRubAvg: number;
  sellPriceRub: number;
  profit: number;
  profitAvg: number;
};

const VendorIsPeacekeeper = (data: { vendor: { name: string } }) =>
  data.vendor.name === "Peacekeeper";

const columnHelper = createColumnHelper<ItemPriceProfit>();

const columns = [
  columnHelper.accessor("itemName", {
    header: () => <span>Item</span>,
    cell: (v) => <i>{v.getValue()}</i>,
  }),
  columnHelper.accessor("fleaPriceRub", {
    header: () => <span>Flea price RUB</span>,
  }),
  columnHelper.accessor("fleaPriceRubAvg", {
    header: () => <span>Flea price average RUB</span>,
  }),
  columnHelper.accessor("sellPriceUsd", {
    header: () => <span>Sell for USD</span>,
  }),
  columnHelper.accessor("sellPriceRub", {
    header: () => <span>Sell for RUB</span>,
  }),
  columnHelper.accessor("profit", {
    header: () => <span>Profit</span>,
  }),
  columnHelper.accessor("profitAvg", {
    header: () => <span>Profit average</span>,
  }),
];

const ItemTable = ({
  overrideRubToUsd,
}: {
  overrideRubToUsd: number | null;
}) => {
  // TODO: Auto-refresh ~5mins or refresh button.
  const { data } = useQuery(GET_PEACEKEEPER_ITEMS);
  const tableData = useMemo(() => {
    const rubToUsd =
      data?.usd[0].buyFor?.filter(VendorIsPeacekeeper)[0].priceRUB;
    const rows = data?.infoItems
      .filter((i) => i.lastLowPrice !== null)
      .map<ItemPriceProfit>((i) => {
        const usdPrice = i.sellFor?.filter(VendorIsPeacekeeper)[0]?.price;
        const fleaPrice = i.lastLowPrice;
        const sellPrice = (overrideRubToUsd || rubToUsd) * usdPrice;
        return {
          itemName: i.name,
          sellPriceUsd: usdPrice,
          fleaPriceRub: i.lastLowPrice || 0,
          fleaPriceRubAvg: i.avg24hPrice || 0,
          sellPriceRub: sellPrice,
          profit: sellPrice - fleaPrice,
          profitAvg: sellPrice - (i.avg24hPrice || 0),
        };
      })
      .sort((a, b) => b.profit - a.profit);

    return { rows: rows || [], rubToUsd: overrideRubToUsd || rubToUsd || 0 };
  }, [data, overrideRubToUsd]);

  const tableOptions: TableOptions<ItemPriceProfit> = {
    columns,
    data: tableData.rows,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (r) => r.itemName,
  };

  const table = useReactTable(tableOptions);

  return (
    <div>
      {/* TODO: Timestamp when data was fetched */}
      {/* TODO: Proper styling for table/data, color for profit/loss */}
      <div>USD Price: {tableData.rubToUsd}</div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
