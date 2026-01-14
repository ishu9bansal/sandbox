import { columnsBuilder } from "@/components/DataTable/columns";

export const instrumentsColumnBuilder = () => columnsBuilder(
  {
    key: 'name',
    header: 'Underlying',
    sortable: true,
    filterable: true,
  },
  {
    key: 'expiry',
    header: 'Expiry',
    sortable: true,
    filterable: true,
  },
  {
    key: 'strike',
    header: 'Strike',
    sortable: true,
    filterable: true,
  },
  {
    key: 'instrument_type',
    header: 'Option Type',
    sortable: true,
    filterable: true,
  },
);
