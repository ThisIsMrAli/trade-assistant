import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";

export default function App() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d"
      )
      .then((res) => {
        // console.log(res);

        setRowData(
          res.data.map((d) => {
            return {
              ...d,
              h24_ratio: ((
                d.price_change_percentage_24h_in_currency -
                res.data[0].price_change_percentage_24h_in_currency
              )).toFixed(3),
              h1_ratio: ((
                d.price_change_percentage_1h_in_currency -
                res.data[0].price_change_percentage_1h_in_currency
              )).toFixed(3),
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, []);

  const defaultColDef = {
    sortable: true,
  };

  const columnDefs = [
    {
      headerName: "Rank",
      field: "market_cap_rank",
    },
    {
      headerName: "Name",
      field: "name",
    },
    {
      headerName: "Symbol",
      field: "symbol",
    },
    {
      headerName: "Price",
      field: "current_price",
      valueFormatter: ({ value }) => `$${value.toFixed(2)}`,
    },
    {
      headerName: "24h %",
      field: "price_change_percentage_24h_in_currency",
      valueFormatter: ({ value }) => `${value.toFixed(2)}%`,
      cellClassRules: {
        "cell-value-up": ({ value }) => value > 0,
        "cell-value-down": ({ value }) => value < 0,
      },
    },
    {
      headerName: "1h %",
      field: "price_change_percentage_1h_in_currency",
      valueFormatter: ({ value }) => `${parseFloat(value).toFixed(2)}%`,
      cellClassRules: {
        "cell-value-up": ({ value }) => parseFloat(value) > 0,
        "cell-value-down": ({ value }) => parseFloat(value) < 0,
      },
    },
    //   headerName: "Market Cap",
    //   field: "market_cap",
    //   valueFormatter: ({ value }) => `$${value.toLocaleString()}`,
    // },

    {
      headerName: "Condition",
      valueGetter: ({ data }) => {
        const priceChangeRatio = data.h24_ratio;
        if (priceChangeRatio < -3) {
          return "Underpriced";
        } else if (priceChangeRatio < 3) {
          return "Fair value";
        } else {
          return "Overpriced";
        }
      },
      cellClassRules: {
        "text-red-500": ({ data }) => data.h24_ratio < -3,
        "text-yellow-500": ({ data }) =>
          data.h24_ratio >= -3 && data.h24_ratio < 3,
        "text-green-500": ({ data }) => data.h24_ratio >= 3,
      },
    },

    {
      headerName: "24h Ratio",
      valueGetter: ({ data }) => data.h24_ratio,
      cellClassRules: {
        "text-red-500": ({ data }) => data.h24_ratio < -3,
        "text-yellow-500": ({ data }) =>
          data.h24_ratio >= -3 && data.h24_ratio < 3,
        "text-green-500": ({ data }) => data.h24_ratio >= 3,
      },
    },
    {
      headerName: "1h Ratio",
      valueGetter: ({ data }) => data.h1_ratio,
      cellClassRules: {
        "text-red-500": ({ data }) => data.h1_ratio < -3,
        "text-yellow-500": ({ data }) =>
          data.h1_ratio >= -3 && data.h1_ratio < 3,
        "text-green-500": ({ data }) => data.h1_ratio >= 3,
      },
    },
  ];
  const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
    },
    animateRows: true,
  };
  return (
    <div className="ag-theme-alpine-dark h-screen">
      {rowData && (
        <AgGridReact rowData={rowData} gridOptions={gridOptions}></AgGridReact>
      )}
    </div>
  );
}
