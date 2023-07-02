import React, { useMemo } from 'react';
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

//// styles
import styles from './Table.module.scss'
import CommonModalI from '../Modals/commonTypes';

interface TableProps {
    data: any,
    columns: any
}
type Person = {
    name: {
      firstName: string;
      lastName: string;
    };
    address: string;
    city: string;
    state: string;
  };

const Table = (props: TableProps) => {
    const {
        data,
        columns
    } = props
    // console.log('cols', columns)

    //nested data is ok, see accessorKeys in ColumnDef below
const datas: Person[] = [
    {
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      address: '261 Erdman Ford',
      city: 'East Daphne',
      state: 'Kentucky',
    },
    {
      name: {
        firstName: 'Jane',
        lastName: 'Doe',
      },
      address: '769 Dominic Grove',
      city: 'Columbus',
      state: 'Ohio',
    },
    {
      name: {
        firstName: 'Joe',
        lastName: 'Doe',
      },
      address: '566 Brakus Inlet',
      city: 'South Linda',
      state: 'West Virginia',
    },
    {
      name: {
        firstName: 'Kevin',
        lastName: 'Vandy',
      },
      address: '722 Emie Stream',
      city: 'Lincoln',
      state: 'Nebraska',
    },
    {
      name: {
        firstName: 'Joshua',
        lastName: 'Rolluffs',
      },
      address: '32188 Larkin Turnpike',
      city: 'Omaha',
      state: 'Nebraska',
    },
  ];

  const colUpdated = columns && columns.length > 0 && data && data.length > 0 && columns.map((item: any) => (
    {
        accessorKey: data?.map((dt: any) => dt[item]),
        header: item
    }
  ))
  console.log('res', colUpdated)

  const column = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Names',
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    [],
  );
  
//     const column = useMemo<MRT_ColumnDef<Person>[]>(
//         () => columns?.map((item: any, index: number) => ({accessorKey: item, header: item})),
//         []
//     )
  

//   return <MaterialReactTable columns={colUpdated && colUpdated.length > 0 ? colUpdated : []} data={datas}/>
}

export default Table