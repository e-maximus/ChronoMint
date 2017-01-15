import React from 'react';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

const data = {
  tablePage: {
    items: [
      {id: 1, name: 'Product 1', price: '$50.00', category: 'Category 1'},
      {id: 2, name: 'Product 2', price: '$150.00', category: 'Category 2'},
      {id: 3, name: 'Product 3', price: '$250.00', category: 'Category 3'},
      {id: 4, name: 'Product 4', price: '$70.00', category: 'Category 4'},
      {id: 5, name: 'Product 5', price: '$450.00', category: 'Category 5'},
      {id: 6, name: 'Product 6', price: '$950.00', category: 'Category 6'},
      {id: 7, name: 'Product 7', price: '$550.00', category: 'Category 7'},
      {id: 8, name: 'Product 8', price: '$750.00', category: 'Category 8'}
    ]
  },
  dashBoardPage: {
    LOCsList: [
        {id: 1, title: 'LOC 1', text: '7000 LHAU issued.'},
        {id: 2, title: 'LOC 2', text: '100000 LHAU issued.'},
        {id: 3, title: 'LOC 3', text: '55000 LHAU issued.'},
        {id: 4, title: 'LOC 4', text: '20000 LHAU issued.'}
    ],
    WorkersList: [
        {id: 1, title: 'Worker 1', text: '70 LHAU paid.'},
        {id: 2, title: 'Worker 2', text: '10 LHAU paid.'},
        {id: 3, title: 'Worker 3', text: '55 LHAU paid.'},
        {id: 4, title: 'Worker 4', text: '20 LHAU paid.'}
    ],
    monthlySales: [
      {name: 'Jan', uv: 3700},
      {name: 'Feb', uv: 3000},
      {name: 'Mar', uv: 2000},
      {name: 'Apr', uv: 2780},
      {name: 'May', uv: 2000},
      {name: 'Jun', uv: 1800},
      {name: 'Jul', uv: 2600},
      {name: 'Aug', uv: 2900},
      {name: 'Sep', uv: 3500},
      {name: 'Oct', uv: 3000},
      {name: 'Nov', uv: 2400},
      {name: 'Dec', uv: 2780}
    ],
    newOrders: [
      {pv: 2400},
      {pv: 1398},
      {pv: 9800},
      {pv: 3908},
      {pv: 4800},
      {pv: 3490},
      {pv: 4300}
    ],
    browserUsage: [
      {name: 'LOC 1', value: 800, color: "#161240", icon: <ExpandMore/>},
      {name: 'LOC 2', value: 300, color: "#17579c", icon: <ChevronRight/>},
      {name: 'LOC 3', value: 300, color: "#4a8fb9", icon: <ExpandLess/>}
    ]
  }
};

export default data;
